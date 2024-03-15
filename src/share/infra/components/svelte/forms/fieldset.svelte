<script lang="ts">
	export let legend: string
</script>

<fieldset>
	<legend>{legend}</legend>
	<slot />
</fieldset>

<style>
	fieldset {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem 2rem;
		justify-content: center;
		padding: 1.5rem 0.5rem;
		background-color: rgb(var(--editor-background));
		border: none;
		border-radius: 8px;
		box-shadow: 0 4px 16px rgb(var(--card-head-shadow));
	}

	fieldset:not(:first-of-type) {
		margin-top: 1rem;
	}

	legend {
		position: absolute;
		top: 0;
		left: -2rem;
		width: calc(25% + 2rem);
		min-width: max-content;
		max-width: 12rem;
		padding: 4px 2rem;
		font-size: 1rem;
		font-weight: bold;
		background-color: rgb(var(--card-head-background));
		border-radius: 0 8px 8px 0;
		transform: translateY(-50%);
	}
</style>
