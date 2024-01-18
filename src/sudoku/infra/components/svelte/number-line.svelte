<script lang="ts">
	import { posState } from '~/share/infra/stores/svelte'
	import { iterateArray } from '~/share/utils'
	import { prefsState } from '$pref/infra/stores/svelte'

	export let direction: 'horizontal' | 'vertical'

	$: dirCoord = direction === 'horizontal' ? $posState.x : $posState.y

	$: getText = (num: number) => {
		const printNum = $prefsState.relativeNumbers ? Math.abs(num - dirCoord) : num + 1
		return printNum === 0 ? '~' : String(printNum)
	}
</script>

<div class="number-line {direction}">
	{#each iterateArray(9) as num}
		<span class="number" class:selected={dirCoord === num}>{getText(num)}</span>
	{/each}
</div>

<style>
	.number-line {
		position: absolute;
		inset: 0 auto auto 0;
		display: flex;
		gap: 4px;
		color: rgb(var(--key-color));
		background-color: rgb(var(--editor-background));
	}

	.horizontal {
		flex-direction: row;
		padding-inline: 4px;
		border-radius: 8px 8px 0 0;
		transform: translateY(-100%);
	}

	.vertical {
		flex-direction: column;
		padding-block: 4px;
		border-radius: 8px 0 0 8px;
		transform: translateX(-100%);
	}

	.number {
		display: grid;
		place-content: center;
		width: 44px;
		max-width: 8vw;
		aspect-ratio: 1 /1;
		opacity: 0.4;
	}

	.number.selected {
		font-weight: 600;
		opacity: 1;
	}
</style>
