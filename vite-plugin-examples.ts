import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import type {Plugin} from 'vite';

const sourcePath = fileURLToPath(new URL('index.ts', import.meta.url));
const moduleId = '\0virtual:examples';

/** Provides the `@example` and `@see` entries of the JSDoc of each detection in `index.ts` */
export function examples(): Plugin {
	return {
		name: 'examples',
		resolveId: id => id === 'virtual:examples' ? moduleId : undefined,
		load(id) {
			if (id !== moduleId) {
				return;
			}

			this.addWatchFile(sourcePath);
			const entries: Record<string, string[]> = {};
			for (const [, jsdoc, name] of readFileSync(sourcePath, 'utf8').matchAll(/^\/\*\*\n((?: \*(?: .*)?\n)*) \*\/\nexport (?:const|function) (\w+)/gm)) {
				const tags = [...jsdoc!.matchAll(/^ \* @(?:example|see) (\S+)/gm)].map(match => match[1]!);
				if (tags.length > 0) {
					entries[name!] = tags;
				}
			}

			return `export default ${JSON.stringify(entries)};`;
		},
	};
}
