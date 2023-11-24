/**
 * @typedef {Object} UserOrderObjectOption
 * @property {string | string[]} match
 * @property {'alphabetical' | 'ignore'} sort
 */

/**
 * @typedef {(string | string[] | UserOrderObjectOption)} UserOrderOption
 */

const ariaWidget = [
	'aria-label',
	'aria-labelledby',
	'aria-describedby',
	'aria-roledescription',
	'aria-hidden',
	'aria-haspopup',
	'aria-pressed',
	'aria-expanded',
	'aria-checked',
	'aria-selected',
	'aria-readonly',
	'aria-required',
	'aria-invalid',
	'aria-placeholder',
	'aria-level',
	'aria-valuemax',
	'aria-valuemin',
	'aria-valuenow',
	'aria-valuetext',
	'aria-autocomplete',
	'aria-multiline',
	'aria-orientation',
	'aria-multiselectable',
	'aria-sort',
	'aria-errormessage',
	'aria-modal',
]
const ariaLiveRegion = ['aria-live', 'aria-relevant', 'aria-busy', 'aria-atomic']
const ariaDragAndDrop = ['aria-dropeffect', 'aria-grabbed']
const ariaRelationShip = [
	'aria-activedescendant',
	'aria-controls',
	'aria-flowto',
	'aria-labelledby',
	'aria-owns',
	'aria-posinset',
	'aria-setsize',
	'aria-colcount',
	'aria-colindex',
	'aria-colspan',
	'aria-rowcount',
	'aria-rowindex',
	'aria-rowspan',
	'aria-description',
	'aria-details',
]
const ariaGlobal = ['aria-current', 'aria-disabled', 'aria-keyshortcuts']

/** @type {UserOrderObjectOption[]} */
const ariaOrder = [
	'role',
	ariaWidget,
	ariaLiveRegion,
	ariaDragAndDrop,
	ariaRelationShip,
	ariaGlobal,
	{ match: '/^aria-/u', sort: 'alphabetical' },
	'for',
	{ match: '/^form/u', sort: 'alphabetical' },
	'height',
	'width',
]

/** @type {UserOrderOption[]} */
const inputOrder = [
	'type',
	'readonly',
	'required',
	'multiple',
	'capture',
	'pattern',
	'list',
	{ match: '/^min/u', sort: 'alphabetical' },
	{ match: '/^max/u', sort: 'alphabetical' },
	'size',
	'step',
	'autofocus',
	'autocomplete',
	'dirname',
	'disabled',
	'tabindex',
	{ match: ['accept', 'alt', 'src', 'placeholder'], sort: 'alphabetical' },
	'value',
	'checked',
]

/** @type {UserOrderOption[]} */
const attributesOrder = [
	'this',
	'bind:this',
	'id',
	'name',
	'title',
	'slot',
	...ariaOrder,
	...inputOrder,
	{ match: '/^--/u', sort: 'alphabetical' },
	['style', '/^style:/u'],
	'class',
	{ match: '/^data--/', sort: 'alphabetical' },
	{ match: '/^class:/u', sort: 'alphabetical' },
	{
		match: ['!/:/u', '!/^(?:this|id|name|style|class)$/u', '!/^--/u'],
		sort: 'alphabetical',
	},
	['/^bind:/u', '!bind:this', '/^on:/u'],
	{ match: '/^use:/u', sort: 'alphabetical' },
	{ match: '/^transition:/u', sort: 'alphabetical' },
	{ match: '/^in:/u', sort: 'alphabetical' },
	{ match: '/^out:/u', sort: 'alphabetical' },
	{ match: '/^animate:/u', sort: 'alphabetical' },
	{ match: '/^let:/u', sort: 'alphabetical' },
]

module.exports = {
	order: attributesOrder,
}
