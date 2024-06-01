/* eslint-disable @typescript-eslint/consistent-type-definitions -- Module augmentation */

interface ImportMeta {
	readonly vitest: unknown;
	readonly env: ImportMetaEnv;
}

// Broaden types because testing against `"undefined"` is fine for our regexes
interface RegExp {
	test(s: string | undefined): boolean;
}
