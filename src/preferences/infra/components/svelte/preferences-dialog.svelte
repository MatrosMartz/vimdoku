<script lang="ts">
	import { Tab, TabGroup, TabList, TabPanel } from '~/share/infra/components/svelte/tab'

	import PreferencesDisplay from './preferences-display.svelte'
	import PreferencesForm from './preferences-form.svelte'

	let dialog: HTMLDialogElement

	let selected = 'all'

	let hide = false
</script>

<button
	on:click={() => {
		dialog.showModal()
	}}
>
	open
</button>

<dialog
	class:hide
	bind:this={dialog}
	on:animationend={({ animationName }) => {
		if (/backdrop-hide$/.test(animationName)) {
			hide = false
			dialog.close()
		}
	}}
>
	<div class="content">
		<TabGroup bind:selected>
			<TabList>
				<Tab key="all">Show</Tab>
				<Tab key="edit">Edit.</Tab>
				<li>
					<button on:click={() => (hide = true)}>close</button>
				</li>
			</TabList>
			<TabPanel key="all">
				<PreferencesDisplay />
			</TabPanel>
			<TabPanel key="edit">
				<PreferencesForm />
			</TabPanel>
		</TabGroup>
	</div>
</dialog>

<style>
	dialog {
		inset: 0;
		margin: auto;
		color: inherit;
		background: none;
		border: none;
	}

	dialog[open] {
		animation: show 500ms ease-in-out;
	}

	@keyframes show {
		from {
			opacity: 0;
			transform: translateY(-50%);
		}
	}

	dialog.hide {
		animation: hide 500ms ease-in-out;
	}

	@keyframes hide {
		to {
			opacity: 0;
			transform: translateY(-50%);
		}
	}

	dialog::backdrop {
		background-color: rgb(61 25 71 / 10%);
		backdrop-filter: blur(15px);
	}

	dialog[open]::backdrop {
		animation: backdrop-show 500ms ease-in-out;
	}

	@keyframes backdrop-show {
		from {
			opacity: 0;
		}
	}

	dialog.hide::backdrop {
		animation: backdrop-hide 500ms ease-in-out;
	}

	@keyframes backdrop-hide {
		to {
			opacity: 0;
		}
	}

	.content {
		display: flex;
		flex-direction: column;
		width: 80vw;
		max-width: 600px;
		height: 90vh;
		overflow: hidden;
		background-color: hsl(280deg 17% 14%);
		border-radius: 8px;
	}

	li button {
		position: absolute;
		right: 0;
		height: 100%;
		aspect-ratio: 1 / 1;
		border: none;
	}
</style>
