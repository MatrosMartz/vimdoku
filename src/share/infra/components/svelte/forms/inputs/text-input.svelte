<script lang="ts">
	import { onMount } from 'svelte'

	import type { TextField } from '~/share/domain/models'
	import { capitalCase } from '~/share/utils'

	export let name: string
	export let settings: TextField
	export let defaultValue: string
	export let value: string

	const placeholder = value

	let input: HTMLInputElement

	onMount(() => {
		input.defaultValue = defaultValue
	})
</script>

<label class="field">
	<span class="secondary">{capitalCase(name)}</span>
	<input bind:this={input} id={name} {name} {...settings} required {placeholder} bind:value />
</label>
