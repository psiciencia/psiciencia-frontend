import { api, optional } from '#lib/server/api.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [platform, history] = await Promise.all([optional(api.platform()), optional(api.versions())]);
	return { platform, history };
};
