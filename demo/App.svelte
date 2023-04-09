<script>

	import parseUrl from './parse-url.js';
	import * as urlDetection from '../index';
	import { getAllUrls } from '../collector';

	const urlParameter = new URLSearchParams(location.search);
	const defaultUrl = 'https://github.com/refined-github/github-url-detection';
	// Parse partial URL in the URL parameter so that it's shown as full URL in the input
	let url = parseUrl(urlParameter.get('url')).href || '';

	const allUrls = [...getAllUrls()].sort();

	let parsedUrl;
	// Do not use ?? because it should work on empty strings
	$: parsedUrl = parseUrl(url || defaultUrl);

	let detections = [];
	$: {
		if (parsedUrl) {
			if (url) {
				urlParameter.set('url', url.replace('https://github.com', ''));
				history.replaceState(null, '', `?${urlParameter}`);
			} else {
				history.replaceState(null, '', location.pathname);
			}
			detections = Object.entries(urlDetection)
				.map(([name, detect]) => {
					if (typeof detect !== 'function') {
						return;
					}

					if (!String(detect).startsWith('()')) {
						return {
							name,
							detect,
							result: detect(parsedUrl)
						};
					} else {
						return {name};
					}
				})
				.filter(Boolean)
				.sort((a, b) => {
					// Pull true values to the top
					if (a.result || b.result) {
						return a.result ? b.result ? 0 : -1 : 1;
					}

					// Push false values to the top
					if (a.detect || b.detect) {
						return a.detect ? b.detect ? 0 : 1 : -1;
					}

					// DOM-based detections should be in the middle
				});
		}
	}
</script>

<style>
	input {
		width: 100%;
	}
	.true {
		font-weight: bold;
	}
	.true span {
		color: #22863a;
	}
	.false span {
		color: #ff3e00;
	}
	.undefined {
		color: gray;
	}
</style>

<label>
	<span>URL:</span>
	<input
		type="search"
		bind:value={url}
		placeholder={defaultUrl}
		autocomplete="off"
		autocorrect="off"
		list="url-examples" />
</label>

<datalist id="url-examples">
	{#each [...allUrls] as url}
		<option value={url} />
	{/each}
</datalist>

{#if parsedUrl}
	<pre><code>
		{#each detections as {name, detect, result} (name)}
				{#if detect}
					<div class={String(result)}>
					{name}(url) // <span>{String(result)}</span></div>
				{:else}
					<div class="undefined">
					{name}() // undeterminable via URL</div>
				{/if}
			{/each}
	</code></pre>
{:else}
	<p>URL entered isn’t valid</p>
{/if}
