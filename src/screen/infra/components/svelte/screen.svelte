<script lang="ts">
	import { screenSvelte } from '$cmd/infra/stores'
	import { MainScreenKinds } from '$screen/domain/models'

	import { StartScreen } from './start-screen'
</script>

<main>
	{#if $screenSvelte.main === MainScreenKinds.Start}
		<StartScreen />
	{/if}
</main>
