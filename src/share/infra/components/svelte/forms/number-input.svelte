<script lang="ts">
	import type { NumberField } from '~/share/domain/models'
	import { capitalCase } from '~/share/utils'

	export let name: string
	export let settings: NumberField
	export let value = settings.min ?? 0
</script>

<label class="field">
	<span>{capitalCase(name)}:</span>
	<input id={name} {name} {...settings} required bind:value />
</label>
