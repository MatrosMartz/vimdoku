<script lang="ts">
	export let key: string

	export let selected: string
</script>

<div id="panel{key}" aria-labelledby="tab{key}" role="tabpanel" aria-hidden={selected !== key}>
	<slot />
</div>

<style>
	div {
		padding: 2rem 2rem 1rem;
		overflow: hidden scroll;
	}

	div[aria-hidden='true'] {
		display: none;
	}
</style>
