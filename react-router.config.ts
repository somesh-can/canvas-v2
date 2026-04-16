import type { Config } from '@react-router/dev/config';

export default {
	appDirectory: './src/app',
	// Vercel static deployment fallback: disable SSR when explicitly requested.
	ssr: process.env.VERCEL_STATIC === '1' ? false : true,
	prerender: ['/*?'],
} satisfies Config;
