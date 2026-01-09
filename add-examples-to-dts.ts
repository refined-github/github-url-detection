#!/usr/bin/env tsx
import {readFileSync, writeFileSync} from 'node:fs';
// Import index.ts to populate the test data via side effect
// eslint-disable-next-line import/no-unassigned-import, n/file-extension-in-import
import './index.ts';
// eslint-disable-next-line n/file-extension-in-import
import {getTests} from './collector.ts';

// Read the generated .d.ts file
const dtsPath = './distribution/index.d.ts';
const dtsContent = readFileSync(dtsPath, 'utf8');

// Process each exported function
const lines = dtsContent.split('\n');
const outputLines: string[] = [];

for (const line of lines) {
	// Check if this is a function declaration
	const match = /^export declare const (\w+):/.exec(line);
	if (match) {
		const functionName = match[1];

		// Get the tests/examples for this function
		const examples = getTests(functionName);

		// Only add examples if they exist and aren't just references to other functions
		if (examples && examples.length > 0 && examples[0] !== 'combinedTestOnly') {
			// Filter to only include actual URLs (not references to other functions)
			const urlExamples = examples.filter((url: string) => url.startsWith('http'));

			if (urlExamples.length > 0) {
				// Add JSDoc comment with examples before the declaration
				outputLines.push('/**');
				for (const url of urlExamples) {
					outputLines.push(` * @example ${url}`);
				}

				outputLines.push(' */');
			}
		}
	}

	outputLines.push(line);
}

// Write the modified content back
writeFileSync(dtsPath, outputLines.join('\n'), 'utf8');

console.log('✓ Added example URLs to index.d.ts');
