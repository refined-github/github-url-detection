/* eslint-disable @typescript-eslint/consistent-type-definitions -- Module augmentation */
/// <reference path="./node_modules/typed-query-selector/strict.d.ts" />

// Broaden types because testing against `"undefined"` is fine for our regexes
interface RegExp {
	test(s: string | undefined): boolean;
}
