# Capturas para la memoria

Guarda aquí las capturas con **exactamente estos nombres** (formato PNG). La
versión imprimible `docs/memoria.html` ya las referencia; en cuanto existan,
sustituyen automáticamente a los marcadores de "captura pendiente".

## Parte A — CircleCI

| Archivo | Qué debe mostrar |
| --- | --- |
| `a1-repo-github.png` | Repositorio recién creado en GitHub con los archivos del zip |
| `a2-circleci-setup.png` | Pantalla de CircleCI al conectar el proyecto (Set Up Project) |
| `a3-pipeline-verde.png` | Workflow `ci-parte-a` en verde |
| `a4-detalle-tests.png` | Detalle del job `build`: pasos de instalación y pytest |
| `a5-log-pytest.png` | Salida de pytest con los 3 tests superados |

## Parte B — GitHub Actions

| Archivo | Qué debe mostrar |
| --- | --- |
| `b1-estructura-repo.png` | Estructura final del repositorio en GitHub (src, tests, workflows) |
| `b2-actions-ci.png` | Ejecución del workflow CI con los jobs `Lint`, `Test (20)`, `Test (22)`, `security` y `docker-build` en verde |
| `b3-cobertura.png` | Tabla de cobertura en el log o el artefacto `coverage` descargado |
| `b4-codeql.png` | Resultado del análisis CodeQL (pestaña Security → Code scanning) |
| `b5-cd-smoke.png` | Workflow CD: jobs `publish` y `smoke-test` en verde |
| `b6-ghcr-package.png` | Imagen publicada en GitHub Packages (ghcr.io) con sus tags |
| `b7-branch-protection.png` | (Opcional) Reglas de protección de `main` con los checks requeridos |
| `b8-pr-checks.png` | (Opcional) Pull request con los checks de CI en verde |

> Consejo: en macOS puedes capturar una ventana con `⌘⇧4` y espacio, o una
> selección con `⌘⇧4`. Nombra el archivo al guardarlo.
