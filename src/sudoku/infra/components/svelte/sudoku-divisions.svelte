<div class="division horizontal one" aria-hidden="true" />
<div class="division horizontal two" aria-hidden="true" />
<div class="division vertical one" aria-hidden="true" />
<div class="division vertical two" aria-hidden="true" />

<style>
	.division {
		--height: 95%;
		--width: 4px;
		--calc-pos: calc(100% / 3);

		position: absolute;
		margin: auto;
		background-color: var(--hover-shadow);
		border-radius: 2px;
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
