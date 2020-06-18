import test from 'ava';
import {JSDOM} from 'jsdom';
import stripIndent from 'strip-indent';
import * as pageDetect from './index'; // `index` ensures that it loads the source, not what's specified in `package.json`
import collector from './collector';

const jsdom = new JSDOM('…');

(global as any).document = jsdom.window.document;
(global as any).location = jsdom.window.location;

const allUrls = new Set<string>([...collector.values()].flat());
allUrls.delete('combinedTestOnly');

for (const [detectName, detect] of Object.entries(pageDetect)) {
	if (typeof detect !== 'function') {
		continue;
	}

	const validURLs = collector.get(detectName);

	if (validURLs === 'combinedTestOnly' || String(detect).startsWith('() =>')) {
		continue;
	}

	test(detectName + ' has tests', t => {
		t.true(Array.isArray(validURLs), `The function \`${detectName}\` doesn’t have any tests. Set them via \`collect.set()\``);
	});

	if (!Array.isArray(validURLs)) {
		continue;
	}

	for (const url of validURLs) {
		test(`${detectName} ${url.replace('https://github.com', '')}`, t => {
			t.true(detect(new URL(url)), stripIndent(`
				Is this URL \`${detectName}\`?
					${url.replace('https://github.com', '')}

				• Yes? The \`${detectName}\` test is wrong and should be fixed.
				• No? Remove it from its \`collect.set()\` array.
			`));
		});
	}

	// Skip negatives for this one, it's too long
	if (detectName === 'isRepo') {
		continue;
	}

	for (const url of allUrls) {
		if (!validURLs.includes(url)) {
			test(`${detectName} NO ${url}`, t => {
				t.false(detect(new URL(url)), stripIndent(`
					Is this URL \`${detectName}\`?
						${url.replace('https://github.com', '')}

					• Yes? Add it to the \`collect.set()\` array.
					• No? The \`${detectName}\` test is wrong and should be fixed.
				`));
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
	jsdom.reconfigure({url: 'https://github.com/sindresorhus/refined-github/pull/3227/commits/32c8a88360a85739f151566eae0225d530ce6a15'});
	t.true(pageDetect.isPRCommit404());

	document.title = 'Experiment with `@primer/octicons-react` icons by FloEdelmann · Pull Request #3227 · sindresorhus/refined-github';
	jsdom.reconfigure({url: 'https://github.com/sindresorhus/refined-github/pull/3227/commits/edbdcdd5559a2a8da78abdc7cb0814155713974c'});
	t.false(pageDetect.isPRCommit404());

	document.title = 'Commit range not found by SomeContributor · Pull Request #999999 · sindresorhus/refined-github';
	jsdom.reconfigure({url: 'https://github.com/sindresorhus/refined-github/pull/999999/commits/32c8a88360a85739f151566eae0225d530ce6a15'});
	t.false(pageDetect.isPRCommit404());
});

test('getRepoPath', t => {
	const pairs = new Map<string, string | undefined>([
		[
			'https://github.com',
			undefined,
		],
		[
			'https://gist.github.com/',
			undefined,
		],
		[
			'https://github.com/settings/developers',
			undefined,
		],
		[
			'https://github.com/sindresorhus/refined-github',
			'',
		],
		[
			'https://github.com/sindresorhus/refined-github/',
			'',
		],
		[
			'https://github.com/sindresorhus/refined-github/blame/master/package.json',
			'blame/master/package.json',
		],
		[
			'https://github.com/sindresorhus/refined-github/commit/57bf4',
			'commit/57bf4',
		],
		[
			'https://github.com/sindresorhus/refined-github/compare/test-branch?quick_pull=0',
			'compare/test-branch',
		],
		[
			'https://github.com/sindresorhus/refined-github/tree/master/distribution',
			'tree/master/distribution',
		],
	]);

	for (const [url, result] of pairs) {
		t.is(result, pageDetect.utils.getRepoPath(new URL(url)));
	}
});
