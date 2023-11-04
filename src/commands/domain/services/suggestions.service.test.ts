import { describe, expect, test } from 'vitest'

import { SuggestionService } from './suggestions.service'

interface SuggestionExpect {
	innerText: string
	input: string
}

interface SuggestionsCase {
	cmdStr: string
	expected: SuggestionExpect
}

const SUGGESTIONS_CASES: SuggestionsCase[] = [
	{
		cmdStr: 'h[elp]',
		expected: {
			innerText: '<span class="command">h<span class="optional">elp</span></span>',
			input: 'help',
		},
	},
	{
		cmdStr: 'h[elp] {subject}',
		expected: {
			innerText: '<span class="command">h<span class="optional">elp</span></span> <span class="holder">subject</span>',
			input: 'help ',
		},
	},
	{
		cmdStr: 'h[elp] :set',
		expected: {
			innerText: '<span class="command">h<span class="optional">elp</span></span> <span class="command">set</span>',
			input: 'help :set',
		},
	},
	{
		cmdStr: 'se[t] <all>',
		expected: {
			innerText: '<span class="command">se<span class="optional">t</span></span> <span class="special">all</span>',
			input: 'set all',
		},
	},
	{
		cmdStr: 'se[t] (numbers)<?>',
		expected: {
			innerText:
				'<span class="command">se<span class="optional">t</span></span> <span class="value">numbers</span><span class="special">?</span>',
			input: 'set numbers?',
		},
	},
	{
		cmdStr: 'se[t] <inv>(numbers)',
		expected: {
			innerText:
				'<span class="command">se<span class="optional">t</span></span> <span class="special">inv</span><span class="value">numbers</span>',
			input: 'set invnumbers',
		},
	},
]

describe.concurrent('SuggestionService', () => {
	describe.each(SUGGESTIONS_CASES)('`cmdStr` is $cmdStr', ({ cmdStr, expected }) => {
		const suggestion = new SuggestionService({ cmdStr, descriptions: 'some', id: 'some' })
		test(`\`data.input\` Should be '${expected.input}'`, () => {
			expect(suggestion.data.input).toBe(expected.input)
		})

		test('should be correct innerText', () => {
			expect(suggestion.data.header.innerHTML).toBe(expected.innerText)
		})
	})
})
