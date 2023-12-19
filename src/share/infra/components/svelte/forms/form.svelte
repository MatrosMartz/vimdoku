<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	import type { FormSchema, SchemaToModel } from '~/share/domain/models'
	import { capitalCase, typeFallback } from '~/share/utils'
	import { i18nState } from '$i18n/infra/stores/svelte'

	import { Button, ButtonMenu } from '../buttons'
	import { NumberInput, OptionsInput, TextInput, ToggleInput } from './inputs'

	type Schema = $$Generic<FormSchema>

	export let schema: Schema
	export let defaultValues: SchemaToModel<Schema>
	export let initialValues: SchemaToModel<Schema>
	export let method: 'get' | 'post' | 'dialog' = 'dialog'
	export let labels: {
		[K in keyof Schema]: {
			groups: Record<K, (fallback: string) => string>
			names: { [N in keyof Schema[K]]: (fallback: string) => string }
		}
	}[keyof Schema]

	function schemaEntries(sch: FormSchema, l: typeof labels) {
		return Object.entries(sch).map(
			([group, settings]) =>
				[
					group,
					l.groups[group],
					Object.entries(settings).map(
						([name, settings]) => [name, l.names[name], settings] satisfies [string, (a: string) => string, unknown]
					),
				] satisfies [string, (a: string) => string, unknown]
		)
	}

	const dispatcher = createEventDispatcher<{ submit: SchemaToModel<Schema> }>()
	$: dataEntries = schemaEntries(schema, labels)

	const values: any = structuredClone(initialValues)

	function submitHandler() {
		dispatcher('submit', values)
	}
</script>

<form {method} on:submit|preventDefault={submitHandler}>
	{#each dataEntries as [group, fallbackGroup, fields] (group)}
		<fieldset>
			<legend>{fallbackGroup(capitalCase(group))}</legend>
			{#each fields as [name, fallbackName, settings] (name)}
				{#if settings.type === 'text'}
					<TextInput
						{name}
						defaultValue={typeFallback('string', defaultValues[group][name], '')}
						label={fallbackName(capitalCase(name))}
						{settings}
						bind:value={values[group][name]}
					/>
				{:else if settings.type === 'number'}
					<NumberInput
						{name}
						defaultValue={typeFallback('number', defaultValues[group][name], 0)}
						label={fallbackName(capitalCase(name))}
						{settings}
						bind:value={values[group][name]}
					/>
				{:else if settings.type === 'toggle'}
					<ToggleInput
						{name}
						defaultChecked={typeFallback('boolean', defaultValues[group][name], false)}
						label={fallbackName(capitalCase(name))}
						bind:checked={values[group][name]}
					/>
				{:else if settings.type === 'options'}
					<OptionsInput
						{name}
						label={fallbackName(capitalCase(name))}
						options={settings.opts}
						bind:value={values[group][name]}
					/>
				{/if}
			{/each}
		</fieldset>
	{/each}
	<ButtonMenu direction="auto">
		<Button type="reset">{$i18nState.get('form-reset', 'Reset to default')}</Button>
		<Button type="submit">{$i18nState.get('form-save', 'Save all')}</Button>
	</ButtonMenu>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	fieldset {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem 2rem;
		justify-content: center;
		padding: 1.5rem 0.5rem;
		background-color: var(--editor-background);
		border: none;
		border-radius: 8px;
		box-shadow: 0 4px 16px var(--card-head-shadow);
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
		font-size: 1rem;
		font-weight: bold;
		background-color: var(--card-head-background);
		border-radius: 0 8px 8px 0;
		transform: translateY(-50%);
	}
</style>
