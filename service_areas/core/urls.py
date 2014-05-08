from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('service_areas.core.views',
    url(r'^$', 'home', name='home'),
    url(r'draw$', 'draw', name='draw'),
    url(r'draw/submit$', 'submit_draw', name='submit_draw'),
    url(r'query$', 'query', name='query'),
    url(r'query_area$', 'query_area', name='query_area'),
)
