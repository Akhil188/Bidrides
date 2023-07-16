"""
WSGI config for myproject project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""

import os
import cx_Oracle

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')

cx_Oracle.init_oracle_client()
application = get_wsgi_application()

# AWS Lambda handler function
def lambda_handler(event, context):
    # Pass the event and context to the Django application
    response = application(event, context)

    # Return the response from the Django application
    return response

  # Replace with the actual path to the Oracle client library if needed
