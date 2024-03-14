#!/bin/bash

echo "Database Migrate"
python manage.py migrate

echo "Starting server"
gunicorn --bind 0.0.0.0:8000 Taskmanager.wsgi