/** @file This needs to be in a separate file so it can bee tree-shaken before being published, while still being importable by tests */

export const testableUrls = new Map<string, string[]>();

export function addTests(test: string, urls: string[]): void {
	// eslint-disable-next-line n/prefer-global/process -- Better not import `process` to avoid bundling its polyfills by mistake
	if (process.env.NODE_ENV !== 'bundling') {
		testableUrls.set(test, urls);
	}
}

export function getTests(detectName: string): string[] {
	if (detectName === 'combinedTestOnly') {
		return ['combinedTestOnly'];
	}

	return testableUrls.get(detectName)?.flatMap(url => url.startsWith('http') ? url : getTests(url) ?? []) ?? [];
}

export function getAllUrls(): Set<string> {
	return new Set<string>([...testableUrls.values()].flat().filter(url => url.startsWith('http')));
}
