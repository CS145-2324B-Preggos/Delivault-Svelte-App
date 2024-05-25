
import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const customTheme: CustomThemeConfig = {
    name: 'my-custom-theme',
    properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": `system-ui`,
		"--theme-font-family-heading": `system-ui`,
		"--theme-font-color-base": "0 0 0",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "9999px",
		"--theme-rounded-container": "8px",
		"--theme-border-base": "1px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "0 0 0",
		"--on-secondary": "255 255 255",
		"--on-tertiary": "0 0 0",
		"--on-success": "0 0 0",
		"--on-warning": "0 0 0",
		"--on-error": "255 255 255",
		"--on-surface": "255 255 255",
		// =~= Theme Colors  =~=
		// primary | #f86b14 
		"--color-primary-50": "254 233 220", // #fee9dc
		"--color-primary-100": "254 225 208", // #fee1d0
		"--color-primary-200": "253 218 196", // #fddac4
		"--color-primary-300": "252 196 161", // #fcc4a1
		"--color-primary-400": "250 151 91", // #fa975b
		"--color-primary-500": "248 107 20", // #f86b14
		"--color-primary-600": "223 96 18", // #df6012
		"--color-primary-700": "186 80 15", // #ba500f
		"--color-primary-800": "149 64 12", // #95400c
		"--color-primary-900": "122 52 10", // #7a340a
		// secondary | #042c60 
		"--color-secondary-50": "217 223 231", // #d9dfe7
		"--color-secondary-100": "205 213 223", // #cdd5df
		"--color-secondary-200": "192 202 215", // #c0cad7
		"--color-secondary-300": "155 171 191", // #9babbf
		"--color-secondary-400": "79 107 144", // #4f6b90
		"--color-secondary-500": "4 44 96", // #042c60
		"--color-secondary-600": "4 40 86", // #042856
		"--color-secondary-700": "3 33 72", // #032148
		"--color-secondary-800": "2 26 58", // #021a3a
		"--color-secondary-900": "2 22 47", // #02162f
		// tertiary | #4d4b4b 
		"--color-tertiary-50": "228 228 228", // #e4e4e4
		"--color-tertiary-100": "219 219 219", // #dbdbdb
		"--color-tertiary-200": "211 210 210", // #d3d2d2
		"--color-tertiary-300": "184 183 183", // #b8b7b7
		"--color-tertiary-400": "130 129 129", // #828181
		"--color-tertiary-500": "77 75 75", // #4d4b4b
		"--color-tertiary-600": "69 68 68", // #454444
		"--color-tertiary-700": "58 56 56", // #3a3838
		"--color-tertiary-800": "46 45 45", // #2e2d2d
		"--color-tertiary-900": "38 37 37", // #262525
		// success | #84cc16 
		"--color-success-50": "237 247 220", // #edf7dc
		"--color-success-100": "230 245 208", // #e6f5d0
		"--color-success-200": "224 242 197", // #e0f2c5
		"--color-success-300": "206 235 162", // #ceeba2
		"--color-success-400": "169 219 92", // #a9db5c
		"--color-success-500": "132 204 22", // #84cc16
		"--color-success-600": "119 184 20", // #77b814
		"--color-success-700": "99 153 17", // #639911
		"--color-success-800": "79 122 13", // #4f7a0d
		"--color-success-900": "65 100 11", // #41640b
		// warning | #EAB308 
		"--color-warning-50": "252 244 218", // #fcf4da
		"--color-warning-100": "251 240 206", // #fbf0ce
		"--color-warning-200": "250 236 193", // #faecc1
		"--color-warning-300": "247 225 156", // #f7e19c
		"--color-warning-400": "240 202 82", // #f0ca52
		"--color-warning-500": "234 179 8", // #EAB308
		"--color-warning-600": "211 161 7", // #d3a107
		"--color-warning-700": "176 134 6", // #b08606
		"--color-warning-800": "140 107 5", // #8c6b05
		"--color-warning-900": "115 88 4", // #735804
		// error | #D41976 
		"--color-error-50": "249 221 234", // #f9ddea
		"--color-error-100": "246 209 228", // #f6d1e4
		"--color-error-200": "244 198 221", // #f4c6dd
		"--color-error-300": "238 163 200", // #eea3c8
		"--color-error-400": "225 94 159", // #e15e9f
		"--color-error-500": "212 25 118", // #D41976
		"--color-error-600": "191 23 106", // #bf176a
		"--color-error-700": "159 19 89", // #9f1359
		"--color-error-800": "127 15 71", // #7f0f47
		"--color-error-900": "104 12 58", // #680c3a
		// surface | #ffffff 
		"--color-surface-50": "255 255 255", // #ffffff
		"--color-surface-100": "255 255 255", // #ffffff
		"--color-surface-200": "255 255 255", // #ffffff
		"--color-surface-300": "255 255 255", // #ffffff
		"--color-surface-400": "255 255 255", // #ffffff
		"--color-surface-500": "255 255 255", // #ffffff
		"--color-surface-600": "230 230 230", // #e6e6e6
		"--color-surface-700": "191 191 191", // #bfbfbf
		"--color-surface-800": "153 153 153", // #999999
		"--color-surface-900": "125 125 125", // #7d7d7d
		
	}
}