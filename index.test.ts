/// <reference lib="dom" />
import assert from 'node:assert/strict';
import {test, expect} from 'vitest';
import stripIndent from 'strip-indent';
import {getAllUrls, getTests} from './collector.js';
import * as pageDetect from './index.js';

(globalThis as any).document = {title: ''};
(globalThis as any).location = new URL('https://github.com/');

const allUrls = getAllUrls();

for (const [detectName, detect] of Object.entries(pageDetect)) {
	if (typeof detect !== 'function') {
		continue;
	}

	const validURLs = getTests(detectName);

	if (validURLs[0] === 'combinedTestOnly' || String(detect).startsWith('() =>')) {
		continue;
	}

	test(detectName + ' has tests', () => {
		assert.ok(
			Array.isArray(validURLs),
			`The function \`${detectName}\` doesn’t have any tests. Set them via \`collect.set()\``,
		);
	});

	if (!Array.isArray(validURLs)) {
		continue;
	}

	for (const url of validURLs) {
		test(`${detectName} ${url.replace('https://github.com', '')}`, () => {
			assert.ok(
				detect(new URL(url)),
				stripIndent(`
					Is this URL \`${detectName}\`?
						${url.replace('https://github.com', '')}

					• Yes? The \`${detectName}\` detection is wrong and should be fixed.
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
				assert.equal(
					detect(new URL(url)),
					false,
					stripIndent(`
						Is this URL \`${detectName}\`?
							${url.replace('https://github.com', '')}

						• Yes? Add it to the \`collect.set()\` array.
						• No? The \`${detectName}\` detection is wrong and should be fixed.
					`),
				);
			});
		}
	}
}

test('is404', () => {
	document.title = 'Page not found · GitHub';
	assert.ok(pageDetect.is404());

	document.title = 'File not found · GitHub';
	assert.ok(pageDetect.is404());

	document.title = 'examples/404: Page not found examples';
	assert.equal(pageDetect.is404(), false);

	document.title = 'Dashboard';
	assert.equal(pageDetect.is404(), false);

	document.title = 'Page not found · Issue #266 · sintaxi/surge · GitHub';
	assert.equal(pageDetect.is404(), false);
});

test('is500', () => {
	document.title = 'Server Error · GitHub';
	assert.ok(pageDetect.is500());

	document.title = 'Unicorn! · GitHub';
	assert.ok(pageDetect.is500());

	document.title = 'examples/500: Server Error examples';
	assert.equal(pageDetect.is500(), false);

	document.title = 'sindresorhus/unicorn: You can’t tell what doesn’t exist';
	assert.equal(pageDetect.is500(), false);

	document.title = 'Dashboard';
	assert.equal(pageDetect.is500(), false);

	document.title = 'Server Error · Issue #266 · sintaxi/surge · GitHub';
	assert.equal(pageDetect.is500(), false);
});

test('isPRCommit404', () => {
	document.title = 'Commit range not found · Pull Request #3227 · sindresorhus/refined-github';
	location.href = 'https://github.com/sindresorhus/refined-github/pull/3227/commits/32c8a88360a85739f151566eae0225d530ce6a15';
	assert.ok(pageDetect.isPRCommit404());

	document.title = 'Experiment with `@primer/octicons-react` icons by FloEdelmann · Pull Request #3227 · sindresorhus/refined-github';
	location.href = 'https://github.com/sindresorhus/refined-github/pull/3227/commits/edbdcdd5559a2a8da78abdc7cb0814155713974c';
	assert.equal(pageDetect.isPRCommit404(), false);

	document.title = 'Commit range not found by SomeContributor · Pull Request #999999 · sindresorhus/refined-github';
	location.href = 'https://github.com/sindresorhus/refined-github/pull/999999/commits/32c8a88360a85739f151566eae0225d530ce6a15';
	assert.equal(pageDetect.isPRCommit404(), false);
});

test('isPRFile404', () => {
	document.title = 'Commit range not found · Pull Request #789 · sindresorhus/eslint-plugin-unicorn';
	location.href = 'https://github.com/sindresorhus/eslint-plugin-unicorn/pull/789/files/a58b37845f1b2660221de019e4ae6c736feedc26..eed168224d7994652b1d1ff69a5c8cebee223faf';
	assert.ok(pageDetect.isPRFile404());

	document.title = 'Add `align-repository-header` feature by fregante · Pull Request #3313 · sindresorhus/refined-github';
	location.href = 'https://github.com/sindresorhus/refined-github/pull/3313/files/a14fb2c94eae3ca83a3a97688a171fcc3405524f..fbeeba9825f12b5ded9cd4bb04d5df4b0cf2f2a8';
	assert.equal(pageDetect.isPRFile404(), false);
});

test('isRepoFile404', () => {
	document.title = 'File not found';
	location.href = 'https://github.com/fregante/GhostText/tree/3cacd7df71b097dc525d99c7aa2f54d31b02fcc8/chrome/scripts/InputArea';
	assert.ok(pageDetect.isRepoFile404());

	document.title = 'File not found';
	location.href = 'https://github.com/refined-github/refined-github/blob/some-non-existent-ref/source/features/bugs-tab.tsx';
	assert.ok(pageDetect.isRepoFile404());
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
		expect(getRepositoryInfoAdapter('https://github.com/refined-github/github-url-detection')).toMatchSnapshot();
		expect(getRepositoryInfoAdapter('https://github.com/refined-github/github-url-detection/')).toMatchSnapshot();
		expect(getRepositoryInfoAdapter('https://github.com/refined-github/github-url-detection/blame/master/package.json')).toMatchSnapshot();
		expect(getRepositoryInfoAdapter('https://github.com/refined-github/github-url-detection/commit/57bf4')).toMatchSnapshot();
		expect(getRepositoryInfoAdapter('https://github.com/refined-github/github-url-detection/compare/test-branch?quick_pull=0')).toMatchSnapshot();
		expect(getRepositoryInfoAdapter('https://github.com/refined-github/github-url-detection/tree/master/distribution')).toMatchSnapshot();
		expect(getRepositoryInfoAdapter('https://github.com/refined-github/github-url-detection/tree/master/distribution/')).toMatchSnapshot();
	}
});

test('parseRepoExplorerTitle', () => {
	const parse = pageDetect.utils.parseRepoExplorerTitle;

	assert.deepEqual(
		parse('/eslint/js/tree/2.x', 'eslint/js at 2.x'),
		{
			nameWithOwner: 'eslint/js',
			branch: '2.x',
			filePath: '',
		},
	);
	assert.deepEqual(
		parse('/eslint/js/tree/2.x', 'js/ at 2.x · eslint/js'),
		{
			nameWithOwner: 'eslint/js',
			branch: '2.x',
			filePath: '',
		},
	);
	assert.deepEqual(
		parse('/eslint/js/tree/2.x/tools', 'js/tools at 2.x · eslint/js'),
		{
			nameWithOwner: 'eslint/js',
			branch: '2.x',
			filePath: 'tools',
		},
	);
	assert.deepEqual(
		parse('/eslint/js/tree/2.x/docs/ast', 'js/docs/ast at 2.x · eslint/js'),
		{
			nameWithOwner: 'eslint/js',
			branch: '2.x',
			filePath: 'docs/ast',
		},
	);
	assert.deepEqual(
		parse('https://github.com/eslint/js', 'only /tree/ URLs are supported'),
		undefined,
	);
	assert.deepEqual(
		parse('https://github.com/eslint/js/issues', 'irrelephant'),
		undefined,
	);
});
