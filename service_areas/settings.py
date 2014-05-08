"""
Django settings for service_areas project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
from unipath import Path
BASE_DIR = Path(__file__).parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'n@vq(7y$4fig!^@anqrs-n&iqxqempu)v1!5lgg42k6+*+b^pI'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

TEMPLATE_DEBUG = DEBUG

ALLOWED_HOSTS = ['54.207.37.156', 'ec2-54-235-156-174.compute-1.amazonaws.com']


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
)

PROJECT_APPS = (
    'service_areas.core',
)

INSTALLED_APPS += PROJECT_APPS

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.core.context_processors.static',
    'django.core.context_processors.request',
    'django.core.context_processors.media',
    'django.contrib.auth.context_processors.auth',
    'service_areas.core.context.google_maps_api_key',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'service_areas.urls'

WSGI_APPLICATION = 'service_areas.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'moziodb',
        'USER': 'mozio',
        'PASSWORD': 'mozio',
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


GOOGLE_MAPS_API_KEY = 'AIzaSyD2rNzcatObNTSex0H7NBd3cIwAjxTfzPk'

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR.parent.child('static')

STATICFILES_DIRS = (
    BASE_DIR.child('static'),
)

try:
    from .local_settings import *
except ImportError:
    pass
