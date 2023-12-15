<script lang="ts">
	export let direction: 'column' | 'row' | 'auto' = 'row'
</script>

<menu class="btn-menu dir-{direction}">
	<slot />
</menu>

<style>
	.btn-menu {
		display: flex;
		gap: 0.5rem 1rem;
		justify-content: end;
		list-style: none;
	}
</style>
