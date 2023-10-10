<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	import type { FormSchema, SchemaToModel } from '~/share/domain/models'
	import { capitalCase } from '~/share/utils'

	import { Button, ButtonMenu } from '../buttons'
	import { NumberInput, OptionsInput, TextInput, ToggleInput } from './inputs'

	type Schema = $$Generic<FormSchema>

	export let schema: Schema
	export let defaultValues: SchemaToModel<Schema>
	export let name: string
	export let method: 'get' | 'post' | 'dialog' = 'dialog'

	const dispatcher = createEventDispatcher<{ submit: SchemaToModel<Schema> }>()
	const dataEntries = Object.entries(schema).map(([name, settings]) => [name, Object.entries(settings)] as const)

	let values: any = structuredClone(defaultValues)

	function submitHandler() {
		dispatcher('submit', values)
	}

	function resetHandler() {
		values = structuredClone(defaultValues)
	}
</script>

<form {method} on:submit|preventDefault={submitHandler} on:reset|preventDefault={resetHandler}>
	<h3>{capitalCase(name)}</h3>
	{#each dataEntries as [group, fields]}
		<fieldset>
			<legend>{capitalCase(group)}</legend>
			{#each fields as [name, settings]}
				{#if settings.type === 'text'}
					<TextInput {name} {settings} bind:value={values[group][name]} />
				{:else if settings.type === 'number'}
					<NumberInput {name} {settings} bind:value={values[group][name]} />
				{:else if settings.type === 'toggle'}
					<ToggleInput {name} bind:value={values[group][name]} />
				{:else if settings.type === 'options'}
					<OptionsInput {name} options={settings.opts} bind:value={values[group][name]} />
				{/if}
			{/each}
		</fieldset>
	{/each}
	<ButtonMenu>
		<li><Button type="reset">Reset to default.</Button></li>
		<li><Button type="submit">Save all.</Button></li>
	</ButtonMenu>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 1rem 2rem;
		border-radius: 8px;
		box-shadow: 0 4px 8px hsl(280deg 16% 7% / 90%);
	}

	h3 {
		text-align: center;
	}

	fieldset {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem 2rem;
		justify-content: center;
		padding: 1.5rem 0.5rem;
		backdrop-filter: brightness(120%) saturate(120%);
		border: none;
		border-radius: 8px;
		box-shadow: 0 4px 16px rgb(19 15 24 / 50%);
	}

	fieldset:not(:first-of-type) {
		margin-top: 1rem;
	}

	legend {
		position: absolute;
		top: 0;
		left: -2rem;
		width: calc(25% + 2rem);
		max-width: 12rem;
		padding: 4px 2rem;
		background-color: rgb(19 15 24);
		border-radius: 0 8px 8px 0;
		transform: translateY(-50%);
	}
</style>
