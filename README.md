# Pipeline DevOps: de CircleCI a GitHub Actions

Proyecto de la actividad del **módulo 2**. Se monta primero un pipeline de
integración continua con CircleCI sobre una aplicación Python (parte A) y
después se evoluciona a un pipeline completo con GitHub Actions, pruebas
automatizadas y entrega continua con Docker (parte B).

- **Parte A:** etiqueta `parte-a` del repositorio y carpeta `legacy/parte-a/`.
- **Parte B:** estado actual de `main`, descrito en este README y en
  [`docs/memoria.md`](docs/memoria.md).

## Stack

| Capa | Tecnología |
| --- | --- |
| Aplicación | Node.js 20+ y Express 4 |
| Tests | Jest 30, Supertest y fast-check |
| Calidad | ESLint 10 y cobertura con umbral mínimo |
| CI/CD | GitHub Actions (CI, CD y CodeQL) |
| Contenedores | Docker multi-stage y Docker Compose |
| Registro | GitHub Container Registry (GHCR) |
| Pipeline legado | CircleCI (actualizado a Node.js) |

## Estructura

```text
.
├── .circleci/config.yml            # Pipeline legado en CircleCI (parte B)
├── .github/workflows/
│   ├── ci.yml                      # Lint, tests, auditoría y build Docker
│   ├── cd.yml                      # Publicación en GHCR + smoke test + deploy
│   └── codeql.yml                  # Análisis estático (SAST)
├── src/
│   ├── app.js                      # Aplicación Express (factoría)
│   ├── greetings.js                # Lógica de negocio
│   └── server.js                   # Arranque HTTP y apagado ordenado
├── tests/
│   ├── unit/                       # Pruebas unitarias de greetings.js
│   ├── integration/                # Pruebas HTTP con Supertest
│   └── property/                   # Pruebas basadas en propiedades
├── docs/
│   ├── memoria.md                  # Memoria de trabajo
│   ├── memoria.html                # Versión imprimible (generada)
│   ├── diagrama-pipeline.svg       # Diagrama del pipeline
│   ├── capturas/                   # Capturas de pantalla de la memoria
│   └── reference/                  # Config original del zip
├── legacy/parte-a/                 # App Python y pipeline de la parte A
├── Dockerfile                      # Imagen de producción multi-stage
├── docker-compose.yml
├── eslint.config.mjs
├── jest.config.js
├── package.json
└── package-lock.json
```

## API

| Método | Ruta | Ejemplo | Respuesta |
| --- | --- | --- | --- |
| GET | `/` | `/` | `{"message":"Hola, mundo!"}` |
| GET | `/health` | `/health` | `{"status":"ok","uptime":1.23}` |
| GET | `/languages` | `/languages` | `{"languages":["es","en","fr"]}` |
| GET | `/greet/:name` | `/greet/Ana?lang=en` | `{"message":"Hello, Ana!"}` |

Códigos de error: `400` para nombres o idiomas no válidos y `404` para rutas
desconocidas.

## Puesta en marcha en local

Requisitos: Node.js 20 o superior. Docker es opcional.

```bash
npm ci
npm run lint
npm run test:coverage
npm run security
npm start
```

En otra terminal:

```bash
curl http://localhost:3000/greet/Ana?lang=en
```

### Scripts disponibles

| Script | Qué hace |
| --- | --- |
| `npm start` | Arranca el servidor en el puerto 3000 |
| `npm run dev` | Arranca con recarga automática |
| `npm run lint` | ESLint sobre todo el proyecto |
| `npm test` | Toda la batería de tests |
| `npm run test:unit` | Solo pruebas unitarias |
| `npm run test:integration` | Solo pruebas de integración |
| `npm run test:property` | Solo pruebas basadas en propiedades |
| `npm run test:coverage` | Tests + cobertura con umbrales mínimos |
| `npm run security` | `npm audit` sobre dependencias de producción |
| `npm run verify` | Lint + cobertura + auditoría (equivale al CI) |
| `npm run docs:build` | Genera `docs/memoria.html` desde el Markdown |

## Estrategia de pruebas

| Tipo | Herramienta | Qué comprueba |
| --- | --- | --- |
| Unitarias | Jest | Reglas de negocio de `greetings.js` |
| Integración | Jest + Supertest | Rutas HTTP, códigos de estado y errores |
| Basadas en propiedades | fast-check | Invariantes sobre cientos de entradas generadas |
| Cobertura | Jest | Umbral mínimo del 80 % en ramas y 85 % en líneas/funciones |
| Estática | ESLint | Errores y malas prácticas de JavaScript |
| Dependencias (SCA) | `npm audit` | Vulnerabilidades conocidas en producción |
| Seguridad estática (SAST) | CodeQL | Patrones inseguros en el código |
| Contenedor | Docker + `curl` | La imagen arranca y `/health` responde |

Resultado local actual: **27 tests superados**, **97 % de cobertura** y
**0 vulnerabilidades** en dependencias de producción.

## CI con GitHub Actions

`.github/workflows/ci.yml` se ejecuta en cada `push` a `main` y en cada pull
request:

1. **Lint (ESLint)**.
2. **Test (Node 20 y 22)** en matriz, con umbral de cobertura y artefacto
   `coverage`.
3. **Seguridad (npm audit)** sobre dependencias de producción.
4. **Docker build + smoke test**: construye la imagen y comprueba que el
   contenedor responde en `/health` antes de permitir el CD.

Ventajas aplicadas: caché de npm, caché de capas Docker en GitHub Actions,
cancelación de ejecuciones obsoletas (`concurrency`) y permisos mínimos
(`contents: read`).

## CD con Docker y GHCR

`.github/workflows/cd.yml` se dispara **solo cuando el workflow CI termina
correctamente sobre `main`** (`workflow_run`), además de con tags `v*` y de
forma manual. Pasos:

1. Construye la imagen de producción multi-stage.
2. La publica en GHCR con tags `latest`, rama, SHA y tag de release.
3. Guarda y propaga el **digest inmutable** de la imagen.
4. Descarga esa misma imagen por digest y ejecuta un **smoke test** real.
5. Opcionalmente despliega por SSH en un servidor con Docker (job `deploy`).

La imagen final:

- Usa `node:20-alpine` y solo dependencias de producción.
- Se ejecuta como usuario `node` (sin privilegios).
- Incluye `HEALTHCHECK` contra `/health`.
- Excluye tests, docs y secretos mediante `.dockerignore`.

### Despliegue opcional

El job `deploy` está desactivado por defecto. Para activarlo, define la
variable de repositorio `DEPLOY_ENABLED=true` y estos secretos:

| Nombre | Tipo | Uso |
| --- | --- | --- |
| `DEPLOY_HOST` | Secreto | Host SSH del servidor |
| `DEPLOY_USER` | Secreto | Usuario SSH |
| `DEPLOY_SSH_KEY` | Secreto | Clave privada SSH |
| `GHCR_PAT` | Secreto | PAT con permiso `read:packages` para el servidor |
| `DEPLOY_ENABLED` | Variable | `true` activa el job |

## Docker en local

```bash
docker build -t pipeline-devops .
docker run --rm -p 3000:3000 pipeline-devops
# o
docker compose up --build
```

## Cómo activar el proyecto en GitHub

1. Crea un repositorio vacío en GitHub (sin README ni licencia).
2. Sube el proyecto:

   ```bash
   git remote add origin https://github.com/TU_USUARIO/pipeline-devops.git
   git branch -M main
   git push -u origin main --tags
   ```

3. En **Settings → Actions → General → Workflow permissions**, marca
   **Read and write permissions** para que `GITHUB_TOKEN` pueda publicar en
   GHCR.
4. El primer `push` lanza el CI. Cuando termine en verde sobre `main`, se
   dispara el CD y la imagen aparece en **Packages**.
5. Recomendado: en **Settings → Branches**, protege `main` y exige los checks
   `Lint (ESLint)`, `Test (Node 20)`, `Test (Node 22)`,
   `Seguridad (npm audit)` y `Docker build + smoke test`.

### Reproducir las capturas de la parte A

La parte A está congelada en la etiqueta `parte-a`. Para que CircleCI ejecute
aquel pipeline Python:

```bash
git branch parte-a-demo parte-a
git push origin parte-a-demo
```

Conecta el repositorio en <https://app.circleci.com> (**Projects → Set Up
Project → Use existing config**) y toma las capturas de la rama
`parte-a-demo`. Después puedes borrarla:

```bash
git push origin --delete parte-a-demo
git branch -d parte-a-demo
```

### Probar una release (CD por tag)

```bash
git tag -a v2.0.0 -m "Parte B: CI/CD con GitHub Actions"
git push origin v2.0.0
```

## Documentación de la actividad

- [`docs/memoria.md`](docs/memoria.md): memoria de trabajo completa.
- `docs/memoria.html`: versión imprimible; se genera con `npm run docs:build`
  y se guarda como PDF desde el navegador.
- [`docs/GUIA-DE-ENTREGA.md`](docs/GUIA-DE-ENTREGA.md): pasos para publicar en
  GitHub, conectar CircleCI, capturar evidencias y generar el PDF.
- [`docs/capturas/README.md`](docs/capturas/README.md): lista exacta de
  capturas que hay que añadir.
