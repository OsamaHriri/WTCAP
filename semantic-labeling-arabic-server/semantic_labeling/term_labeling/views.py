from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.


def home(request):
    return HttpResponse('<h1> hello there </h1>')


def process(request):
    return HttpResponse('<h1> general kenobi</h1>')
