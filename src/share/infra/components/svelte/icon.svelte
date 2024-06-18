<script lang="ts">
	import { prefsState } from '$pref/infra/stores/svelte'

	export let id: string
	export let type: 'icon' | 'logo' | 'flag' = 'icon'
</script>

{#if type === 'icon'}
	<svg height="1.5em" width="1.5em"><use href="/sprites/icons/{$prefsState.iconTheme.toLowerCase()}.svg#{id}" /></svg>
{:else if type === 'logo'}
	<svg height="1.5em" width="1.5em"><use href="/sprites/logos.svg#{id}" stroke="url(#iconoirGradient)" /></svg>
{:else}
	<svg height="1.5em" width="1.5em" class="flag">
		<use href="/sprites/flags.svg#{id}" />
	</svg>
{/if}

<style>
	svg {
		aspect-ratio: 1 /1;
	}

	.flag {
		border-radius: 50%;
	}
</style>
