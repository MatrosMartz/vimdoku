<script lang="ts">
	import { i18nState } from '$i18n/infra/stores/svelte'

	const date = new Date('26 March 2024')

	$: timeFormatted = new Intl.DateTimeFormat($i18nState.lang, { day: '2-digit', year: 'numeric', month: 'short' })

	$: dateFormatted = timeFormatted.format(date)
</script>

<section class="center-self">
	<span>
		{$i18nState.ns('share').help_title('For Vimdoku version {|version|}. last change: {|lastChange|}.', {
			version: '0.0.1',
			lastChange: `${dateFormatted}`,
		})}
	</span>
</section>
