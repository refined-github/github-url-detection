<script>
	// Required to include the URLs in the testableUrls Map
	import * as urlDetection from '../index';
	import { testableUrls } from '../collector';

	// Required to work around the aggressive tree-shaking
	urlDetection.isRepo()
</script>

<style>
	pre, code {
		white-space: nowrap;
	}
	pre a {
		color: inherit;
	}
</style>
{#each [...testableUrls] as [detection, urls]}
	{#if !detection.startsWith('_')}
		<h2 id={detection}><a href="#{detection}">{detection}</a></h2>

		<pre><code>
		{#each urls as url}
			<a href="/url={encodeURIComponent(url)}">{url}</a><br>
		{/each}
		</code></pre>
	{/if}
{/each}
