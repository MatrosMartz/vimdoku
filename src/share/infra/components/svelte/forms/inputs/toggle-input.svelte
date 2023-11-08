<script lang="ts">
	import { capitalCase } from '~/share/utils'

	export let name: string
	export let value = true
</script>

<label class="field">
	<input type="checkbox" id={name} {name} bind:checked={value} />
	<span class="secondary">{capitalCase(name)}</span>
	<div class="switch" aria-hidden="true"></div>
</label>

<style>
	.switch {
		--height: 40px;

		position: relative;
		width: calc(var(--height) * 2.2);
		height: var(--height);
		margin-inline: auto;
		overflow: hidden;
		background-color: var(--input-border);
		border: 2px solid var(--input-border);
		border-radius: var(--height);
		box-shadow: 0 0 16px var(--input-shadow);
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
		background-color: var(--input-background);
		border-radius: var(--height);
		box-shadow: 0 0 16px var(--input-shadow);
		transition: transform 200ms cubic-bezier(0.25, 0.9, 0.5, 1);
		transform: translateX(var(--x));
	}

	label:hover > .switch {
		box-shadow: 0 0 16px var(--hover-shadow);
	}

	input {
		appearance: none;
	}

	label:has(input:checked) > .switch {
		--input-border: rgb(86 57 83);
	}

	label:has(input:checked) > .switch::after {
		--x: 100%;
	}

	label:has(input:focus) > .switch {
		border: 2px solid var(--alternative-border);
	}
</style>
