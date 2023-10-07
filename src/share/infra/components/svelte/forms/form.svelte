<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	import type { FormSchema, SchemaToModel } from '~/share/domain/models'
	import { capitalCase } from '~/share/utils'

	import Button from '../button.svelte'
	import NumberInput from './number-input.svelte'
	import OptionsInput from './options-input.svelte'
	import TextInput from './text-input.svelte'
	import ToggleInput from './toggle-input.svelte'

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
			<div class="fields">
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
			</div>
		</fieldset>
	{/each}
	<section class="btns">
		<Button type="reset">Reset to default.</Button>
		<Button type="submit">Save all.</Button>
	</section>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		border-radius: 8px;
		box-shadow: 0 4px 8px hsl(280deg 16% 7% / 90%);
		padding: 1rem 2rem;
	}

	h3 {
		text-align: left;
		padding-left: 3rem;
	}

	fieldset {
		border: none;
		border-bottom: 1px solid rgb(63 56 68);
		margin-bottom: 1rem;
	}

	legend {
		border-radius: 16px 16px 0 0;
		width: 100%;
		padding: 0.5rem 2rem;
		background-color: hsl(284deg 20% 77% / 3%);
	}

	.fields {
		--grid-layout-gap: 8px;
		--grid-column-count: 5;
		--grid-item-min-width: 200px;
		--gap-count: calc(var(--grid-column-count) - 1);
		--total-gap-width: calc(var(--gap-count) * var(--grid-layout-gap));
		--grid-item-max-width: calc((100% - var(--total-gap-width)) / var(--grid-column-count));

		display: grid;
		grid-template-columns: repeat(
			auto-fill,
			minmax(max(var(--grid-item-min-width), var(--grid-item-max-width)), 1fr)
		);
		gap: var(--grid-layout-gap);
		padding-block: 1rem;
	}

	.btns {
		display: flex;
		justify-content: right;
		gap: 1rem;
	}
</style>
