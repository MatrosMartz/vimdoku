<script lang="ts">
	import { Button, ButtonMenu, Icon } from '~/share/infra/components/svelte'
	import { SCREEN_ACTIONS } from '$cmd/domain/services'
	import { med } from '$cmd/infra/services'
	import { RouteBase } from '$screen/domain/entities'

	export let path: string

	/** Go to home, click handler.  */
	function homeHandler() {
		med.dispatch(SCREEN_ACTIONS.goTo, { route: RouteBase.createHome() })
	}
</script>

<article class="error-container">
	<h1>Error 404 - page not found.</h1>
	<h3>la pagina {path} no existe.</h3>
	<ButtonMenu direction="auto">
		<Button on:click={homeHandler}><Icon id="home" /> Go to home.</Button>
		<Button>Go to Documentation.</Button>
	</ButtonMenu>
</article>

<style>
	.error-container {
		display: flex;
		flex-direction: column;
		gap: max(2rem, 5vh) 2rem;
		align-items: center;
		justify-content: center;
		width: 90%;
		max-width: 50rem;
		min-height: 77vh;
		padding: 2.2rem 4rem;
		color: rgb(var(--primary-color));
		background-color: rgb(var(--editor-background));
		border-radius: 16px;
		box-shadow: 0 6px 20px rgb(var(--card-shadow) / 75%);
		container: start-screen / inline-size;
	}
</style>
