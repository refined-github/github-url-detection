import examples from 'virtual:examples';

export function getTests(detectName: string): string[] {
	return [...new Set(examples[detectName]?.flatMap(url => url.startsWith('http') ? url : getTests(url)))];
}

export function getAllUrls(): Set<string> {
	return new Set(Object.values(examples).flat().filter(url => url.startsWith('http')));
}
