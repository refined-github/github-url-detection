/* eslint-disable n/prefer-global/process */
import {readFileSync, writeFileSync} from 'node:fs';
import {execSync} from 'node:child_process';
// Import index.ts to populate the test data via side effect
// eslint-disable-next-line import/no-unassigned-import, n/file-extension-in-import
import './index.ts';
// eslint-disable-next-line n/file-extension-in-import
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

// Process each exported function
const lines = dtsContent.split('\n');
const outputLines: string[] = [];
let examplesAdded = 0;

for (const line of lines) {
	// Check if this is a function declaration
	const match = /^export declare const (\w+):/.exec(line);
	if (match) {
		const functionName = match[1];

		// Get the tests/examples for this function
		const examples = getTests(functionName);

		// Only add examples if they exist and aren't the special 'combinedTestOnly' marker
		if (examples && examples.length > 0 && examples[0] !== 'combinedTestOnly') {
			// Filter to only include actual URLs (not references to other functions)
			const urlExamples = examples.filter((url: string) => url.startsWith('http'));

			if (urlExamples.length > 0) {
				// Check if there's an existing JSDoc block immediately before this line
				let jsDocumentEndIndex = -1;
				let jsDocumentStartIndex = -1;
				let isSingleLineJsDocument = false;

				// Look backwards from outputLines to find JSDoc
				for (let index = outputLines.length - 1; index >= 0; index--) {
					const previousLine = outputLines[index];
					const trimmed = previousLine.trim();

					if (trimmed === '') {
						continue; // Skip empty lines
					}

					// Check for single-line JSDoc: /** ... */
					if (trimmed.startsWith('/**') && trimmed.endsWith('*/') && trimmed.length > 5) {
						jsDocumentStartIndex = index;
						jsDocumentEndIndex = index;
						isSingleLineJsDocument = true;
						break;
					}

					// Check for multi-line JSDoc ending
					if (trimmed === '*/') {
						jsDocumentEndIndex = index;
						// Now find the start of this JSDoc
						for (let k = index - 1; k >= 0; k--) {
							if (outputLines[k].trim().startsWith('/**')) {
								jsDocumentStartIndex = k;
								break;
							}
						}

						break;
					}

					// If we hit a non-JSDoc line, there's no JSDoc block
					break;
				}

				if (jsDocumentStartIndex >= 0 && jsDocumentEndIndex >= 0) {
					// Extend existing JSDoc block
					if (isSingleLineJsDocument) {
						// Convert single-line to multi-line and add examples
						const singleLineContent = outputLines[jsDocumentStartIndex];
						// Extract the comment text without /** and */
						const commentText = singleLineContent.trim().slice(3, -2).trim();

						// Replace the single line with multi-line format
						outputLines[jsDocumentStartIndex] = '/**';
						if (commentText) {
							outputLines.splice(jsDocumentStartIndex + 1, 0, ` * ${commentText}`);
						}

						// Add examples after the existing content
						const insertIndex = jsDocumentStartIndex + (commentText ? 2 : 1);
						for (const url of urlExamples) {
							outputLines.splice(insertIndex + urlExamples.indexOf(url), 0, ` * @example ${url}`);
						}

						outputLines.splice(insertIndex + urlExamples.length, 0, ' */');
						examplesAdded += urlExamples.length;
					} else {
						// Insert @example lines before the closing */
						for (const url of urlExamples) {
							outputLines.splice(jsDocumentEndIndex, 0, ` * @example ${url}`);
						}

						examplesAdded += urlExamples.length;
					}
				} else {
					// Add new JSDoc comment with examples before the declaration
					outputLines.push('/**');
					for (const url of urlExamples) {
						outputLines.push(` * @example ${url}`);
					}

					outputLines.push(' */');
					examplesAdded += urlExamples.length;
				}
			}
		}
	}

	outputLines.push(line);
}

// Add marker at the beginning
const finalContent = `${marker}\n${outputLines.join('\n')}`;

// Validate that we added some examples
if (examplesAdded === 0) {
	console.error('❌ Error: No examples were added. This likely indicates a problem with the script.');
	process.exit(1);
}

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
