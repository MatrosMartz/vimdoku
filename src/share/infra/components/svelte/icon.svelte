<script lang="ts">
	import { prefsState } from '$pref/infra/stores/svelte'

	export let id: string
</script>

<svg height="1.5em" width="1.5em"><use href="/sprites/{$prefsState.iconTheme}.svg#{id}"></use></svg>

<style>
	svg {
		aspect-ratio: 1 /1;
	}
</style>
