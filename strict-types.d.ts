// Import the StrictlyParseSelector type for strict validation
import type {StrictlyParseSelector} from 'typed-query-selector/parser';

// Import strict types from typed-query-selector
/* eslint-disable @typescript-eslint/consistent-type-definitions -- Global augmentation requires interface */
declare global {
	interface ParentNode {
		querySelector<S extends string, E extends StrictlyParseSelector<S>>(
			selector: S,
		): [E] extends [never] ? never : E | undefined;

		querySelectorAll<S extends string, E extends StrictlyParseSelector<S>>(
			selector: S,
		): [E] extends [never] ? never : NodeListOf<E>;
	}

	interface Element {
		closest<S extends string, E extends StrictlyParseSelector<S>>(
			selector: S,
		): [E] extends [never] ? never : E | undefined;
	}
}
/* eslint-enable @typescript-eslint/consistent-type-definitions */

// Export the type for use in index.ts

export {type StrictlyParseSelector} from 'typed-query-selector/parser';
