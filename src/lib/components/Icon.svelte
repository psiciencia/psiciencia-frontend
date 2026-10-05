<script lang="ts" module>
	// Íconos de trazo simples (24×24, currentColor).
	const paths = {
		data: 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3Zm0 0v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',
		brain: 'M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3 3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm6 0a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3 3 3 0 0 1-3-3',
		rocket: 'M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2m-1-4 4 4m-1-9c3-4 7-6 11-6 0 4-2 8-6 11l-4 2-5-5 2-4Zm7 1a1.5 1.5 0 1 0 0-.01',
		pulse: 'M3 12h4l2-6 4 12 2-6h6',
		flask: 'M9 3h6M10 3v6L4.5 19A1.5 1.5 0 0 0 5.8 21h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3M7 15h10',
		registry: 'M4 5h16v4H4zM4 11h16v4H4zM4 17h16v3H4zM7 7h.01M7 13h.01',
		api: 'M8 7 3 12l5 5M16 7l5 5-5 5M14 4l-4 16',
		shield: 'M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Zm-3 9 2 2 4-4',
		school: 'M2 9l10-5 10 5-10 5L2 9Zm4 2v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5M22 9v6',
		briefcase: 'M4 7h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Zm5 0V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 12h18',
		factory: 'M3 20V10l5 3V10l5 3V6h3l1-3h2l1 3v14H3Zm4-4h2m3 0h2',
		heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10ZM8 11h2l1-2 2 4 1-2h2',
		coins: 'M8 8c3.3 0 6-1.1 6-2.5S11.3 3 8 3 2 4.1 2 5.5 4.7 8 8 8Zm-6-2.5v4C2 10.9 4.7 12 8 12s6-1.1 6-2.5v-4M10 14.8c1.1.6 2.8 1 4.5 1C18 15.8 21 14.7 21 13.3s-3-2.5-6.5-2.5M2 9.5v4C2 14.9 4.7 16 8 16M21 13.3v4c0 1.4-3 2.5-6.5 2.5S8 18.7 8 17.3v-4',
		megaphone: 'M3 10v4a1 1 0 0 0 1 1h3l7 4V5L7 9H4a1 1 0 0 0-1 1Zm4 5 1 5h3l-1-4M18 9a4 4 0 0 1 0 6',
		landmark: 'M3 21h18M5 21V10m4 11V10m6 11V10m4 11V10M2 10h20L12 3 2 10Z',
		users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 10v-1a6 6 0 0 1 12 0v1M16 3.5a4 4 0 0 1 0 7M22 21v-1a6 6 0 0 0-4-5.6',
		lock: 'M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Zm2 0V7a4 4 0 0 1 8 0v4m-4 4v2',
		scale: 'M12 3v18M7 21h10M5 7h14M5 7l-3 7a3 3 0 0 0 6 0L5 7Zm14 0-3 7a3 3 0 0 0 6 0l-3-7',
		eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
		chat: 'M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm4 5h8m-8 3h5',
		clipboard: 'M9 4h6v3H9zM9 5H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-3M8 12h8m-8 4h5',
		vr: 'M4 8h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-4l-2-2.5h-4L8 17H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2Zm3.5 4.5h.01m8.99 0h.01M8 8V6h8v2',
		cube: 'M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Zm0 0v9m0 0 8-4.5M12 12 4 7.5M12 12v9',
		sensor: 'M12 13a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm-3.5-5a5 5 0 0 0 0 7m7 0a5 5 0 0 0 0-7M5.6 5a9 9 0 0 0 0 13m12.8 0a9 9 0 0 0 0-13M12 13v8',
		leaf: 'M5 19c0-8 5-14 15-15-1 10-7 15-15 15Zm0 0 8-8M5 19H3',
		layers: 'M12 3 2 8l10 5 10-5-10-5ZM2 12l10 5 10-5M2 16l10 5 10-5',
		cloud:'M7 18a4 4 0 0 1-.6-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9H7Z',
		hand:'M12 21a7 7 0 0 1-7-7v-3a1.5 1.5 0 0 1 3 0v2V5.5a1.5 1.5 0 0 1 3 0V11V4.5a1.5 1.5 0 0 1 3 0V11V6.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-5 7'
	} as const;

	export type IconName = keyof typeof paths;
</script>

<script lang="ts">
	let { name, size = 24 }: { name: IconName; size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
	<path d={paths[name]} />
</svg>
