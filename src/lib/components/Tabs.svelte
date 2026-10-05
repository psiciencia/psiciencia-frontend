<script lang="ts" generics="T extends string">
	// Pestañas accesibles (patrón WAI-ARIA): flechas para moverse, Inicio/Fin, y la pestaña activa
	// se refleja en el hash de la URL para poder enlazarla (p. ej. /tecnologias/iot#agro).
	import { onMount, type Snippet } from 'svelte';
	import Icon, { type IconName } from './Icon.svelte';

	let {
		tabs,
		label,
		panel,
		syncHash = true
	}: {
		tabs: { id: T; label: string; icon?: IconName }[];
		label: string;
		panel: Snippet<[T]>;
		syncHash?: boolean;
	} = $props();

	const uid = $props.id();
	let chosen = $state<T | undefined>();
	// Pestaña activa: la elegida si sigue existiendo; si no, la primera.
	const selected = $derived(chosen !== undefined && tabs.some((t) => t.id === chosen) ? chosen : tabs[0].id);
	let buttons: HTMLButtonElement[] = $state([]);
	let root: HTMLDivElement | undefined = $state();

	onMount(() => {
		if (!syncHash) return;
		const fromHash = decodeURIComponent(location.hash.slice(1)) as T;
		if (tabs.some((t) => t.id === fromHash)) {
			chosen = fromHash;
			// Enlace directo a una pestaña: se lleva la vista hasta las pestañas.
			root?.scrollIntoView({ block: 'start' });
		}
	});

	function select(id: T, focus = false) {
		chosen = id;
		if (syncHash) history.replaceState(history.state, '', `#${id}`);
		if (focus) buttons[tabs.findIndex((t) => t.id === id)]?.focus();
	}

	function onKey(event: KeyboardEvent, index: number) {
		const last = tabs.length - 1;
		const next =
			event.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
			: event.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
			: event.key === 'Home' ? 0
			: event.key === 'End' ? last
			: null;
		if (next === null) return;
		event.preventDefault();
		select(tabs[next].id, true);
	}
</script>

<div class="tabs" bind:this={root}>
	<div class="tablist" role="tablist" aria-label={label}>
		{#each tabs as tab, i (tab.id)}
			<button
				bind:this={buttons[i]}
				type="button"
				role="tab"
				id="{uid}-tab-{tab.id}"
				aria-selected={selected === tab.id}
				aria-controls="{uid}-panel"
				tabindex={selected === tab.id ? 0 : -1}
				onclick={() => select(tab.id)}
				onkeydown={(event) => onKey(event, i)}
			>
				{#if tab.icon}<Icon name={tab.icon} size={18} />{/if}
				{tab.label}
			</button>
		{/each}
	</div>
	<div class="panel" role="tabpanel" id="{uid}-panel" aria-labelledby="{uid}-tab-{selected}" tabindex="0">
		{@render panel(selected)}
	</div>
</div>

<style>
	.tabs {
		scroll-margin-top: 80px;
	}

	.tablist {
		display: flex;
		gap: 0.35rem;
		overflow-x: auto;
		padding-bottom: 2px;
		border-bottom: 1px solid var(--border);
		scrollbar-width: thin;
	}

	button {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		white-space: nowrap;
		border: 0;
		background: none;
		color: var(--text-muted);
		font: inherit;
		font-weight: 600;
		padding: 0.65rem 0.9rem;
		border-bottom: 3px solid transparent;
		margin-bottom: -1px;
		cursor: pointer;
		border-radius: 8px 8px 0 0;
	}

	button:hover {
		color: var(--text);
		background: var(--surface-muted);
	}

	button[aria-selected='true'] {
		color: var(--accent);
		border-bottom-color: var(--accent);
	}

	.panel {
		padding-top: 1.25rem;
	}

	.panel:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 4px;
		border-radius: 8px;
	}
</style>
