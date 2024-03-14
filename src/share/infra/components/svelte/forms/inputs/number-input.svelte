<script lang="ts">
	import { onMount } from 'svelte'

	import type { NumberField } from '~/share/domain/models'
	import { capitalCase } from '~/share/utils'

	export let name: string
	export let label = capitalCase(name)
	export let settings: NumberField
	export let defaultValue: number
	export let value = defaultValue

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

<label class="field container">
	<span class="secondary">{label}</span>
	<input
		bind:this={input}
		id={name}
		{name}
		{placeholder}
		class="text-or-number"
		{...settings}
		required
		on:input={inputHandler}
	/>
</label>
