import type { ActionReturn } from 'svelte/action'

import Tooltip from './tooltip.svelte'

export interface TooltipProps {
	id: string
	text: string
}

export function tooltip(node: HTMLElement, props: TooltipProps | null): ActionReturn<TooltipProps | null> {
	const target = node.parentElement!

	let $tooltip: Tooltip | null = null

	let initialID = props?.id

	function overHandler() {
		setTimeout(() => $tooltip?.$set({ show: true }), 0)
	}
	function leaveHandler() {
		setTimeout(() => $tooltip?.$set({ show: false }), 0)
	}
	function keyHandler(ev: KeyboardEvent) {
		if (ev.key === 'Escape') leaveHandler()
	}
	function destroy() {
		node.removeAttribute('aria-describedby')
		node.removeEventListener('keydown', keyHandler)
		node.removeEventListener('focusin', overHandler)
		node.removeEventListener('focusout', leaveHandler)
		node.removeEventListener('mouseover', overHandler)
		node.removeEventListener('mouseleave', leaveHandler)
		$tooltip?.$destroy()
		$tooltip = null
	}

	function create(props: TooltipProps) {
		initialID ??= props.id
		if (initialID !== props.id) throw new Error('can not change id')

		if ($tooltip == null) $tooltip = new Tooltip({ target, props })
		else $tooltip.$set({ text: props.text })
		$tooltip.$on('over', overHandler)
		$tooltip.$on('leave', leaveHandler)
		node.setAttribute('aria-describedby', props.id)
		node.addEventListener('keydown', keyHandler)
		node.addEventListener('focusin', overHandler)
		node.addEventListener('focusout', leaveHandler)
		node.addEventListener('mouseover', overHandler)
		node.addEventListener('mouseleave', leaveHandler)
	}

	function update(props: TooltipProps | null) {
		if (props == null) destroy()
		else create(props)
	}

	update(props)

	return { destroy, update }
}
