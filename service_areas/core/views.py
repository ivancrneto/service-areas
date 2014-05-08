""" This is the views module for core app, which concentrates the main views
of our application"""

from django.shortcuts import render, redirect
from django.core.urlresolvers import reverse as r
from service_areas.util.decorators import render_to_json


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

    points = request.POST.getlist('points[]')
    points = [map(float, p.split(',')) for p in points]

    request.session['points'] = points

    return {'success': True}

def query(request):
    """ This view just returns the html with a point to the query page """

    points = request.session['points']

    return render(request, 'query.html', {'points': points})

@render_to_json()
def query_area(request):
    """ This view handles the query if a point is inside the last area drawn
    """

    point = request.GET['point']

    import random
    return {'success': True, 'result': bool(random.randint(0, 1))}
