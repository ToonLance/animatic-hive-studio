
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: '#2A2A2A',
				input: '#2A2A2A',
				ring: '#8A2BE2',
				background: '#121212',
				foreground: '#FFFFFF',
				primary: {
					DEFAULT: '#8A2BE2',
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#00CED1',
					foreground: '#000000'
				},
				destructive: {
					DEFAULT: '#FF5555',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#2A2A2A',
					foreground: '#A0A0A0'
				},
				accent: {
					DEFAULT: '#333333',
					foreground: '#FFFFFF'
				},
				popover: {
					DEFAULT: '#1A1A1A',
					foreground: '#FFFFFF'
				},
				card: {
					DEFAULT: '#1A1A1A',
					foreground: '#FFFFFF'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				pulse: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' },
				}
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"float": "float 6s ease-in-out infinite",
				"pulse": "pulse 3s ease-in-out infinite"
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
