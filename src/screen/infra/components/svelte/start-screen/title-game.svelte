<script>
	import { i18nState } from '$i18n/infra/stores/svelte'

	$: typeText = $i18nState.get('titleScreen-cmd-type', 'Type')

	const faviconURL = globalThis.location.origin + '/favicon.svg'
</script>

<img height="200" width="200" alt="vimdoku logo" src={faviconURL} class="vimdoku-logo" />

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
				<span class="command">start</span><span class="holder">difficulty</span><span class="key">Enter</span>
			</p>
		</td>
		<td>{$i18nState.get('titleScreen-cmd-startGame', 'for start command help.')}</td>
	</tr>
</table>

<style>
	.vimdoku-logo {
		width: 40vmin;
		min-width: 200px;
		height: 40vmin;
		min-height: 200px;
	}

	.data {
		text-align: center;
	}

	.commands {
		display: flex;
		flex-direction: column;
		gap: 1ch;
		justify-content: center;
	}

	.commands tr {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.25rem 4ch;
	}

	.commands tr th {
		align-self: flex-start;
	}

	.commands tr td:last-of-type {
		grid-column: span 2;
	}

	@container (width >= 768px) {
		.commands {
			display: grid;
			grid-template-columns: repeat(3, max-content);
			gap: 0.5rem 4ch;
			width: 80%;
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

		.commands tr td:last-of-type {
			grid-column: span 1;
		}
	}
</style>
