<script lang="ts">
	export let type: 'button' | 'submit' | 'reset' = 'button'
	export let disabled = false
	export let reason = ''
</script>

<li>
	<button style:--reason={reason.length > 0 ? `'${reason}'` : ''} {type} on:click {disabled}>
		<slot />
	</button>
</li>

<style>
	button {
		position: relative;
		width: calc(2rem + 15ch);
		min-width: max-content;
		height: 48px;
		padding-inline: 1rem;
		font-weight: 500;
		color: inherit;
		background-color: var(--input-background);
		border: 2px solid var(--input-border);
		border-radius: 8px;
		outline: none;
		box-shadow: 0 0 12px var(--input-shadow);
		transition:
			background-color 200ms ease-out,
			box-shadow 200ms ease-out;
	}

	button:hover {
		--input-shadow: var(--hover-shadow);
	}

	button:focus {
		--input-border: var(--alternative-border);
	}

	button:disabled {
		filter: opacity(80%);
	}

	button:disabled::before {
		position: absolute;
		top: 125%;
		left: 50%;
		width: 10ch;
		max-width: 45ch;
		padding: 0.5rem 1rem;
		overflow: hidden;
		color: var(--primary-color);
		text-overflow: ellipsis;
		text-wrap: pretty;
		content: var(--reason);
		background-color: rgb(6 0 15);
		border: 1px solid rgb(31 11 59);
		border-radius: 8px;
		opacity: 0;
		transition: opacity 200ms;
		transform: translateX(-50%);
	}

	button:disabled:hover::before {
		opacity: 1;
	}

	button:not(:disabled):active {
		--input-background: var(--alternative-border);
		--input-border: var(--alternative-border);
	}
</style>
