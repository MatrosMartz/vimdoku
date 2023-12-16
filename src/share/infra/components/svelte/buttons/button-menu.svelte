<script lang="ts">
	export let direction: 'column' | 'row' | 'auto' | 'auto-reverse' = 'row'
</script>

<menu class="btn-menu dir-{direction}">
	<slot />
</menu>

<style>
	.btn-menu {
		display: flex;
		gap: 0.5rem 1rem;
		list-style: none;
	}
</style>
