import { svelte } from '@sveltejs/vite-plugin-svelte'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [svelte({ hot: Boolean(process.env.VITEST) }), tsconfigPaths()],
	test: {
		environment: 'happy-dom',
		setupFiles: ['./test/vitest-setup.ts'],
		// typecheck: {
		// 	enabled: true,
		// 	allowJs: true,
		// }
	},
})
