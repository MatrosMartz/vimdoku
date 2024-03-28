<script>
	import { i18nState } from '$i18n/infra/stores/svelte'

	$: locale = $i18nState.ns('pages/help')
</script>

<!-- eslint-disable svelte/no-at-html-tags -->

<h2 class="center-self">{@html locale.title('Main <a href="en/help/help#help">help</a> file.')}</h2>

<article class="help-sect help-main-move-around">
	<h4 class="help-main-move-around-title">{locale.moveAround_title('Move around')}:</h4>
	<p>
		{@html locale.moveAround_desc(
			'Use the cursor keys, or ' +
				'<a class="motion-letter" href="en/help/motion#h">h</a>' +
				' to go left, ' +
				'<a class="motion-letter" href="en/help/motion#j">j</a>' +
				' to go down, ' +
				'<a class="motion-letter" href="en/help/motion#k">k</a>' +
				' to go up, ' +
				'<a class="motion-letter" href="en/help/motion#l">l</a>' +
				' to go right.'
		)}
	</p>
	<aside class="motion-representation">
		<a class="motion-letter k" href="en/help/motion#k">k</a>
		<a class="motion-letter h" href="en/help/motion#h">h</a>
		<a class="motion-letter l" href="en/help/motion#l">l</a>
		<a class="motion-letter j" href="en/help/motion#j">j</a>
	</aside>
</article>
<article class="help-sect">
	<h4>{locale.closeThisPage_title('Close this page')}:</h4>
	<p>
		{@html locale.closeThisPage_desc(
			'Use <span class="highlight"> ' +
				'<a href="en/help/editing#%3Aquit"><span class="command">q</span></a>' +
				'<span class="key">Enter</span></span>.'
		)}
	</p>
</article>
<article class="help-sect">
	<h4>{locale.getSpecificHelp_title('Get specific help')}:</h4>
	<p>
		{@html locale.getSpecificHelp_desc(
			'It is possible to go directly to whatever you want ' +
				'<a href="en/help/help#help">help</a>' +
				' on, by giving an argument to the <span class="highlight">' +
				'<a href="en/help/help#%3Ahelp"><span class="command">help</span>' +
				'</a></span> command.'
		)}
	</p>
	<p id="help-context">{locale.getSpecificHelp_helpContext('Prepend something to specify the context')}:</p>
	<div class="table-container">
		<table class="help-table">
			<thead class="help-table-head">
				<tr>
					<th>{locale.getSpecificHelp_table_head_what('WHAT')}</th>
					<th>{locale.getSpecificHelp_table_head_prepend('PREPEND')}</th>
					<th>{locale.getSpecificHelp_table_head_example('EXAMPLE')}</th>
				</tr>
			</thead>
			<tbody class="help-table-body">
				<tr>
					<td
						>{@html locale.getSpecificHelp_table_normalMode_what(
							'<a href="en/help/intro#normal">Normal</a> mode command'
						)}</td
					>
					<td class="text-center"></td>
					<td>
						{@html locale.getSpecificHelp_table_normalMode_example(
							'<span class="highlight">' +
								'<a href="en&/help/help#%3Ahelp"><span class="command">help</span></a>' +
								' x' +
								'</span>'
						)}
					</td>
				</tr>
				<tr>
					<td
						>{@html locale.getSpecificHelp_table_visualMode_what(
							'<a href="en/help/visual#visual">Visual</a> mode command'
						)}</td
					>
					<td class="text-center">v_</td>
					<td>
						{@html locale.getSpecificHelp_table_visualMode_example(
							'<span class="highlight">' +
								'<a href="en/help/help#%3Ahelp"><span class="command">help</span></a>' +
								' v_u' +
								'</span>'
						)}
					</td>
				</tr>
				<tr>
					<td
						>{@html locale.getSpecificHelp_table_insertMode_what(
							'<a href="en/help/insert#insert">Insert</a> mode command'
						)}</td
					>
					<td class="text-center">i_</td>
					<td>
						{@html locale.getSpecificHelp_table_insertMode_example(
							'<span class="highlight">' +
								'<a href="en/help/help#%3Ahelp"><span class="command">help</span></a>' +
								'<a href="en/help/insert#i_<esc>">i_<span class="key">Enter</span></a>' +
								'</span>'
						)}
					</td>
				</tr>
				<tr>
					<td
						>{@html locale.getSpecificHelp_table_notesMode_what(
							'<a href="en/help/notes#Notes">Notes</a> mode command'
						)}</td
					>
					<td class="text-center">n_</td>
					<td>
						{@html locale.getSpecificHelp_table_notesMode_example(
							'<span class="highlight">' +
								'<a href="en/help/help#%3Ahelp"><span class="command">help</span></a>' +
								'<a href="en/help/notes#n_<esc>">n_<span class="key">Esc</span></a>' +
								'</span>'
						)}
					</td>
				</tr>
				<tr>
					<td
						>{@html locale.getSpecificHelp_table_cmdLineMode_what(
							'<a href="en/help/cmdline#command-line">Command-line</a> mode command'
						)}</td
					>
					<td class="text-center"
						>{@html locale.getSpecificHelp_table_cmdLineMode_prepend('<a href="en/help/cmdLine#%3A">:</a>')}</td
					>
					<td>
						{@html locale.getSpecificHelp_table_cmdLineMode_example(
							'<span class="highlight">' +
								'<a href="en/help/help#%3Ahelp"><span class="command">help</span></a>' +
								'<a href="en/help/editing#%3Aquit"><span class="command">quit</span></a>' +
								'</span>'
						)}
					</td>
				</tr>
				<tr>
					<td>{locale.getSpecificHelp_table_preference_what('Preference')}</td>
					<td class="text-center">'</td>
					<td>
						{@html locale.getSpecificHelp_table_preference_example(
							'<span class="highlight">' +
								'<a href="en/help/help#%3Ahelp"><span class="command">help</span></a>' +
								'<a href="en/help/options#%27autoSave%27"><span class="text">autoSave</span></a>' +
								'</span>'
						)}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
	<p>
		{@html locale.getSpecificHelp_helpSummary(
			'See ' + '<a href="en/help/usr_02#help-summary">help-summary</a>' + ' for more contexts and an explication.'
		)}
	</p>
	<p>
		{@html locale.getSpecificHelp_helpSyntax(
			'See ' +
				'<a href="en/help/intro#notation">notation</a>' +
				' for an explanation of the ' +
				'<a href="en/help/help#help">help</a>' +
				'syntax.'
		)}
	</p>
</article>
<article class="help-sect">
	<h4>{locale.searchForHelp_title('Search for help')}:</h4>
	<p>
		{@html locale.searchForHelp_desc(
			'Type "<span class="highlight">' +
				'<a href="en/help/help#%3Ahelp"><span class="command">help</span></a> ' +
				'<a href="en/help/motion/word">word</a>' +
				'</span>" then hit <span class="combination">' +
				'<a href="en/help/scroll#ctrl-d">CTRL-D</a>' +
				'</span> to see matching entries ' +
				'<a href="en/help/help#help">help</a>' +
				' entries for "<a href="en/help/motion/word">word</a>".'
		)}
	</p>
</article>
<p>
	{@html locale.about(
		'Vimdoku is a cross between the words ' +
			'<a href="en/intro#vim">VIM</a>' +
			' and ' +
			'<a href="en/intro#sudoku">suDOKU</a>' +
			'. Most of it is made by ' +
			'<a href="github.com/matrosmartz">Matros Martz</a>' +
			', but you can contribute. ' +
			'<a href="en/help/contributing">See how</a>' +
			" (please, I don't know how to finish the documentation...)."
	)}
</p>

<style>
	.motion-representation {
		display: grid;
		grid-template-rows: repeat(3, 1lh);
		grid-template-columns: repeat(3, 1lh);
		place-items: center;
		align-self: center;
	}

	.motion-letter.k,
	.motion-letter.j {
		grid-column: 2;
	}

	.motion-letter.k {
		grid-row: 1;
	}

	.motion-letter.j {
		grid-row: 3;
	}

	.motion-letter.h,
	.motion-letter.l {
		grid-row: 2;
	}

	.motion-letter.h {
		grid-column: 1;
	}

	.motion-letter.l {
		grid-column: 3;
	}
</style>
