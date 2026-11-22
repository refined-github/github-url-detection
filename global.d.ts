/* eslint-disable @typescript-eslint/consistent-type-definitions -- Module augmentation */

// Broaden types because testing against `"undefined"` is fine for our regexes
interface RegExp {
	test(s: string | undefined): boolean;
}

declare module 'virtual:examples' {
	// Detection name => URLs or other detections
	const examples: Record<string, string[]>;
	export default examples;
}
