# Backend Quick Reference

The backend is the Django REST API for Maaza Cafe Online. Its setup instructions, complete file map, API reference, test commands, and deployment notes are maintained in the [root project README](../README.md).

From this directory, the usual local commands are:

```bash
python -m venv env
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

Activate the virtual environment before installing dependencies or running Django. See the root README before running `seed_maaza_cafe.py`; it deletes existing products and resets the demo seller password.