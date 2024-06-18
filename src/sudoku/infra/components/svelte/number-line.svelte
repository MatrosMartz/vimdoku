<script lang="ts">
	import { fly } from 'svelte/transition'

	import { posState } from '~/share/infra/stores/svelte'
	import { iterateArray } from '~/share/utils'
	import { prefsState } from '$pref/infra/stores/svelte'

	export let direction: 'horizontal' | 'vertical'

	$: dirCoord = direction === 'horizontal' ? $posState.col : $posState.row

	const flyParams = direction === 'horizontal' ? { y: '100%' } : { x: '100%' }

	/**
	 * Get text por number.
	 * @param num Original number.
	 * @returns Text for the number
	 */
	let getText: (num: number) => string

	$: getText = num => {
		const abs = Math.abs(num - dirCoord)
		const printNum = $prefsState.relativeNumbers && (!$prefsState.numbers || abs === 0) ? abs : num + 1
		return printNum === 0 ? '~' : String(printNum)
	}
</script>

<div class="number-line {direction}" transition:fly={flyParams}>
	{#each iterateArray(9) as num}
		<span class="number" class:selected={dirCoord === num}>{getText(num)}</span>
	{/each}
</div>

<style>
	.number-line {
		position: absolute;
		inset: 0 auto auto 0;
		z-index: -1;
		display: flex;
		gap: 4px;
		color: rgb(var(--key-color));
		background-color: rgb(var(--editor-background));
		border: 2px solid transparent;
		transition: border-color 500ms;
	}

	.horizontal {
		left: -2px;
		flex-direction: row;
		padding-inline: 4px;
		border-bottom: none;
		border-radius: 8px 8px 0 0;
		transform: translateY(-100%);
	}

	.vertical {
		top: -2px;
		flex-direction: column;
		padding-block: 4px;
		border-right: none;
		border-radius: 8px 0 0 8px;
		transform: translateX(-100%);
	}

	.number {
		display: grid;
		place-content: center;
		width: var(--cell-size);
		max-width: 8vw;
		aspect-ratio: 1 /1;
		opacity: 0.4;
	}

	.number.selected {
		font-weight: 600;
		opacity: 1;
	}
</style>
