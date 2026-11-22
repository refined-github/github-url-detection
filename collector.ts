/// <reference types="vite/client" />
import source from './index.ts?raw';

/** @file Reads the example URLs from the JSDoc of each detection in `index.ts` */

// `@example` is a URL, `@see` is another detection
const testableUrls = new Map<string, string[]>();
for (const [, jsdoc, name] of source.matchAll(/^\/\*\*\n((?: \*(?: .*)?\n)*) \*\/\nexport (?:const|function) (\w+)/gm)) {
	const entries = [...jsdoc!.matchAll(/^ \* @(?:example|see) (\S+)/gm)].map(match => match[1]!);
	if (entries.length > 0) {
		testableUrls.set(name!, entries);
	}
}

export function getTests(detectName: string): string[] {
	return [...new Set(testableUrls.get(detectName)?.flatMap(url => url.startsWith('http') ? url : getTests(url)))];
}

export function getAllUrls(): Set<string> {
	return new Set([...testableUrls.values()].flat().filter(url => url.startsWith('http')));
}
