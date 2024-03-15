<section>
	<h4>VIMDOKU - main <a href="en/help/help#help">help</a> file.</h4>

	<article>
		<h5>Move around:</h5>
		<p>
			Use the cursor keys, or <a class="motion-letter" href="en/help/motion#h">h</a> to go left,
			<a class="motion-letter" href="en/help/motion#j">j</a>
			to go down, <a class="motion-letter" href="en/help/motion#k">k</a> to go up,
			<a class="motion-letter" href="en/help/motion#l">l</a> to go right.
		</p>
		<aside class="motion-representation">
			<a class="motion-letter h" href="en/help/motion#h">h</a>
			<a class="motion-letter j" href="en/help/motion#j">j</a>
			<a class="motion-letter k" href="en/help/motion#k">k</a>
			<a class="motion-letter l" href="en/help/motion#l">l</a>
		</aside>
	</article>
	<article>
		<h5>Close this window:</h5>
		<p>
			Use <span class="highlight">
				<a href="en/help/editing#%3Aquit"><span class="command">:q</span></a><span class="key">Enter</span>
			</span>.
		</p>
	</article>
	<article>
		<h5>Get specific help:</h5>
		<p>
			It is possible to go directly to whatever you want <a href="en/help/help#help">help</a> on, by giving an argument
			to the <span class="highlight"><a href="en/help/help#%3Ahelp"><span class="command">help</span></a></span> command.
		</p>
		<p id="help-context">Prepend something to specify the context:</p>
		<table>
			<thead>
				<tr>
					<th>WHAT</th>
					<th>PREPEND</th>
					<th>EXAMPLE</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><a href="en/help/intro#normal">Normal</a> mode command</td>
					<td>nothing</td>
					<td>
						<span class="highlight"><a href="en&/help/help#%3Ahelp"><span class="command">help</span></a> x</span>
					</td>
				</tr>
				<tr>
					<td><a href="en/help/visual#visual">Visual</a> mode command</td>
					<td>v_</td>
					<td>
						<span class="highlight"><a href="en/help/help#%3Ahelp"><span class="command">help</span></a> v_u</span>
					</td>
				</tr>
				<tr>
					<td><a href="en/help/insert#insert">Insert</a> mode command</td>
					<td>i_</td>
					<td>
						<span class="highlight">
							<a href="en/help/help#%3Ahelp"><span class="command">help</span></a>
							<a href="en/help/insert#i_<esc>">i_<span class="key">Enter</span></a>
						</span>
					</td>
				</tr>
				<tr>
					<td><a href="en/help/notes#Notes">Notes</a> mode command</td>
					<td>n_</td>
					<td>
						<span class="highlight">
							<a href="en/help/help#%3Ahelp"><span class="command">help</span></a>
							<a href="en/help/notes#n_<esc>">n_<span class="key">Enter</span></a>
						</span>
					</td>
				</tr>
				<tr>
					<td><a href="en/help/cmdline#command-line">Command-line</a> mode command</td>
					<td><a href="en/help/cmdLine#%3A">:</a></td>
					<td>
						<span class="highlight">
							<a href="en/help/help#%3Ahelp"><span class="command">help</span></a>
							<a href="en/help/editing#%3Aquit"><span class="command">quit</span></a>
						</span>
					</td>
				</tr>
				<tr>
					<td>Option</td>
					<td>'</td>
					<td>
						<span class="highlight">
							<a href="en/help/help#%3Ahelp"><span class="command">help</span></a>
							<a href="en/help/options#%27language%27"><span class="text">language</span></a>
						</span>
					</td>
				</tr>
			</tbody>
		</table>
		<p>See <a href="en/help/usr_02#help-summary">help-summary</a> for more contexts and an explication.</p>
		<p>
			See <a href="en/help/intro#notation">notation</a> for an explanation of the <a href="en/help/help#help">help</a>
			syntax.
		</p>
	</article>
	<article>
		<h5>Search for help:</h5>
		<p>
			Type "<span class="highlight">
				<a href="en/help/help#%3Ahelp"><span class="command">help</span></a> <a href="en/help/motion/word">word</a>
			</span>" then hit <span class="combination"><a href="en/help/scroll#ctrl-d">CTRL-D</a></span> to see matching
			entries <a href="en/help/help#help">help</a> entries for "<a href="en/help/motion/word">word</a>".
		</p>
	</article>
	<p>
		Vimdoku is a cross between the words <a href="en/intro#vim">VIM</a> and <a href="en/intro#sudoku">suDOKU</a>. Most
		of it is made by <a href="github.com/matrosmartz">Matros Martz</a>, but you can contribute.
		<a href="en/help/contributing">See how</a> (please, I don't know how to finish the documentation...).
	</p>
</section>
