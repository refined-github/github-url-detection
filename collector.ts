/** @file This needs to be in a separate file so it can bee tree-shaken before being published, while still being importable by tests */

export const testableUrls = new Map<string, string[]>();

export function getTests(detectName: string): string[] {
	if (detectName === 'combinedTestOnly') {
		return ['combinedTestOnly'];
	}

	return testableUrls.get(detectName)?.flatMap(url => url.startsWith('http') ? url : getTests(url) ?? []) ?? [];
}

export function getAllUrls(): Set<string> {
	return new Set<string>([...testableUrls.values()].flat().filter(url => url.startsWith('http')));
}
