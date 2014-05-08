""" Module for navigation related tags """

from django import template
from django.core.urlresolvers import reverse

register = template.Library()

@register.simple_tag
def navactive(request, urls, **kwargs):
    """ Returns active if the page we are currenty is in the urls passed as
        argument
    """
    if request.path in (reverse(url, kwargs=kwargs) for url in urls.split()):
        return "active"
    return ""
