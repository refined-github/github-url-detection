// Broaden types because testing against `"undefined"` is fine for our regexes
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- Module augmentation
interface RegExp {
	test(s: string | undefined): boolean;
}
