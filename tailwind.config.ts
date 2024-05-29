import { join } from 'path'
import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin'
import { customTheme } from './custom-theme.ts'
import { transform } from 'valibot';

export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	theme: {
		extend: {
			animation: {
				spin:'spin 2s linear infinite',
			},
			keyframes: {
					spin: {
						'0%': { transform: 'rotate(0deg)' },
						'100%': { transform: 'rotate(360deg)' }
					}
			}
		},
	},
	plugins: [
		forms,
		typography,
		skeleton({
			themes: {
				custom: [
					customTheme
				]
			},
		}),
	],
} satisfies Config;
