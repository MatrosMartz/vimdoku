<script lang="ts">
	import type { TextField } from '~/share/domain/models'
	import { capitalCase } from '~/share/utils'

	export let name: string
	export let settings: TextField
	export let value = ''
</script>

<label class="field">
	<span>{capitalCase(name)}</span>
	<input id={name} {name} {...settings} required placeholder={value} bind:value />
</label>
