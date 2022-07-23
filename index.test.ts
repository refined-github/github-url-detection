import {test, expect} from 'bun:test';
import stripIndent from 'strip-indent';
import collector from './collector.js';
import * as pageDetect from './index.js';

(global as any).document = {title: ''};
(global as any).location = new URL('https://github.com/');

const allUrls = new Set<string>([...collector.values()].flat());

allUrls.delete('combinedTestOnly');

const assert = {
	isTrue(a) {
		expect(a).toBe(true);
	},
	isFalse(a) {
		expect(a).toBe(false);
	},
	equal(a, b) {
		expect(a).toBe(b);
	},
};

for (const [detectName, detect] of Object.entries(pageDetect)) {
	if (typeof detect !== 'function') {
		continue;
	}

	const validURLs = collector.get(detectName);

	if (validURLs === 'combinedTestOnly' || String(detect).startsWith('() =>')) {
		continue;
	}

	test(detectName + ' has tests', () => {
		assert.isTrue(
			Array.isArray(validURLs),
			`The function \`${detectName}\` doesn’t have any tests. Set them via \`collect.set()\``,
		);
	});

	if (!Array.isArray(validURLs)) {
		continue;
	}

	for (const url of validURLs) {
		test(`${detectName} ${url.replace('https://github.com', '')}`, () => {
			assert.isTrue(
				detect(new URL(url)),
				stripIndent(`
					Is this URL \`${detectName}\`?
						${url.replace('https://github.com', '')}

					• Yes? The \`${detectName}\` test is wrong and should be fixed.
					• No? Remove it from its \`collect.set()\` array.
				`),
			);
		});
	}

	// Skip negatives for this one, it's too long
	if (detectName === 'isRepo') {
		continue;
	}

	for (const url of allUrls) {
		if (!validURLs.includes(url)) {
			test(`${detectName} NO ${url}`, () => {
				assert.isFalse(
					detect(new URL(url)),
					stripIndent(`
						Is this URL \`${detectName}\`?
							${url.replace('https://github.com', '')}

						• Yes? Add it to the \`collect.set()\` array.
						• No? The \`${detectName}\` test is wrong and should be fixed.
					`),
				);
			});
		}
	}
}

test('is404', () => {
	document.title = 'Page not found · GitHub';
	assert.isTrue(pageDetect.is404());

	document.title = 'examples/404: Page not found examples';
	assert.isFalse(pageDetect.is404());

	document.title = 'Dashboard';
	assert.isFalse(pageDetect.is404());

	document.title = 'Page not found · Issue #266 · sintaxi/surge · GitHub';
	assert.isFalse(pageDetect.is404());
});

test('is500', () => {
	document.title = 'Server Error · GitHub';
	assert.isTrue(pageDetect.is500());

	document.title = 'Unicorn! · GitHub';
	assert.isTrue(pageDetect.is500());

	document.title = 'examples/500: Server Error examples';
	assert.isFalse(pageDetect.is500());

	document.title = 'sindresorhus/unicorn: You can’t tell what doesn’t exist';
	assert.isFalse(pageDetect.is500());

	document.title = 'Dashboard';
	assert.isFalse(pageDetect.is500());

	document.title = 'Server Error · Issue #266 · sintaxi/surge · GitHub';
	assert.isFalse(pageDetect.is500());
});

test('isPRCommit404', () => {
	document.title = 'Commit range not found · Pull Request #3227 · sindresorhus/refined-github';
	location.href = 'https://github.com/sindresorhus/refined-github/pull/3227/commits/32c8a88360a85739f151566eae0225d530ce6a15';
	assert.isTrue(pageDetect.isPRCommit404());

	document.title = 'Experiment with `@primer/octicons-react` icons by FloEdelmann · Pull Request #3227 · sindresorhus/refined-github';
	location.href = 'https://github.com/sindresorhus/refined-github/pull/3227/commits/edbdcdd5559a2a8da78abdc7cb0814155713974c';
	assert.isFalse(pageDetect.isPRCommit404());

	document.title = 'Commit range not found by SomeContributor · Pull Request #999999 · sindresorhus/refined-github';
	location.href = 'https://github.com/sindresorhus/refined-github/pull/999999/commits/32c8a88360a85739f151566eae0225d530ce6a15';
	assert.isFalse(pageDetect.isPRCommit404());
});

test('isPRFile404', () => {
	document.title = 'Commit range not found · Pull Request #789 · sindresorhus/eslint-plugin-unicorn';
	location.href = 'https://github.com/sindresorhus/eslint-plugin-unicorn/pull/789/files/a58b37845f1b2660221de019e4ae6c736feedc26..eed168224d7994652b1d1ff69a5c8cebee223faf';
	assert.isTrue(pageDetect.isPRFile404());

	document.title = 'Add `align-repository-header` feature by fregante · Pull Request #3313 · sindresorhus/refined-github';
	location.href = 'https://github.com/sindresorhus/refined-github/pull/3313/files/a14fb2c94eae3ca83a3a97688a171fcc3405524f..fbeeba9825f12b5ded9cd4bb04d5df4b0cf2f2a8';
	assert.isFalse(pageDetect.isPRFile404());
});

const {getRepositoryInfo} = pageDetect.utils;
test('getRepositoryInfo', () => {
	const inputTypes = [
		getRepositoryInfo, // Full URL
		(url: string) => getRepositoryInfo(new URL(url).pathname), // Pathname only
		(url: string) => getRepositoryInfo(new URL(url)), // URL object
	];
	for (const getRepositoryInfoAdapter of inputTypes) {
		assert.equal(getRepositoryInfoAdapter('https://github.com'), undefined);
		assert.equal(getRepositoryInfoAdapter('https://gist.github.com/'), undefined);
		assert.equal(getRepositoryInfoAdapter('https://github.com/settings/developers'), undefined);
		assert.equal(getRepositoryInfoAdapter('https://github.com/refined-github/github-url-detection'), {
			owner: 'refined-github',
			name: 'github-url-detection',
			nameWithOwner: 'refined-github/github-url-detection',
			path: '',
		});
		assert.equal(getRepositoryInfoAdapter('https://github.com/refined-github/github-url-detection/'), {
			owner: 'refined-github',
			name: 'github-url-detection',
			nameWithOwner: 'refined-github/github-url-detection',
			path: '',
		});
		assert.equal(getRepositoryInfoAdapter('https://github.com/refined-github/github-url-detection/blame/master/package.json'), {
			owner: 'refined-github',
			name: 'github-url-detection',
			nameWithOwner: 'refined-github/github-url-detection',
			path: 'blame/master/package.json',
		});
		assert.equal(getRepositoryInfoAdapter('https://github.com/refined-github/github-url-detection/commit/57bf4'), {
			owner: 'refined-github',
			name: 'github-url-detection',
			nameWithOwner: 'refined-github/github-url-detection',
			path: 'commit/57bf4',
		});
		assert.equal(getRepositoryInfoAdapter('https://github.com/refined-github/github-url-detection/compare/test-branch?quick_pull=0'), {
			owner: 'refined-github',
			name: 'github-url-detection',
			nameWithOwner: 'refined-github/github-url-detection',
			path: 'compare/test-branch',
		});
		assert.equal(getRepositoryInfoAdapter('https://github.com/refined-github/github-url-detection/tree/master/distribution'), {
			owner: 'refined-github',
			name: 'github-url-detection',
			nameWithOwner: 'refined-github/github-url-detection',
			path: 'tree/master/distribution',
		});
		assert.equal(getRepositoryInfoAdapter('https://github.com/refined-github/github-url-detection/tree/master/distribution/'), {
			owner: 'refined-github',
			name: 'github-url-detection',
			nameWithOwner: 'refined-github/github-url-detection',
			path: 'tree/master/distribution',
		});
	}
});
