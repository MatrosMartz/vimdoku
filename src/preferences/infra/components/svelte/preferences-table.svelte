<script context="module" lang="ts">
	import type { LocaleType, ShareLocale, TextGetter } from '~/locales'
	import { Assert, BuildMatcher, capitalCase } from '~/share/utils'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import { ACCESSIBILITY_PREFS_NAMES, type Prefs, PREFS_FIELDS } from '$pref/domain/models'
	import { prefsState } from '$pref/infra/stores/svelte'

	type Locale = TextGetter<ShareLocale & LocaleType>

	/**
	 * Gets the translated value of the preference.
	 * @param key the preference key.
	 * @param locale the object of internationalization.
	 * @param prefs The current preferences.
	 * @returns The translated value of the preference.
	 */
	const getPrefText = new BuildMatcher<[key: PREFS_FIELDS.Key, locale: Locale, prefs: Prefs], string>()
		.addCase(
			Assert.array([new Assert(PREFS_FIELDS.subs.TOGGLE.containsKey), Assert.Any, Assert.Any]),
			(key, locale, prefs) => locale[`prefs_toggle_${prefs[key]}`](String(prefs[key]))
		)
		.addCase(Assert.array([Assert.equalTo('colorSchema'), Assert.Any, Assert.Any]), (key, locale, prefs) =>
			locale[`prefs_schema_${prefs[key]}`](prefs[key])
		)
		.addCase(
			Assert.array([Assert.equalTo(...ACCESSIBILITY_PREFS_NAMES), Assert.Any, Assert.Any]),
			(key, locale, prefs) => locale[`prefs_accessibility_${prefs[key]}`](prefs[key])
		)
		.default((key, locale, prefs) => String(prefs[key]))
		.done()
</script>

<script lang="ts">
	export let group: 'sudoku' | 'user' | 'vim'
	export let showDiff: boolean

	$: locale = $i18nState.ns('share')

	$: entries = PREFS_FIELDS.subs[group.toUpperCase() as Uppercase<typeof group>].entries()
</script>

<table class="preferences">
	<thead>
		<tr><th colspan="2">{locale[`prefs_groups_${group}`](capitalCase(group))}</th> </tr>
	</thead>
	<tbody>
		{#each entries as [key, opts] (key)}
			<tr class="field highlight" class:strike={showDiff && $prefsState[key] === opts.default}>
				<th class="bold secondary">{locale[`prefs_names_${key}`](capitalCase(key))}</th>
				<td class="monospace value {opts.type}">{getPrefText(key, locale, $prefsState)}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.preferences {
		position: relative;
		padding-block: 1.5rem 1rem;
		padding-inline: 1rem;
		background-color: rgb(var(--editor-background));
		border-radius: 8px;
		box-shadow: 0 4px 16px rgb(var(--card-head-shadow));
	}

	.preferences:not(:first-of-type) {
		margin-top: 1rem;
	}

	thead th {
		position: absolute;
		top: 0;
		left: -2rem;
		width: calc(25% + 2rem);
		min-width: max-content;
		max-width: 12rem;
		padding: 4px 2rem;
		text-align: start;
		background-color: rgb(var(--card-head-background));
		border-radius: 0 8px 8px 0;
		transform: translateY(-50%);
	}

	tbody {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: min(100%, 40ch);
		margin-inline: auto;
		list-style: none;
	}

	.field {
		display: flex;
		gap: 1ch;
		align-items: center;
		justify-content: space-between;
	}

	.field * {
		transition: opacity 200ms;
	}

	.strike * {
		font-style: italic;
		text-decoration: line-through 2px;
		opacity: 0.3;
	}

	.toggle-show {
		max-width: max-content;
	}
</style>
