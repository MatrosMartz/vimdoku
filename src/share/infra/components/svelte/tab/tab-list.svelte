<div class="container">
	<ul role="tablist">
		<slot />
	</ul>
</div>

<style>
	.container {
		position: relative;
		padding-bottom: 0.5rem;
		box-shadow: 0 8px 16px var(--card-head-shadow);
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
		backdrop-filter: var(--focus-brightness);
	}
</style>
