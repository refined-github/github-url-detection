<script>
	import * as urlDetection from '../index';
	import { getTests } from '../collector';
</script>

<style>
	pre, code {
		white-space: nowrap;
	}
	pre a {
		color: inherit;
	}
</style>
{#each Object.keys(urlDetection) as name}
	{#if !name.startsWith('_') && name !== 'utils'}
		<h2 id={name}><a href="#{name}">{name}</a></h2>
		{@const urls = getTests(name)}
		{#if urls[0] === 'combinedTestOnly'}
			<p><em>Demo URLs missing</em></p>
			{:else if urls.length === 0}
			<p><em>Undeterminable via URL</em></p>
		{:else}
			<pre><code>
				{#each urls as url}
					<a href="/?url={encodeURIComponent(url)}">{url}</a><br>
				{/each}
			</code></pre>
		{/if}
	{/if}
{/each}
