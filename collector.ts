/** @file Reads the example URLs from the JSDoc of each detection in `index.ts` */
import {fileURLToPath} from 'node:url';
import {Project} from 'ts-morph';

// `@example` is a URL, `@see` is another detection
export const testableUrls = new Map<string, string[]>();

const source = new Project({skipAddingFilesFromTsConfig: true})
	.addSourceFileAtPath(fileURLToPath(new URL('index.ts', import.meta.url)));

for (const statement of source.getVariableStatements()) {
	const entries: string[] = [];
	for (const tag of statement.getJsDocs().flatMap(doc => doc.getTags())) {
		const [, name, value] = /^@(\w+)\s*(\S*)/.exec(tag.getText()) ?? [];
		if ((name === 'example' || name === 'see') && value) {
			entries.push(value);
		}
	}

	if (statement.isExported() && entries.length > 0) {
		testableUrls.set(statement.getDeclarations()[0]!.getName(), entries);
	}
}

export function getTests(detectName: string): string[] {
	return testableUrls.get(detectName)?.flatMap(url => url.startsWith('http') ? url : getTests(url) ?? []) ?? [];
}

export function getAllUrls(): Set<string> {
	return new Set<string>([...testableUrls.values()].flat().filter(url => url.startsWith('http')));
}
