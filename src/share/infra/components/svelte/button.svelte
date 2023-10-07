<script lang="ts">
	export let type: 'button' | 'submit' | 'reset' = 'button'
</script>

<button {type}>
	<div class="content">
		<slot />
	</div>
</button>

<style>
	button {
		--bg: rgb(63 56 68);

		position: relative;
		width: min(calc(2rem + 15ch), max-content);
		padding-inline: 1rem;
		height: 48px;
		font-weight: 500;
		overflow: hidden;
		border-radius: 8px;
		background-color: rgb(26 23 27);
		border: 2px solid var(--bg);
		box-shadow: 0 0 16px rgb(34 30 39);
		transition:
			background-color 200ms ease-out,
			box-shadow 200ms ease-out;
		outline: none;
		color: inherit;
	}

	button::after {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background-color: var(--bg);
		z-index: 0;
		transform: translateX(0);
		transition: transform 300ms ease-out;
	}

	button:hover::after {
		transform: translateX(100%);
	}

	.content {
		position: relative;
		z-index: 1;
	}

	button:active {
		--bg: rgb(98 89 105);
	}
</style>
