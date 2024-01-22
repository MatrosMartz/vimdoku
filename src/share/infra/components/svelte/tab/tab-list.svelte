<div class="container">
	<ul role="tablist" class="tablist">
		<slot />
	</ul>
	<slot name="close" />
</div>

<style>
	.container {
		position: relative;
		padding: 0.4rem;
		background-color: rgb(var(--dialog-header) / 70%);
		box-shadow: 0 8px 16px rgb(var(--card-head-shadow));
	}

	.tablist {
		position: relative;
		display: flex;
		width: max-content;
		overflow: hidden;
		list-style: none;
		border-radius: 12px 12px 0 0;
	}

	.container::after {
		position: absolute;
		inset: auto 0 0;
		width: 100%;
		height: 0.4rem;
		content: '';
		background-color: rgb(var(--alternative-border));
	}
</style>
