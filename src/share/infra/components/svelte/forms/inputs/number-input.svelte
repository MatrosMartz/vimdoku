<script lang="ts">
	import type { NumberField } from '~/share/domain/models'
	import { capitalCase } from '~/share/utils'

	export let name: string
	export let settings: NumberField
	export let value: number

	const placeholder = String(value)
</script>

<label class="field">
	<span>{capitalCase(name)}</span>
	<input id={name} {name} {...settings} {placeholder} required bind:value />
</label>
