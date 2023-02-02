import test from 'ava';
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

	if (validURLs[0] === 'combinedTestOnly' || String(detect).startsWith('()=>')) {
		continue;
	}

	test(detectName + ' has tests', t => {
		t.true(
			Array.isArray(validURLs),
			`The function \`${detectName}\` doesn’t have any tests. Set them via \`collect.set()\``,
		);
	});

	if (!Array.isArray(validURLs)) {
		continue;
	}

	for (const url of validURLs) {
		test(`${detectName} ${url.replace('https://github.com', '')}`, t => {
			t.true(
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
			test(`${detectName} NO ${url}`, t => {
				t.false(
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

test('is404', t => {
	document.title = 'Page not found · GitHub';
	t.true(pageDetect.is404());

	document.title = 'examples/404: Page not found examples';
	t.false(pageDetect.is404());

	document.title = 'Dashboard';
	t.false(pageDetect.is404());

	document.title = 'Page not found · Issue #266 · sintaxi/surge · GitHub';
	t.false(pageDetect.is404());
});

test('is500', t => {
	document.title = 'Server Error · GitHub';
	t.true(pageDetect.is500());

	document.title = 'Unicorn! · GitHub';
	t.true(pageDetect.is500());

	document.title = 'examples/500: Server Error examples';
	t.false(pageDetect.is500());

	document.title = 'sindresorhus/unicorn: You can’t tell what doesn’t exist';
	t.false(pageDetect.is500());

	document.title = 'Dashboard';
	t.false(pageDetect.is500());

	document.title = 'Server Error · Issue #266 · sintaxi/surge · GitHub';
	t.false(pageDetect.is500());
});

test('isPRCommit404', t => {
	document.title = 'Commit range not found · Pull Request #3227 · sindresorhus/refined-github';
	location.href = 'https://github.com/sindresorhus/refined-github/pull/3227/commits/32c8a88360a85739f151566eae0225d530ce6a15';
	t.true(pageDetect.isPRCommit404());

	document.title = 'Experiment with `@primer/octicons-react` icons by FloEdelmann · Pull Request #3227 · sindresorhus/refined-github';
	location.href = 'https://github.com/sindresorhus/refined-github/pull/3227/commits/edbdcdd5559a2a8da78abdc7cb0814155713974c';
	t.false(pageDetect.isPRCommit404());

	document.title = 'Commit range not found by SomeContributor · Pull Request #999999 · sindresorhus/refined-github';
	location.href = 'https://github.com/sindresorhus/refined-github/pull/999999/commits/32c8a88360a85739f151566eae0225d530ce6a15';
	t.false(pageDetect.isPRCommit404());
});

test('isPRFile404', t => {
	document.title = 'Commit range not found · Pull Request #789 · sindresorhus/eslint-plugin-unicorn';
	location.href = 'https://github.com/sindresorhus/eslint-plugin-unicorn/pull/789/files/a58b37845f1b2660221de019e4ae6c736feedc26..eed168224d7994652b1d1ff69a5c8cebee223faf';
	t.true(pageDetect.isPRFile404());

	document.title = 'Add `align-repository-header` feature by fregante · Pull Request #3313 · sindresorhus/refined-github';
	location.href = 'https://github.com/sindresorhus/refined-github/pull/3313/files/a14fb2c94eae3ca83a3a97688a171fcc3405524f..fbeeba9825f12b5ded9cd4bb04d5df4b0cf2f2a8';
	t.false(pageDetect.isPRFile404());
});

const {getRepositoryInfo} = pageDetect.utils;
test('getRepositoryInfo', t => {
	const inputTypes = [
		getRepositoryInfo, // Full URL
		(url: string) => getRepositoryInfo(new URL(url).pathname), // Pathname only
		(url: string) => getRepositoryInfo(new URL(url)), // URL object
	];
	for (const getRepositoryInfoAdapter of inputTypes) {
		t.is(getRepositoryInfoAdapter('https://github.com'), undefined);
		t.is(getRepositoryInfoAdapter('https://gist.github.com/'), undefined);
		t.is(getRepositoryInfoAdapter('https://github.com/settings/developers'), undefined);
		t.deepEqual(getRepositoryInfoAdapter('https://github.com/refined-github/github-url-detection'), {
			owner: 'refined-github',
			name: 'github-url-detection',
			nameWithOwner: 'refined-github/github-url-detection',
			path: '',
		});
		t.deepEqual(getRepositoryInfoAdapter('https://github.com/refined-github/github-url-detection/'), {
			owner: 'refined-github',
			name: 'github-url-detection',
			nameWithOwner: 'refined-github/github-url-detection',
			path: '',
		});
		t.deepEqual(getRepositoryInfoAdapter('https://github.com/refined-github/github-url-detection/blame/master/package.json'), {
			owner: 'refined-github',
			name: 'github-url-detection',
			nameWithOwner: 'refined-github/github-url-detection',
			path: 'blame/master/package.json',
		});
		t.deepEqual(getRepositoryInfoAdapter('https://github.com/refined-github/github-url-detection/commit/57bf4'), {
			owner: 'refined-github',
			name: 'github-url-detection',
			nameWithOwner: 'refined-github/github-url-detection',
			path: 'commit/57bf4',
		});
		t.deepEqual(getRepositoryInfoAdapter('https://github.com/refined-github/github-url-detection/compare/test-branch?quick_pull=0'), {
			owner: 'refined-github',
			name: 'github-url-detection',
			nameWithOwner: 'refined-github/github-url-detection',
			path: 'compare/test-branch',
		});
		t.deepEqual(getRepositoryInfoAdapter('https://github.com/refined-github/github-url-detection/tree/master/distribution'), {
			owner: 'refined-github',
			name: 'github-url-detection',
			nameWithOwner: 'refined-github/github-url-detection',
			path: 'tree/master/distribution',
		});
		t.deepEqual(getRepositoryInfoAdapter('https://github.com/refined-github/github-url-detection/tree/master/distribution/'), {
			owner: 'refined-github',
			name: 'github-url-detection',
			nameWithOwner: 'refined-github/github-url-detection',
			path: 'tree/master/distribution',
		});
	}
});
