import type { Config } from '@react-router/dev/config';

export default {
	appDirectory: './src/app',
	// Static deployment target for Vercel.
	ssr: false,
	prerender: ['/*?'],
} satisfies Config;
