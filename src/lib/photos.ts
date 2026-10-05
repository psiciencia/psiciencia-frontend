// Fotos de los heros (static/images/hero). Todas de Unsplash, bajo la Licencia Unsplash
// (uso libre, también comercial, sin atribución obligatoria). Aun así acreditamos al autor.
export type PhotoKey =
	| 'sectores'
	| 'psicologia'
	| 'educacion'
	| 'empresa'
	| 'industria'
	| 'salud'
	| 'agro'
	| 'tecnologias'
	| 'realidad-extendida'
	| 'simulacion'
	| 'iot';

export interface Photo {
	src: string;
	srcSmall: string;
	alt: string;
	author: string;
	url: string;
}

const photo = (key: PhotoKey, id: string, author: string, alt: string): Photo => ({
	src: `/images/hero/${key}.webp`,
	srcSmall: `/images/hero/${key}-sm.webp`,
	alt,
	author,
	url: `https://unsplash.com/photos/${id}`
});

export const photos: Record<PhotoKey, Photo> = {
	sectores: photo('sectores', 'JKUTrJ4vK00', 'Luke Chesser', 'Pantalla de portátil con gráficas de analítica de datos'),
	psicologia: photo('psicologia', 'tw-mAZXr6H4', 'Vitaly Gariev', 'Psicóloga tomando notas durante una sesión de terapia con una paciente'),
	educacion: photo('educacion', 'TB5HpfJf7mA', 'Vitaly Gariev', 'Estudiantes conversando en un aula universitaria'),
	empresa: photo('empresa', '3B5Hf9_PLpU', 'Vitaly Gariev', 'Equipo de trabajo revisando gráficas en una reunión de negocio'),
	industria: photo('industria', '8gr6bObQLOI', 'Simon Kadula', 'Brazos robóticos en una línea de producción industrial'),
	salud: photo('salud', '5VkNa1LrS8A', 'Accuray', 'Dos profesionales médicos revisando un escáner cerebral en monitores'),
	agro: photo('agro', 'c_gxVbDsXlk', 'Elisa Photography', 'Dron volando sobre un campo de trigo'),
	tecnologias: photo('tecnologias', 'kMl4FSGXQRo', 'Andrea De Santis', 'Vista aérea nocturna de una ciudad iluminada'),
	'realidad-extendida': photo('realidad-extendida', 'ieAHQWOwAY8', 'UK Black Tech', 'Joven usando un visor de realidad virtual'),
	simulacion: photo('simulacion', 'ZmDk8tXQRS0', 'Encata PD', 'Ingeniero trabajando con diseños y simulaciones en varias pantallas'),
	iot: photo('iot', 'w69Z8K-HGQU', 'Immo Wegmann', 'Chip iluminado sobre una placa de circuito electrónico')
};
