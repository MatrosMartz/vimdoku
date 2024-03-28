#!/usr/bin/env node

'use strict'

import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

if (!('dirname' in import.meta)) import.meta.dirname = fileURLToPath(new URL('.', import.meta.url))

const LOCALE_DIR = path.join(import.meta.dirname, 'src/locales')

/**
 *
 * @returns
 */
async function findLocales() {
	/** @type {Array<{localeDir: string, name: string, schemaDir: string}>} */
	const locales = []

	const stack = [LOCALE_DIR]

	while (stack.length > 0) {
		const currDir = stack.pop()
		if (currDir == null) break

		for (const item of await fs.readdir(currDir)) {
			const itemPath = path.join(currDir, item)
			const itemStats = await fs.stat(itemPath)
			if (itemStats.isDirectory()) stack.push(itemPath)
			else if (itemStats.isFile() && item.endsWith('.locale.ts')) {
				const name = item.slice(0, -10)
				locales.push({
					localeDir: itemPath,
					name,
					schemaDir: path.join(path.relative(LOCALE_DIR, currDir), name, 'i18n-schema.json'),
				})
			} else if (itemStats.isFile() && item === 'locale.ts') {
				locales.push({
					localeDir: itemPath,
					name: '',
					schemaDir: path.join(path.relative(LOCALE_DIR, currDir), 'i18n-schema.json'),
				})
			}
		}
	}

	for (const value of locales) console.log(`Find: "${value.localeDir}"`)

	return locales
}

/**
 *
 * @param i {string}
 * @returns {[string, {isExported: boolean, extendsFrom: string[], properties: string[]}]}
 */
function tokenize(i) {
	const name = /(?<=interface\s+)(\w)+/.exec(i)?.[0] ?? ''
	const obj = {
		isExported: /^export/.test(i),
		extendsFrom: /(?<=extends\s+)[\w,\s]+/.exec(i)?.[0].split(/,\s*/) ?? [],
		properties:
			/(?<=\{\n)[^}]*/s
				.exec(i)?.[0]
				.replace(/(\t)|([\n\s]+$)/g, '')
				.split(/[\n;]/) ?? [],
	}

	return [name, obj]
}

/**
 *
 * @param path {string}
 * @returns
 */
async function getsInterfaces(path) {
	const content = await fs.readFile(path, { encoding: 'utf8' })
	const interfaces = content
		.replace(/(import.*\n+)|(\n+(?=(?:interface|export|$)))|(\s+(?=\{))/g, '')
		.split(/(?<=\})/g)
		.map(tokenize)

	console.log(`Getting interfaces for: "${path}"`)

	return new Map(
		interfaces.sort(([nameA, { extendsFrom: fromA }], [nameB, { extendsFrom: fromB }]) =>
			fromB.includes(nameA) ? -1 : fromA.includes(nameB) ? 1 : fromA.length - fromB.length
		)
	)
}

/**
 *
 * @param {Map<string, {isExported: boolean;extendsFrom: string[];properties: string[];}>} interfaces
 */
function getsPrincipal(interfaces) {
	for (const [name, value] of interfaces) {
		if (value.extendsFrom.length <= 0) continue

		/** @type {string[]} */
		let fatherProps = []
		for (const father of value.extendsFrom) {
			const newFatherProps = interfaces.get(father)?.properties
			if (newFatherProps == null) continue
			fatherProps = [...fatherProps, ...newFatherProps]
			interfaces.delete(father)
		}

		interfaces.set(name, {
			...value,
			extendsFrom: [],
			properties: [...value.properties, ...fatherProps],
		})
	}

	const [name, value] = Array.from(interfaces)[0]

	return { name, ...value }
}

/**
 *
 * @param {{isExported: boolean;extendsFrom: string[];properties: string[];name: string;}} principal
 */
function createSchema(principal) {
	const newProps = principal.properties.map(prop => {
		const [name, _, keywords] = prop.split(/(?:\:\s+)|(?:<\[)|(?:\]>)/)

		if (keywords == null) return [name, '{"type":"string"}']

		const parseKeywords = keywords.replaceAll("'", '').split(/,\s*/)

		return [
			name,
			`{"type":"string","pattern":"^${parseKeywords.map(kw => `(?=.*\\\\{\\\\|${kw}\\\\|\\\\})`).join('')}.*$"}`,
		]
	})

	console.log(`Create schema for: "${principal.name}"`)

	const head =
		'{"$schema":"http://json-schema.org/draft-07/schema#","properties":{"$schema":{"const":"./i18n-schema.json"}'
	const tail =
		'},"required":' +
		JSON.stringify(['$schema', ...newProps.map(prop => prop[0])]) +
		',"additionalProperties":false,"title":"vimdoku-${principal.name}-i18n","type":"object"}'

	if (newProps.length <= 0) return head + tail
	return head + ',' + newProps.map(([key, value]) => `"${key}":${value}`).join(',') + tail
}

/**
 * @param {{localeDir: string;name: string;schemaDir: string;}} locale
 */
async function writeSchema(locale) {
	const principal = getsPrincipal(await getsInterfaces(locale.localeDir))

	const JSONSchema = createSchema(principal)
	const schemaPath = path.join(import.meta.dirname, 'public/locales', locale.schemaDir)

	await fs.writeFile(schemaPath, JSONSchema)

	console.log(`Write: "${schemaPath}"`)
	return {
		interfaceName: principal.name,
		relativeDir: path.relative(LOCALE_DIR, locale.localeDir),
	}
}

const locales = await findLocales()

const importTokens = (await Promise.all(locales.map(writeSchema))).sort(
	({ relativeDir: dirA }, { relativeDir: dirB }) => (dirA > dirB ? 0 : -1)
)

/**
 * @type {{pagesTokens:{localeDir: string;name: string;schemaDir: string;} ,noPagesTokens:{localeDir: string;name: string;schemaDir: string;}}}
 */
const { pagesTokens, noPagesTokens } = importTokens.reduce(
	(acc, curr) => {
		if (curr.relativeDir.startsWith('pages')) acc.pagesTokens.push(curr)
		else acc.noPagesTokens.push(curr)

		return acc
	},
	{ pagesTokens: [], noPagesTokens: [] }
)

const importLocalesStr =
	'import type { ' +
	pagesTokens.map(({ interfaceName }) => interfaceName).join(', ') +
	" } from './pages'\n" +
	noPagesTokens
		.map(({ interfaceName, relativeDir }) => `import type { ${interfaceName} } from './${relativeDir}'`)
		.join('\n') +
	"\nimport type { LocaleText, LocaleValueWithKeywords } from './types'"

const namespaceInterfaceStr =
	'\n\nexport interface Namespace {\n' +
	importTokens
		.map(({ interfaceName, relativeDir }) => `\t'${relativeDir.slice(0, -10)}': ${interfaceName}`)
		.join('\n') +
	'\n}'

const namespaceTsContentEnd = `
export type Locales = Namespace[keyof Namespace]


export type NamespaceTextGetter<Locale extends Locales> = {
	[Key in keyof Locale]: Locale[Key] extends LocaleValueWithKeywords<infer Kw>
		? (fallback: LocaleText<Kw>, keywords: Record<Kw[number], string>) => string
		: (fallback: string) => string
}
`

const namespaceTsContent = importLocalesStr + namespaceInterfaceStr + namespaceTsContentEnd

const namespacesPath = path.join(LOCALE_DIR, '/namespace.ts')

await fs.writeFile(namespacesPath, namespaceTsContent)

console.log(`Update: "${namespacesPath}"`)
