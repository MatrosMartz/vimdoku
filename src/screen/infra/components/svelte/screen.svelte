<script lang="ts">
	import { screenSvelte } from '$cmd/infra/stores'
	import { MainScreenKinds } from '$screen/domain/models'

	import InitialScreen from './initial-screen.svelte'
</script>

{#if $screenSvelte.main === MainScreenKinds.Init}
	<InitialScreen />
{/if}
