<script>
	import { i18nState } from '$cmd/infra/stores'

	$: typeText = $i18nState.get('titleScreen-cmd-type', 'Type')
</script>

<h2>VIMDOKU - VIM suDOKU</h2>

<div class="data">
	<p>{$i18nState.get('titleScreen-version', 'Version')} 1.0</p>
	<p>
		{$i18nState.get('titleScreen-createBy', 'Created by')} <a href="https://github.com/matrosmartz">MatrosMartz.</a>
	</p>
	<p>{$i18nState.get('titleScreen-desc', 'Vimdoku is sudoku game with VIM shortcuts.')}</p>
</div>
<table class="commands">
	<tr>
		<th>{typeText}</th>
		<td>
			<p class="highlight"><span class="command">quit</span><span class="key">Enter</span></p>
		</td>
		<td>{$i18nState.get('titleScreen-cmd-quit', 'to exit.')}</td>
	</tr>
	<tr>
		<th>{typeText}</th>
		<td>
			<p class="highlight"><span class="command">help</span><span class="key">Enter</span></p>
		</td>
		<td>{$i18nState.get('titleScreen-cmd-help', 'to on-line help.')}</td>
	</tr>
	<tr>
		<th>{typeText}</th>
		<td>
			<p class="highlight">
				<span class="command">help</span>
				<span class="command">start</span><span class="key">Enter</span>
			</p>
		</td>
		<td>{$i18nState.get('titleScreen-cmd-startHelp', 'for start command help.')}</td>
	</tr>
	<tr>
		<th>{typeText}</th>
		<td>
			<p class="highlight">
				<span class="command">start</span>
				<span class="holder">difficulty</span><span class="key">Enter</span>
			</p>
		</td>
		<td>{$i18nState.get('titleScreen-cmd-startGame', 'for start command help.')}</td>
	</tr>
</table>

<style>
	.data {
		text-align: center;
	}

	.commands,
	.commands tr {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.commands {
		gap: 1ch;
	}

	.commands tr {
		width: 100%;
	}

	.commands tr td:last-of-type {
		align-self: flex-end;
	}

	@media (width >= 768px) {
		.commands {
			display: grid;
			grid-template-columns: repeat(3, max-content);
			gap: 0 4ch;
			width: max-content;
		}

		.commands tr {
			display: grid;
			grid-template-columns: subgrid;
			grid-row-end: span 2;
			grid-column-end: span 3;
		}

		.commands th,
		td {
			text-align: left;
		}

		tr td {
			grid-column: span 1;
		}
	}
</style>
