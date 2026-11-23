# Pipeline DevOps — Parte A (CircleCI)

Aplicación Python mínima (`saludar.py`) con sus tests (`pytest`) y su pipeline
de integración continua en CircleCI.

## Contenido

| Archivo | Descripción |
| --- | --- |
| `saludar.py` | Tres funciones de saludo y un `print` aleatorio al ejecutarse |
| `test_saludar.py` | Tests unitarios con pytest |
| `requirements.txt` | `pytest` y `flake8` |
| `.circleci/config.yml` | Pipeline de CI (lint + tests) |
| `docs/reference/config-original-circleci.yml` | Config original del zip, conservado para la memoria |

## Ejecutar en local

```bash
python3 -m venv venv
. venv/bin/activate
pip install -r requirements.txt
flake8 --exclude=venv* --statistics
pytest -v
```

## Activar el pipeline en CircleCI

1. Crea un repositorio en GitHub y sube este proyecto.
2. Entra en <https://app.circleci.com> e inicia sesión con GitHub.
3. **Projects → Set Up Project → Use existing config** (la configuración ya
   está en `.circleci/config.yml`).
4. Haz un commit y observa el workflow `ci-parte-a`.

> La configuración original del zip usaba `version: 2` y la imagen
> `circleci/python:3.7`, retirada por CircleCI. Este proyecto usa `version: 2.1`
> y `cimg/python:3.12`; el detalle y la justificación están en
> `docs/memoria.md`.
