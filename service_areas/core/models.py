from django.contrib.gis.db import models


class ServiceArea(models.Model):
    polygons = models.MultiPolygonField()
    created = models.DateTimeField(auto_now_add=True)

    objects = models.GeoManager()
