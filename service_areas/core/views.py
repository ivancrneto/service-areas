""" This is the views module for core app, which concentrates the main views
of our application"""

from django.shortcuts import render, redirect
from django.core.urlresolvers import reverse as r
from django.contrib.gis.geos import Polygon, MultiPolygon, Point
from service_areas.util.decorators import render_to_json
from service_areas.core.models import ServiceArea
import json


def home(request):
    """ As we have only two pages, home just redirects to the draw page, which
        is the default page for our purposes
    """
    return redirect(r('core:draw'))

def draw(request):
    """ This view just returns the html for the draw page """
    return render(request, 'draw.html', {})

@render_to_json()
def submit_draw(request):
    """ This view handles the submission of a drawn polygon and saves properly
    """

    # roughly gettings points from post
    points = request.POST.getlist('points[]')
    points = [map(float, p.split(',')) for p in points]

    # we need to repeat the first point at the final because geo types require
    points.append(points[0])

    polygon = Polygon(points)
    polygons = MultiPolygon(polygon)

    area = ServiceArea(polygons=polygons)
    area.save()

    return {'success': True}

def query(request):
    """ This view just returns the html with a point to the query page """

    area = ServiceArea.objects.order_by('-created')[0]
    coords = json.dumps(area.polygons.coords)

    return render(request, 'query.html', {'coords': coords})

@render_to_json()
def query_area(request):
    """ This view handles the query if a point is inside the last area drawn
    """

    point = request.GET['point']
    point = [float(p) for p in point.split(',')]
    point = Point(point)

    area = ServiceArea.objects.order_by('-created')[0]
    result = area.polygons.contains(point)

    return {'success': True, 'result': result}
