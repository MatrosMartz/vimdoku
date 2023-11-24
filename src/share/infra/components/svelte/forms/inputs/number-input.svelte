<script lang="ts">
	import type { NumberField } from '~/share/domain/models'
	import { capitalCase } from '~/share/utils'

	export let name: string
	export let settings: NumberField
	export let value: number

	const parse = {
		get value() {
			return String(value)
		},
		set value(newValue: string) {
			value = Number(newValue)
		},
	}

	const placeholder = String(value)
</script>

<label class="field">
	<span class="secondary">{capitalCase(name)}</span>
	<input id={name} {name} {...settings} required {placeholder} bind:value={parse.value} />
</label>
