import test from 'ava';
import {JSDOM} from 'jsdom';
import stripIndent from 'strip-indent';
import * as pageDetect from './source';
import collector from './source/collector';

const {window} = new JSDOM('…');

(global as any).document = window.document;
(global as any).location = new URL('https://github.com');

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
			location.href = url;
			t.true(detect(), stripIndent(`
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
				location.href = url;
				t.false(detect(), stripIndent(`
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
