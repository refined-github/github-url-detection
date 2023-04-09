<script>
	import * as urlDetection from '../index';
	import { testableUrls } from '../collector';
	urlDetection.isRepo()
</script>

<style>
	pre, code {
		white-space: nowrap;
	}
</style>
{#each [...testableUrls] as [detection, urls]}
	{#if !detection.startsWith('_')}
		<h2 id={detection}><a href="#{detection}">{detection}</a></h2>

		<pre><code>
		{#each urls as url}
			{url}<br>
		{/each}
		</code></pre>
	{/if}
{/each}
