// "Modo guía": muestra explicaciones al pasar el cursor por las tarjetas. Se recuerda por navegador.
const STORAGE_KEY = 'psiciencia:guide';

let enabled = $state(true);

export const guide = {
	get enabled() {
		return enabled;
	},
	set enabled(value: boolean) {
		enabled = value;
		try {
			localStorage.setItem(STORAGE_KEY, value ? 'on' : 'off');
		} catch {
			// Navegación privada o almacenamiento bloqueado: se mantiene solo en memoria.
		}
	},
	/** Se llama una vez en el navegador (onMount del layout). */
	restore() {
		try {
			enabled = localStorage.getItem(STORAGE_KEY) !== 'off';
		} catch {
			enabled = true;
		}
	}
};
