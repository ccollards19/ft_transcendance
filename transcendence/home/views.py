from django.http import HttpResponse
from django.template import loader

# Create your views here.
def index(request):
    template = loader.get_template("single_page.html")
    context = {"test": "test",}
    return HttpResponse(template.render(context, request))
