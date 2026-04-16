import type { Config } from '@react-router/dev/config';

export default {
	appDirectory: './src/app',
	// Vercel static deployment fallback: disable SSR only in Vercel builds.
	ssr: process.env.VERCEL ? false : true,
	prerender: ['/*?'],
} satisfies Config;
