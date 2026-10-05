# psiciencia-frontend

Interfaz web del stack de MLflow, hecha con SvelteKit 3, Svelte 5 y TypeScript. Muestra qué modelo está en producción y permite hacer predicciones individuales y por lote, y analizar drift.

No necesitas Node instalado en Windows: todo se ejecuta en contenedores `node:22-alpine`.

## Arquitectura

```
Navegador ──► SvelteKit (localhost:3000) ──► FastAPI (http://api:8000, red interna) ──► MLflow
```

El navegador **nunca** habla con FastAPI. Las páginas cargan datos en funciones `load` y envían formularios a *form actions*, que se ejecutan en el servidor de SvelteKit. Así:

- la URL interna de la API (y en el futuro su API key) no llega al cliente;
- no hace falta CORS en FastAPI;
- los formularios funcionan incluso sin JavaScript (progressive enhancement con `use:enhance`).

## Páginas

| Ruta | Qué hace | Endpoints de FastAPI |
|---|---|---|
| `/` | Landing de PsiCiencia Tech: hero, cifras de la plataforma, servicios, pipeline, gráficas en vivo, stack | `/platform/summary`, `/model/versions` |
| `/sectores` | Página independiente de sectores: hero con foto, método común, galería de sectores con fotos, seis problemas transversales (pestañas), comparativa y diagnóstico interactivo de madurez de datos | — |
| `/sectores/psicologia` | Psicología basada en datos: fuentes de datos, áreas de aplicación, 4 ejemplos con gráficas, metodología, técnicas y ética | — |
| `/sectores/[slug]` | Educación, empresa, industria, salud y agro: problemas, casos de uso, ejemplo con gráfica, métricas de éxito y técnicas | — |
| `/tecnologias` | Hub de tecnologías: ciclo medir-aprender-explorar-experimentar-decidir, un bloque por sector con dos secciones (qué aporta cada tecnología y un caso integrado), mapa de aplicaciones y retos transversales | — |
| `/tecnologias/[slug]` | Realidad extendida, simulación e IoT: qué datos generan, relación con la ciencia de datos, pipeline, **pestañas por sector** (psicología, salud, educación, industria, agro, empresa, investigación), ejemplo con gráfica y retos | — |
| `/model` | Ficha del modelo, métricas, evolución por versión, importancia de variables, real vs. predicho, residuos y distribución de las variables | `/model`, `/model/versions`, `/model/importance`, `/model/evaluation`, `/reference/distribution` |
| `/predict` | Formulario generado desde la firma del modelo, margen típico (± MAE), predicción en contexto y análisis what-if por variable | `/predict`, `/model/evaluation` |
| `/batch` | Subida de CSV, indicadores, histograma de predicciones y descarga del CSV con la columna `prediction` | `/predict` |
| `/drift` | p-value por variable con umbral y distribución de referencia vs. datos actuales | `/drift`, `/reference/distribution` |

Las gráficas de la landing y de los sectores usan **datos sintéticos** con semilla fija (`src/lib/showcase.ts`) y lo indican en cada tarjeta: ilustran el tipo de análisis, no resultados reales. El contenido de cada sector está en `src/lib/sectors.ts` y el de las tecnologías en `src/lib/technologies.ts`; para añadir un sector con página propia basta con añadir su entrada con el campo `page`.

**Imágenes y efectos.** Los heros usan fotos de Unsplash (Licencia Unsplash: uso libre, también comercial) guardadas en `static/images/hero/` en WebP; el autor se acredita en cada hero y el registro está en `src/lib/photos.ts`. El carrusel `LogoCarousel` muestra las herramientas del stack con iconos de Simple Icons (CC0); no representa clientes ni socios. Los efectos (aparición al hacer scroll con `use:reveal`, contadores `CountUp`, zoom lento de los heros, elevación de tarjetas) se desactivan con `prefers-reduced-motion`.

Todas las tarjetas tienen una explicación que aparece al dejar el cursor encima (o al pulsar el botón **i** en pantallas táctiles). El interruptor **Modo guía** de la cabecera las activa o desactiva y se recuerda en el navegador.

Las gráficas son componentes SVG propios (`src/lib/components/charts/`), sin librerías externas. Usan una paleta validada para daltonismo y contraste en modo claro y oscuro, muestran un tooltip al pasar el cursor y tienen un desplegable **Ver datos** con la tabla de valores.

Al cambiar `MODEL_URI` en la API, todas las páginas se adaptan solas, porque leen el esquema de entrada desde `GET /model`. Por ejemplo, funcionan igual con `housing_model` y con `diabetes_rf_model`.

## Estructura

```
psiciencia-frontend/
├── Dockerfile              # build multi-stage → imagen solo con Node + build/
├── vite.config.ts          # adapter-node (Docker) o adapter-vercel (Vercel), ORIGIN, polling
├── src/
│   ├── env.ts              # variables de entorno tipadas (API_URL privada, MLFLOW_UI_URL pública)
│   ├── app.css             # tokens de diseño (modo claro y oscuro)
│   ├── lib/
│   │   ├── components/     # Logo, InfoCard (explicaciones), Footer, Icon, ilustraciones y charts/
│   │   ├── guide.svelte.ts # estado del modo guía
│   │   ├── stats.ts        # histogramas, cuantiles, comparación con la referencia
│   │   ├── server/api.ts   # cliente de FastAPI (solo servidor)
│   │   ├── csv.ts          # parseo y validación de CSV
│   │   ├── drift.ts        # resumen del reporte de Evidently
│   │   ├── format.ts       # formato de números y fechas
│   │   └── types.ts        # tipos compartidos
│   └── routes/
│       ├── +layout.server.ts   # health + modelo para todas las páginas
│       ├── +layout.svelte      # navegación y estado del modelo
│       ├── +page.svelte        # / (landing)
│       ├── model/              # /model
│       ├── predict/            # /predict  (+page.svelte, +page.server.ts)
│       ├── batch/              # /batch
│       └── drift/              # /drift
```

En SvelteKit 3 el alias de `src/lib` es `#lib` (definido en `package.json → imports`), y las variables de entorno se declaran en `src/env.ts` y se importan desde `$app/env/private` o `$app/env/public`.

## Variables de entorno

| Variable | Dónde se usa | Valor en Docker | Valor por defecto |
|---|---|---|---|
| `API_URL` | Servidor (privada) | `http://api:8000` | `http://127.0.0.1:8000` |
| `MLFLOW_UI_URL` | Navegador (pública) | `http://localhost:5000` | `http://localhost:5000` |
| `ORIGIN` | Build (CSRF) | `http://localhost:3000` (build arg) | se deduce de la petición |
| `BODY_SIZE_LIMIT` | adapter-node | `20M`, para subir CSV | `512K` |

`ORIGIN` hace falta porque adapter-node, sin un proxy delante, asume `https`. Sin ella rechazaría con 403 ("Cross-site POST form submissions are forbidden") los formularios enviados desde `http://localhost`.

## Uso con Docker Compose

Ejecuta los comandos desde la raíz del repositorio (`ciencia_datos_2026/`).

**Producción local** (imagen compilada, http://localhost:3000):

```powershell
docker compose up -d --build frontend
```

**Desarrollo con recarga en caliente** (http://localhost:5173). Monta `src/` desde Windows y detecta los cambios por polling:

```powershell
docker compose --profile dev up frontend-dev
```

Para detenerlo usa `Ctrl+C`, o `docker compose --profile dev stop frontend-dev`.

## Comandos pnpm dentro de Docker

Sin Node en el host, cualquier comando de pnpm se ejecuta en un contenedor efímero. En PowerShell, desde `psiciencia-frontend/`:

```powershell
# Alias para la sesión actual
function pnpmd { docker run --rm -it -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 -v "${PWD}:/app" -w /app node:22-alpine sh -c "corepack enable pnpm && pnpm $args" }

pnpmd install                 # instalar dependencias
pnpmd check                   # validar tipos (svelte-check)
pnpmd build                   # compilar
pnpmd add -D nombre-paquete   # añadir una dependencia
```

En `cmd.exe` cambia `${PWD}` por `%cd%`:

```cmd
docker run --rm -it -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 -v "%cd%:/app" -w /app node:22-alpine sh -c "corepack enable pnpm && pnpm check"
```

Después de añadir dependencias, reconstruye la imagen (`docker compose up -d --build frontend`). Para el perfil dev, borra su volumen de `node_modules`: `docker compose --profile dev down` y `docker volume rm ciencia_datos_2026_frontend_node_modules`.

## Cómo se creó el proyecto

```cmd
docker run -it --rm -v "%cd%:/app" -w /app node:22-alpine sh -c "corepack enable pnpm && pnpm dlx sv create psiciencia-frontend"
```

Opciones elegidas: plantilla *SvelteKit minimal*, *TypeScript*, sin add-ons y pnpm como gestor de paquetes. Equivalente sin preguntas:

```sh
pnpm dlx sv@1.0.1 create --template minimal --types ts --install pnpm psiciencia-frontend
```

`-it` es necesario porque el asistente es interactivo. Sin él, el comando termina sin crear el proyecto. Si se ejecuta desde la raíz del repo, pnpm deja un `node_modules/.pnpm-store` en la raíz, que se puede borrar.

## SEO

- **Metadatos por página** con el componente `src/lib/components/Seo.svelte`: título, descripción, URL canónica, `robots`, Open Graph y Twitter Card. Las páginas de error llevan `noindex`.
- **Imágenes para compartir** (1200×630) en `static/og/`, una por sector y tecnología, más `default.jpg` y `plataforma.jpg`. Íconos PNG y `manifest.webmanifest` en `static/`.
- **`/sitemap.xml` y `/robots.txt`** se generan en `src/routes` a partir de las listas de sectores y tecnologías: una página nueva aparece sola en el sitemap.
- **Datos estructurados (JSON-LD)**: `Organization`, `WebSite` y `FAQPage` en la portada, y `BreadcrumbList` en sectores y tecnologías (`src/lib/seo.ts`).
- **`SITE_URL`** es la URL pública del sitio (sin barra final). En local vale `http://localhost:3000`; en producción debe ser el dominio real con `https`, porque canónicas, Open Graph y sitemap usan URLs absolutas.

Después de publicar: dar de alta el dominio en Google Search Console, enviar `https://<dominio>/sitemap.xml` y probar las tarjetas con el depurador de compartición de cada red social.

## Despliegue en Vercel

1. En Vercel, **New Project** → importa el repositorio → **Root Directory** = `psiciencia-frontend`.
2. Variables de entorno: `API_URL` (URL pública **HTTPS** de tu FastAPI), `MLFLOW_UI_URL` y `SITE_URL` (el dominio del sitio). No definas `ORIGIN`, porque Vercel sirve por HTTPS y el origen se deduce solo.
3. `vite.config.ts` detecta `VERCEL=1` y usa `@sveltejs/adapter-vercel`; en Docker usa `@sveltejs/adapter-node`.

La API de FastAPI, MLflow, PostgreSQL y MinIO **no** se despliegan en Vercel: necesitan un servidor con Docker. Antes de exponer la API a Internet, añade autenticación (por ejemplo, una API key que solo conozca `src/lib/server/api.ts`).
