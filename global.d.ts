/* eslint-disable @typescript-eslint/consistent-type-definitions -- Module augmentation */

// Enable strict mode for querySelector to ensure selectors are valid
// eslint-disable-next-line import-x/no-unassigned-import, import-x/no-empty-named-blocks
import type {} from 'typed-query-selector/strict';

// Broaden types because testing against `"undefined"` is fine for our regexes
declare global {
	interface RegExp {
		test(s: string | undefined): boolean;
	}
}

export {};
