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
    return render(request, 'draw.html', {})

@render_to_json()
def submit_draw(request):
    print request.POST.getlist('points[]')

    return {'success': True}

def query(request):
    points = [[37.80286695148153, -122.41104125976562],
              [37.80042550214271, -122.46288299560547],
              [37.7688150141044, -122.4781608581543],
              [37.76379407899244, -122.4235725402832],
              [37.77709202770888, -122.39645004272461]]

    return render(request, 'query.html', {'points': points})
