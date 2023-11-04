<section class="monospace">
	<h2>VIMDOKU - VIM suDOKU</h2>

	<div class="data">
		<p>Version 1.0</p>
		<p>
			by <a href="https://github.com/matrosmartz">MatrosMartz.</a>
		</p>
		<p>Vimdoku is sudoku game with VIM shortcuts</p>
	</div>
	<table class="commands">
		<tr>
			<th>type</th>
			<td>
				<p class="highlight">
					<span class="command">quit</span>
				</p>
			</td>
			<td>to exit.</td>
		</tr>
		<tr>
			<th>type</th>
			<td>
				<p class="highlight">
					<span class="command">help</span>
				</p>
			</td>
			<td>for on-line help.</td>
		</tr>
		<tr>
			<th>type</th>
			<td>
				<p class="highlight">
					<span class="command">help</span>
					<span class="command">start</span>
				</p>
			</td>
			<td>for help to start game.</td>
		</tr>
		<tr>
			<th>type</th>
			<td>
				<p class="highlight">
					<span class="command">start</span>
					<span class="holder">difficulty</span>
				</p>
			</td>
			<td>for start game.</td>
		</tr>
	</table>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: center;
		width: 93vw;
		padding: 1rem 2ch;
		margin: auto;
		color: rgb(204 184 221);
		background-color: rgb(12 7 17);
		border-radius: 4px;
		box-shadow: 0 6px 20px rgb(12 7 17);
	}

	.data {
		text-align: center;
	}

	.commands {
		display: grid;
		grid-template-columns: repeat(2, max-content);
		row-gap: 0.5rem;
		justify-content: space-between;
		width: min(100%, 32ch);
	}

	.commands tr {
		display: grid;
		grid-template-columns: subgrid;
		grid-row-end: span 2;
		grid-column-end: span 2;
	}

	tr td {
		grid-column: 2 / 3;
	}

	@media (width >= 768px) {
		.commands {
			grid-template-columns: repeat(3, max-content);
			column-gap: 4ch;
			width: max-content;
		}

		.commands tr {
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

	.highlight::after {
		color: rgb(155 151 214);
		content: '<Enter>';
	}
</style>
