/* eslint-disable @typescript-eslint/consistent-type-definitions -- Module augmentation */

/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_KEEP_URLS: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

// Broaden types because testing against `"undefined"` is fine for our regexes
interface RegExp {
	test(s: string | undefined): boolean;
}
