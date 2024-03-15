<script lang="ts">
	import { onMount } from 'svelte'

	import type { TextField } from '~/share/domain/models'
	import { capitalCase } from '~/share/utils'

	export let name: string
	export let label = capitalCase(name)
	export let settings: TextField
	export let value = settings.default

	const placeholder = settings.default

	let input: HTMLInputElement

	onMount(() => {
		input.defaultValue = settings.default
	})
</script>

<label class="field container">
	<span class="secondary">{label}</span>
	<input bind:this={input} id={name} {name} {placeholder} class="text-or-number" {...settings} required bind:value />
</label>
