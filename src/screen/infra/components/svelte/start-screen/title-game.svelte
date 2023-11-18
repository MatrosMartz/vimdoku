<h2>VIMDOKU - VIM suDOKU</h2>

<div class="data">
	<p>Version 1.0</p>
	<p>by <a href="https://github.com/matrosmartz">MatrosMartz.</a></p>
	<p>Vimdoku is sudoku game with VIM shortcuts</p>
</div>
<table class="commands">
	<tr>
		<th>type</th>
		<td>
			<p class="highlight"><span class="command">quit</span><span class="key">Enter</span></p>
		</td>
		<td>to exit.</td>
	</tr>
	<tr>
		<th>type</th>
		<td>
			<p class="highlight"><span class="command">help</span><span class="key">Enter</span></p>
		</td>
		<td>for on-line help.</td>
	</tr>
	<tr>
		<th>type</th>
		<td>
			<p class="highlight">
				<span class="command">help</span>
				<span class="command">start</span><span class="key">Enter</span>
			</p>
		</td>
		<td>for help to start game.</td>
	</tr>
	<tr>
		<th>type</th>
		<td>
			<p class="highlight">
				<span class="command">start</span>
				<span class="holder">difficulty</span><span class="key">Enter</span>
			</p>
		</td>
		<td>for start game.</td>
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
