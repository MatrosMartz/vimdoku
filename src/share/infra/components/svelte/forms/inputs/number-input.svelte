<script lang="ts">
	import { onMount } from 'svelte'

	import type { NumberField } from '~/share/domain/models'
	import { capitalCase } from '~/share/utils'

	export let name: string
	export let label = capitalCase(name)
	export let settings: NumberField
	export let defaultValue: number
	export let value: number

	let input: HTMLInputElement

	const placeholder = String(value)

	/**
	 * Change value, input handler.
	 * @param ev The event.
	 */
	function inputHandler(ev: { currentTarget: HTMLInputElement }): void
	function inputHandler({ currentTarget }: { currentTarget: HTMLInputElement }) {
		value = currentTarget.valueAsNumber
	}

	onMount(() => {
		input.defaultValue = String(defaultValue)
		input.valueAsNumber = value
	})
</script>

<label class="field">
	<span class="secondary">{label}</span>
	<input bind:this={input} id={name} {name} {...settings} required {placeholder} on:input={inputHandler} />
</label>
