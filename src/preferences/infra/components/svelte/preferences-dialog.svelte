<script lang="ts">
	import PreferencesDisplay from './preferences-display.svelte'
</script>

<dialog open>
	<PreferencesDisplay />
</dialog>

<style>
	dialog {
		inset: 0;
		width: 80vw;
		max-width: 600px;
		height: 90vh;
		margin: auto;
		overflow: hidden;
		color: inherit;
		background-color: hsl(280deg 17% 14%);
		border: none;
		border-radius: 4px;
	}

	dialog::backdrop {
		background-color: brown;
	}
</style>
