import type { ActionReturn } from 'svelte/action'

import Tooltip from './tooltip.svelte'

export interface TooltipProps {
	id: string
	text: string
}

export function tooltip(node: HTMLElement, props: TooltipProps | null): ActionReturn<TooltipProps> {
	if (props == null) return {}

	const target = node.parentElement!
	node.tabIndex = 0
	const tooltipComponent = new Tooltip({ props, target })
	node.setAttribute('aria-describedby', props.id)

	function overHandler() {
		setTimeout(() => tooltipComponent.$set({ show: true }), 0)
	}
	function leaveHandler() {
		setTimeout(() => tooltipComponent.$set({ show: false }), 0)
	}
	function keyHandler(ev: KeyboardEvent) {
		if (ev.key === 'Escape') leaveHandler()
	}

	node.addEventListener('keydown', keyHandler)
	node.addEventListener('focusin', overHandler)
	node.addEventListener('focusout', leaveHandler)
	node.addEventListener('mouseover', overHandler)
	node.addEventListener('mouseleave', leaveHandler)
	tooltipComponent.$on('over', overHandler)
	tooltipComponent.$on('leave', leaveHandler)
	return {
		destroy() {
			node.removeEventListener('keydown', keyHandler)
			node.removeEventListener('focusin', overHandler)
			node.removeEventListener('focusout', leaveHandler)
			node.removeEventListener('mouseover', overHandler)
			node.removeEventListener('mouseleave', leaveHandler)
			tooltipComponent.$destroy()
		},
	}
}
