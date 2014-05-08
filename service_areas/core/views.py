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
    return render(request, 'query.html', {})
