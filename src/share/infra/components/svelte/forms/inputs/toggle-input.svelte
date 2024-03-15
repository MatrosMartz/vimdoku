<script lang="ts">
	import { onMount } from 'svelte'

	import type { ToggleField } from '~/share/domain/models'
	import { capitalCase } from '~/share/utils'

	export let name: string
	export let label = capitalCase(name)
	export let checked = true
	export let settings: Omit<ToggleField, 'type'>
	export let onMsg = 'on'
	export let offMsg = 'off'
	let input: HTMLInputElement

	onMount(() => (input.defaultChecked = settings.default))
</script>

<label class="field container">
	<input bind:this={input} id={name} {name} role="switch" type="checkbox" bind:checked on:change />
	<span class="secondary">{label}</span>
	<span class="state">
		<span class="switch"></span>
		<span aria-hidden="true" class="off">{offMsg}</span>
		<span aria-hidden="true" class="on">{onMsg}</span>
	</span>
</label>

<style>
	.switch {
		--height: var(--icon-size);
		--border: var(--input-border);

		position: relative;
		display: inline-block;
		width: calc(var(--height) * 2.2);
		height: var(--height);
		overflow: hidden;
		background-color: rgb(var(--input-border));
		border: 2px solid rgb(var(--border));
		border-radius: var(--height);
		box-shadow: 0 0 16px rgb(var(--input-shadow) / 25%);
		transition:
			background-color 300ms cubic-bezier(0.5, -0.15, 0.5, 1.15),
			border-color 300ms cubic-bezier(0.5, -0.15, 0.5, 1.15),
			box-shadow 200ms ease-out;
	}

	.switch::after {
		--x: 0;

		position: absolute;
		left: 0;
		width: 50%;
		height: 100%;
		content: '';
		background-color: rgb(var(--input-background));
		border-radius: var(--height);
		box-shadow: 0 0 16px rgb(var(--input-shadow) / 25%);
		transition: transform 200ms cubic-bezier(0.25, 0.9, 0.5, 1);
		transform: translateX(var(--x));
	}

	.state {
		display: flex;
		gap: 1rem;
		align-items: center;
		height: fit-content;
	}

	label:hover .switch {
		filter: var(--focus-brightness);
	}

	input {
		appearance: none;
	}

	input:checked ~ .state .switch {
		--input-border: var(--alternative-border);
	}

	input:checked ~ .state .switch::after {
		--x: 100%;
	}

	input:focus ~ .state .switch {
		--border: var(--focus-border);
	}

	input:not(:checked) ~ .state .on,
	input:checked ~ .state .off {
		display: none;
	}
</style>
