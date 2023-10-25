<script lang="ts">
	import { derived } from 'svelte/store'

	import { Dialog } from '~/share/infra/components/svelte/dialog'
	import { CommandInput } from '$cmd/infra/components/svelte'
	import { screenSvelte } from '$cmd/infra/stores/svelte'
	import { DialogKinds } from '$screen/domain/models'

	const dialogState = derived(screenSvelte, ({ dialog }) => dialog.kind === DialogKinds.Cmd)
</script>

<Dialog {dialogState}><CommandInput /></Dialog>
