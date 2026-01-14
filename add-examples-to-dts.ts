/* eslint-disable n/prefer-global/process, unicorn/no-process-exit, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
import {readFileSync, writeFileSync} from 'node:fs';
import {execSync} from 'node:child_process';
import {Project, type JSDocableNode} from 'ts-morph';
// Import index.ts to populate the test data via side effect
// eslint-disable-next-line import-x/no-unassigned-import
import './index.ts';
import {getTests} from './collector.ts';

// Read the generated .d.ts file
const dtsPath = './distribution/index.d.ts';
const dtsContent = readFileSync(dtsPath, 'utf8');

// Check if script has already been run
const marker = '/* Examples added by add-examples-to-dts.ts */';
if (dtsContent.includes(marker)) {
	console.error('❌ Error: Examples have already been added to this file');
	process.exit(1);
}

// Create a ts-morph project and load the file
const project = new Project();
const sourceFile = project.createSourceFile(dtsPath, dtsContent, {overwrite: true});

let examplesAdded = 0;

/**
 * Add example URLs to a JSDocable node (e.g., variable statement or type alias)
 */
function addExamplesToNode(node: JSDocableNode, urlExamples: string[]): void {
	const jsDoc = node.getJsDocs()[0];

	if (jsDoc) {
		// Add @example tags to existing JSDoc
		const existingTags = jsDoc.getTags();
		const description = jsDoc.getDescription().trim();

		// Build new JSDoc content
		const newJsDocLines: string[] = [];
		if (description) {
			newJsDocLines.push(description);
		}

		// Add existing tags (that aren't @example tags)
		for (const tag of existingTags) {
			if (tag.getTagName() !== 'example') {
				newJsDocLines.push(tag.getText());
			}
		}

		// Add new @example tags
		for (const url of urlExamples) {
			newJsDocLines.push(`@example ${url}`);
		}

		// Replace the JSDoc
		jsDoc.remove();
		node.addJsDoc(newJsDocLines.join('\n'));
	} else {
		// Create new JSDoc with examples
		const jsDocLines: string[] = [];
		for (const url of urlExamples) {
			jsDocLines.push(`@example ${url}`);
		}

		node.addJsDoc(jsDocLines.join('\n'));
	}
}

// Process each exported variable declaration (these are the function declarations)
for (const statement of sourceFile.getVariableStatements()) {
	// Only process exported statements
	if (!statement.isExported()) {
		continue;
	}

	for (const declaration of statement.getDeclarations()) {
		const functionName = declaration.getName();

		// Get the tests/examples for this function
		const examples = getTests(functionName);

		// Only add examples if they exist and aren't the special 'combinedTestOnly' marker
		if (examples && examples.length > 0 && examples[0] !== 'combinedTestOnly') {
			// Filter to only include actual URLs (not references to other functions)
			const urlExamples = examples.filter((url: string) => url.startsWith('http'));

			if (urlExamples.length > 0) {
				addExamplesToNode(statement, urlExamples);
				examplesAdded += urlExamples.length;
			}
		}
	}
}

// Also process exported type aliases (like RepoExplorerInfo)
for (const typeAlias of sourceFile.getTypeAliases()) {
	if (!typeAlias.isExported()) {
		continue;
	}

	const typeName = typeAlias.getName();

	// Get the tests/examples for this type (unlikely but keeping consistency)
	const examples = getTests(typeName);

	if (examples && examples.length > 0 && examples[0] !== 'combinedTestOnly') {
		const urlExamples = examples.filter((url: string) => url.startsWith('http'));

		if (urlExamples.length > 0) {
			addExamplesToNode(typeAlias, urlExamples);
			examplesAdded += urlExamples.length;
		}
	}
}

// Validate that we added some examples
if (examplesAdded === 0) {
	console.error('❌ Error: No examples were added. This likely indicates a problem with the script.');
	process.exit(1);
}

// Get the modified content and add marker
const modifiedContent = sourceFile.getFullText();
const finalContent = `${marker}\n${modifiedContent}`;

// Write the modified content back
writeFileSync(dtsPath, finalContent, 'utf8');

console.log(`✓ Added ${examplesAdded} example URLs to index.d.ts`);

// Validate with TypeScript
try {
	execSync('npx tsc --noEmit distribution/index.d.ts', {
		cwd: process.cwd(),
		stdio: 'pipe',
	});
	console.log('✓ TypeScript validation passed');
} catch (error: unknown) {
	console.error('❌ TypeScript validation failed:');
	const execError = error as {stdout?: Uint8Array; stderr?: Uint8Array; message?: string};
	console.error(execError.stdout?.toString() ?? execError.stderr?.toString() ?? execError.message);
	process.exit(1);
}
