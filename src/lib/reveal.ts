// Acción `use:reveal`: el elemento aparece con un fundido hacia arriba al entrar en pantalla.
// Sin JavaScript (SSR) el contenido es visible: la clase que lo oculta se añade al montar.
// Con prefers-reduced-motion el CSS desactiva la animación.
import type { Action } from 'svelte/action';

let observer: IntersectionObserver | undefined;

function getObserver() {
	observer ??= new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					observer?.unobserve(entry.target);
				}
			}
		},
		{ rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
	);
	return observer;
}

export const reveal: Action<HTMLElement, { delay?: number } | undefined> = (node, options) => {
	node.classList.add('reveal');
	if (options?.delay) node.style.transitionDelay = `${options.delay}ms`;
	getObserver().observe(node);
	return {
		destroy() {
			observer?.unobserve(node);
		}
	};
};
