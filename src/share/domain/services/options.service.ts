const testTexts = [
	'h[elp]',
	'h[elp] {subject}',
	'h[elp] (x)',
	'h[elp] (i_A)',
	"h[elp] 'number'",
	'h[elp] :set',
	'se[t] <all>',
	'se[t] <all&>',
	'se[t] (number)<?>',
	'se[t] (number)<&>',
	'se[t] <no>(number)',
	'se[t] (number)<!>',
	'se[t] <inv>(number)',
	'se[t] <no>(number)',
	"se[t] (themes)<=>'value'",
	"se[t] (themes)<:>'value'",
]

for (const text of testTexts) {
	const [cmd, , opt, , arg] = text.split(/(\[)(\w+)(\]\s?)/)

	console.log(
		(() => {
			const cmdRgx = `${cmd}(?:${opt})?`
			if (arg.length === 0 || /^\{\w+\}$/.test(arg)) return new RegExp(cmdRgx)
			const parsedArg = arg
				.replace(/(?<=<)[^}]+(?=>)/g, match => `[${match}]*`)
				.replace(/\(\w+\)/g, match => `[${match.slice(1, -1)}]*`)
				.replace(/[<>]/g, '')
				.replace(/(?<=[:=]\]\*")[^"]+(?=")/, '\\w+"?')
				.replace(/(?<=[:=]\]\*')[^']+(?=')/, "\\w+'?")
			return new RegExp(`${cmdRgx} ${parsedArg}`)
		})(),
		(() => {
			const optInput = opt.replace(/\[|\]/g, '')
			if (arg.length === 0 || /^\{\w+\}$/.test(arg)) return cmd + optInput
			const argInput = arg.replace(/[<>()]/g, '').replace(/(?:(?<=\w+[:=]")([^"]+"))|(?:(?<=\w+[:=]')([^']+'))/, '')

			return `${cmd}${optInput} ${argInput}`
		})(),
		(() => {
			const span = document.createElement('span')
			const cmdSpan = document.createElement('span')
			cmdSpan.classList.add('command')
			cmdSpan.textContent = ':' + cmd
			const optSpan = document.createElement('span')
			optSpan.classList.add('optional')
			optSpan.textContent = opt
			cmdSpan.appendChild(optSpan)
			span.appendChild(cmdSpan)

			if (arg.length === 0) return span

			span.appendChild(document.createTextNode(' '))

			for (const section of arg.split(/(?=\{)|(?='[^']+')|(?=\()/)) {
				if (section == null || section.length === 0) continue
				if (/^'.*'$/.test(section)) {
					const secSpan = document.createElement('span')
					secSpan.classList.add('text')
					secSpan.textContent = section.slice(1, -1)
					span.appendChild(secSpan)
				} else if (/^\{\w+\}$/.test(section)) {
					const secSpan = document.createElement('span')
					secSpan.classList.add('holder')
					secSpan.textContent = section.slice(1, -1)
					span.appendChild(secSpan)
				} else if (/^\(\w+\)$/.test(section)) {
					const secSpan = document.createElement('span')
					secSpan.classList.add('key')
					secSpan.textContent = section.slice(1, -1)
					span.appendChild(secSpan)
				} else if (/^:\w+$/.test(section)) {
					const secSpan = document.createElement('span')
					secSpan.classList.add('command')
					secSpan.textContent = section
					span.appendChild(secSpan)
				} else if (/^<.+>/.test(section)) {
					const secSpan = document.createElement('span')
					secSpan.classList.add('special')
					secSpan.textContent = section.slice(1, -1)
					span.appendChild(secSpan)
				} else span.appendChild(document.createTextNode(section))
			}

			return span
		})()
	)
}
