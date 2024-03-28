<script lang="ts">
	import * as HelpPages from '~/help/infra/components/svelte/pages'
	import { TitleHelp } from '~/help/infra/components/svelte/share'
	import { HelpSubPath } from '$screen/domain/entities'

	export let subPath: HelpSubPath
</script>

<section class="help-container">
	<TitleHelp />
	{#if subPath === HelpSubPath.Main}
		<HelpPages.Main />
	{:else}
		<h5>help subPath:{subPath}</h5>
		<p>No deberías estar acá...</p>
	{/if}
</section>

<style>
	.help-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: calc(100% - 2rem);
		max-width: 50rem;
		padding: 1.5rem 2rem;
		overflow: hidden;
		background-color: rgb(var(--editor-background));
		border-radius: 16px;
	}

	@media (width >= 480px) {
		.help-container {
			padding: 2.2rem 4rem;
		}
	}
</style>
