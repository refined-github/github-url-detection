<script lang="ts">
	const defaultUrl = 'https://github.com/fregante/github-url-detection';
	export let url = '';
	import * as urlDetection from '../../esm';

	let isUrlValid: boolean;
	$: {
		try {
			new URL(url || defaultUrl);
			isUrlValid = true;
		} catch {
			isUrlValid = false
		}
	}
	interface Detection {
		name: string;
		detect?: (url: URL) => boolean;
		result?: boolean;
	}

	let detections: Array<Detection | undefined> = [];
	$: {
		if (isUrlValid) {
			detections = Object
				.entries(urlDetection)
				.map(([name, detect]) => {
					if (typeof detect !== 'function') {
						return;
					}

					if (String(detect).startsWith('(url')) {
						return {
							name,
							detect,
							result: detect(new URL(url || defaultUrl))
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
				})
		}
	}
</script>

<label>
	<span>URL:</span> <input type="text" bind:value={url} placeholder={defaultUrl} autocomplete="off" autocorrect="off" list="url-examples">
</label>

<datalist id="url-examples">
	<option value="https://github.big-corp.com/gist/">
	<option value="https://github.com/marketplace/actions/urlchecker-action">
	<option value="https://github.com/sindresorhus/refined-github/pull/148">
	<option value="https://github.com/sindresorhus/refined-github/edit/master/readme.md">
	<option value="https://github.com/sindresorhus/refined-github/commit/5b614b9035f2035b839f48b4db7bd5c3298d526f">
</datalist>


{#if isUrlValid}
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
