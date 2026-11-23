# Guía de entrega paso a paso

Esta guía cubre lo que no se puede automatizar desde el proyecto: publicar en
tu GitHub, conectar CircleCI, capturar las evidencias y generar el PDF.

## 0. Antes de empezar

Rellena los datos personales en `docs/memoria.md`:

- `[Nombre de la asignatura]`
- `[Nombre y apellidos]`

Comprueba que no queda ningún marcador:

```bash
grep -n '\[Nombre' docs/memoria.md
```

## 1. Crear el repositorio en GitHub

### Opción A — desde la web

1. Entra en <https://github.com/new>.
2. Crea un repositorio **vacío** llamado `pipeline-devops` (sin README, sin
   `.gitignore`, sin licencia).
3. Desde la carpeta del proyecto:

   ```bash
   cd "/Users/raulorenesledesma/Desktop/mis cosas /master/modulo2/pipeline-devops"
   git remote add origin https://github.com/ROL1324/pipeline-devops.git
   git push -u origin main --tags
   ```

### Opción B — con GitHub CLI

```bash
brew install gh
gh auth login
cd "/Users/raulorenesledesma/Desktop/mis cosas /master/modulo2/pipeline-devops"
gh repo create pipeline-devops --public --source=. --remote=origin --push
git push origin --tags
```

> El repositorio puede ser público o privado. Si es privado, el job de CodeQL
> se omite automáticamente porque GitHub Advanced Security no está incluido.
> Para la captura B4, usa un repositorio público.

## 2. Permisos de GitHub Actions

En el repositorio: **Settings → Actions → General → Workflow permissions**.
Marca **Read and write permissions** y guarda. Sin esto, el CD no puede
publicar la imagen en GHCR.

## 3. Primera ejecución del CI

Al hacer `push` a `main` se lanza el workflow **CI**. Comprueba en la pestaña
**Actions** que pasan:

- `Lint (ESLint)`
- `Test (Node 20)` y `Test (Node 22)`
- `Seguridad (npm audit)`
- `Docker build + smoke test`

Capturas:

- **B2** → `capturas/b2-actions-ci.png` (vista general del workflow en verde).
- **B3** → `capturas/b3-cobertura.png` (tabla de cobertura en el log o el
  artefacto `coverage`).

## 4. Ejecución del CD

Cuando el CI termina en verde sobre `main`, se dispara **CD** (`workflow_run`).
Comprueba:

- `Construir y publicar imagen` en verde.
- `Smoke test de la imagen publicada` en verde.
- La imagen aparece en **Packages** (GHCR).

Capturas:

- **B5** → `capturas/b5-cd-smoke.png`.
- **B6** → `capturas/b6-ghcr-package.png`.

> Si el CD no se lanza, revisa que el CI haya terminado en verde sobre `main`
> y que el workflow se llame exactamente `CI`.

## 5. CodeQL

En repositorios públicos, el workflow **CodeQL** analiza el código en cada
`push` a `main`, en pull requests y semanalmente. El resultado está en
**Security → Code scanning**.

- **B4** → `capturas/b4-codeql.png`.

## 6. Protección de la rama `main`

En **Settings → Branches → Add branch protection rule**:

1. Patrón: `main`.
2. Activa **Require status checks to pass before merging**.
3. Selecciona:
   - `Lint (ESLint)`
   - `Test (Node 20)`
   - `Test (Node 22)`
   - `Seguridad (npm audit)`
   - `Docker build + smoke test`
4. Guarda.

- **B7** → `capturas/b7-branch-protection.png` (opcional).

### Captura opcional de pull request

```bash
git checkout -b docs/mejora-readme
# haz un cambio pequeño, por ejemplo una línea en README.md
git add README.md
git commit -m "docs: mejora del README"
git push -u origin docs/mejora-readme
```

Abre el pull request en GitHub y captura los checks:

- **B8** → `capturas/b8-pr-checks.png` (opcional).

Después puedes cerrar el PR sin fusionarlo.

## 7. Reproducir las capturas de la parte A con CircleCI

La parte A está congelada en la etiqueta `parte-a`. Crea una rama temporal:

```bash
git branch parte-a-demo parte-a
git push origin parte-a-demo
```

1. Entra en <https://app.circleci.com> e inicia sesión con GitHub.
2. **Projects → Set Up Project → Use existing config**.
3. CircleCI construirá la rama `parte-a-demo` con el pipeline Python.
4. Captura:
   - **A1** → `capturas/a1-repo-github.png` (repositorio en GitHub).
   - **A2** → `capturas/a2-circleci-setup.png` (configuración del proyecto).
   - **A3** → `capturas/a3-pipeline-verde.png` (workflow `ci-parte-a`).
   - **A4** → `capturas/a4-detalle-tests.png` (job `build`).
   - **A5** → `capturas/a5-log-pytest.png` (3 tests superados).
5. Borra la rama temporal:

   ```bash
   git push origin --delete parte-a-demo
   git branch -d parte-a-demo
   ```

> CircleCI construye todas las ramas por defecto. Si solo construye la
> principal, revisa **Project Settings → Build settings** y desactiva
> temporalmente "Only build pull requests".

## 8. Guardar las capturas

Guarda cada PNG en `docs/capturas/` con el nombre exacto indicado en
[`capturas/README.md`](capturas/README.md). Los nombres son importantes:
`memoria.html` los referencia automáticamente.

## 9. Generar el PDF de la memoria

```bash
npm run docs:build
open docs/memoria.html
```

En el navegador pulsa **Imprimir / Guardar PDF**. Recomendaciones:

- Tamaño A4.
- Activa **Gráficos de fondo** (Chrome: *Más ajustes → Gráficos de fondo*;
  Safari: *Imprimir fondos*) para conservar las cabeceras de las tablas.
- Comprueba que las 13 figuras se ven y que no queda ningún marcador
  "Captura pendiente".

## 10. Checklist final

- [ ] Datos personales y URL del repositorio rellenados en la memoria.
- [ ] CI en verde en `main` (B2, B3).
- [ ] CD en verde y paquete en GHCR (B5, B6).
- [ ] CodeQL ejecutado en repositorio público (B4).
- [ ] Rama `main` protegida (B7, opcional).
- [ ] Pull request con checks (B8, opcional).
- [ ] Capturas A1–A5 de CircleCI en `docs/capturas/`.
- [ ] `npm run docs:build` ejecutado después de añadir las capturas.
- [ ] PDF generado y revisado.
- [ ] Repositorio accesible para el profesor (público o con invitación).

## 11. Problemas frecuentes

| Síntoma | Causa probable | Solución |
| --- | --- | --- |
| `npm ci` falla en CI | `package-lock.json` desincronizado | Ejecuta `npm install` y commitea el lock |
| El CD no se ejecuta | El CI no está verde en `main` | Revisa Actions → CI |
| Error 403 al publicar en GHCR | Permisos del token | Settings → Actions → Read and write |
| CodeQL se omite | Repositorio privado | Es esperado; usa un repo público para B4 |
| CircleCI no arranca la rama | Solo construye PRs | Revisa la configuración del proyecto |
| El PDF no muestra colores | Gráficos de fondo desactivados | Actívalos en el diálogo de impresión |
| No hay Docker en local | Docker Desktop no instalado | El CI valida la imagen; instálalo si quieres probar en local |
| `python3 -m venv` falla al crear el entorno | El Python 3.14 de Homebrew tiene `pyexpat` roto en este equipo | Usa `/usr/bin/python3 -m venv ...` o reinstala `expat` con Homebrew |
