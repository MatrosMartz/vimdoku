<div aria-hidden="true" class="division horizontal one" />
<div aria-hidden="true" class="division horizontal two" />
<div aria-hidden="true" class="division vertical one" />
<div aria-hidden="true" class="division vertical two" />

<style>
	.division {
		--height: 95%;
		--width: 2px;
		--calc-pos: calc(100% / 3 + 1px);

		position: absolute;
		margin: auto;
		background-color: rgb(var(--alternative-border));
		border-radius: 1px;
	}

	.horizontal {
		inset: auto 0;
		width: var(--height);
		height: var(--width);
	}

	.horizontal.one {
		top: var(--calc-pos);
	}

	.horizontal.two {
		bottom: var(--calc-pos);
	}

	.vertical {
		inset: 0 auto;
		width: var(--width);
		height: var(--height);
	}

	.vertical.one {
		left: var(--calc-pos);
	}

	.vertical.two {
		right: var(--calc-pos);
	}
</style>
