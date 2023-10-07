<script lang="ts">
	import type { TextField } from '~/share/domain/models'
	import { capitalCase } from '~/share/utils'

	export let name: string
	export let settings: TextField
	export let value = ''
</script>

<label class="field">
	{capitalCase(name)}:
	<input id={name} {name} {...settings} required bind:value />
</label>
