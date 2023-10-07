<script lang="ts">
	import { capitalCase } from '~/share/utils'

	export let name: string
	export let value = true
</script>

<div>
	<input type="checkbox" id={name} {name} bind:checked={value} hidden />
	<label for={name} class="field">
		<span>{capitalCase(name)}:</span>
		<div class="switch"></div>
	</label>
</div>

<style>
	.switch {
		--bg: rgb(63 56 68);
		--color: rgb(26 23 27);
		--height: 40px;

		position: relative;
		width: calc(var(--height) * 2.2);
		height: var(--height);
		background-color: var(--bg);
		border-radius: var(--height);
		border: 2px solid var(--bg);
		margin-inline: auto;
		transition:
			background-color 300ms cubic-bezier(0.5, -0.15, 0.5, 1.15),
			border-color 300ms cubic-bezier(0.5, -0.15, 0.5, 1.15);
		overflow: hidden;
	}

	.switch::after {
		--x: 0;

		content: '';
		position: absolute;
		left: 0;
		width: 50%;
		height: 100%;
		border-radius: var(--height);
		background-color: var(--color);
		transform: translateX(var(--x));
		box-shadow: 0 0 16px rgb(34 30 39);
		transition: transform 200ms cubic-bezier(0.25, 0.9, 0.5, 1);
	}

	input:checked + label > .switch {
		--bg: rgb(98 89 105);
	}

	input:checked + label > .switch::after {
		--x: 100%;
	}
</style>
