# Parte A — versión Python (conservada como referencia)

Copia de la aplicación y del pipeline originales de la parte A, tal como se
entregan en el zip del campus (con las versiones de dependencias y la
configuración de CircleCI actualizadas para que sigan siendo ejecutables).

| Archivo | Descripción |
| --- | --- |
| `saludar.py` | App original con tres saludos y un `print` aleatorio |
| `test_saludar.py` | Tests unitarios con pytest |
| `requirements.txt` | `pytest` y `flake8` |
| `Dockerfile` | Dockerfile original (solo instala Python, no ejecuta la app) |
| `circleci-config-parte-a.yml` | Config de CircleCI que ejecutaba lint + tests |

En la parte B la aplicación se reescribe en Node.js/Express y el pipeline se
traslada a GitHub Actions. La configuración original completa del zip está en
`docs/reference/config-original-circleci.yml`.

Para ejecutar esta versión:

```bash
cd legacy/parte-a
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
flake8 --exclude='venv*' --statistics
pytest -v
```

> Si el `python3` de Homebrew falla al crear el entorno virtual por un error
> de `pyexpat`, usa `/usr/bin/python3 -m venv .venv`. En CI se usa la imagen
> `cimg/python:3.12`, por lo que este problema es solo local.
