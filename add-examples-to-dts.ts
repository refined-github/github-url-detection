#!/usr/bin/env tsx
import {readFileSync, writeFileSync} from 'node:fs';
// Import index.ts first to populate the test data
import './index.ts';
import {getTests} from './collector.ts';

// Read the generated .d.ts file
const dtsPath = './distribution/index.d.ts';
const dtsContent = readFileSync(dtsPath, 'utf8');

// Process each exported function
const lines = dtsContent.split('\n');
const outputLines: string[] = [];

for (let i = 0; i < lines.length; i++) {
	const line = lines[i];
	
	// Check if this is a function declaration
	const match = line.match(/^export declare const (\w+):/);
	if (match) {
		const functionName = match[1];
		
		// Get the tests/examples for this function
		const examples = getTests(functionName);
		
		// Only add examples if they exist and aren't just references to other functions
		if (examples && examples.length > 0 && examples[0] !== 'combinedTestOnly') {
			// Filter to only include actual URLs (not references to other functions)
			const urlExamples = examples.filter(url => url.startsWith('http'));
			
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
