import { svelte } from '@sveltejs/vite-plugin-svelte'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defaultInclude, defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [svelte({ hot: Boolean(process.env.VITEST) }), tsconfigPaths()],
	test: {
		include: defaultInclude,
		environment: 'happy-dom',
		setupFiles: ['./src/vitest-setup.ts'],
	},
})
