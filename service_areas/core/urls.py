from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('service_areas.core.views',

    url(r'^$', 'home', name='home'),
)