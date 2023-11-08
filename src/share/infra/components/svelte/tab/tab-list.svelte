<div class="container">
	<ul role="tablist">
		<slot />
	</ul>
</div>

<style>
	.container {
		position: relative;
		padding-bottom: 0.5rem;
		box-shadow: 0 8px 16px rgb(19 15 24 / 50%);
	}

	ul {
		position: relative;
		display: flex;
		list-style: none;
	}

	.container::after {
		position: absolute;
		inset: auto 0 0;
		width: 100%;
		height: 0.5rem;
		content: '';
		backdrop-filter: brightness(130%);
	}
</style>
