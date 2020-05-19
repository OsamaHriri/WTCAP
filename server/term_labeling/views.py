from django.shortcuts import render
from .scripts.almaany_translator_bot import ALmaanyBot
from .scripts.graph import Graph
import requests
import sys
import os
from .scripts.mongodbConnector import Connector
from subprocess import run, PIPE

# Create your views here.


def index(request):
    return render(request, 'index.html')


def button(request):
    return render(request, 'home.html')


def output(request):
    data = requests.get("https://www.google.com/")
    print(data.text)
    data = data.text
    return render(request, 'home.html', {'data': data})


def external(request):
    inp = request.POST.get('param')
    bot = ALmaanyBot()
    out = bot.search(inp)

    return render(request, 'home.html', {'data1': out})


def external2(request):
    inp = request.POST.get('param1')
    p = Graph()
    g, tags = p.getdata()
    head = []
    for t in tags:
        if t.level == "0":
            head.append(t)
    for l in head:
        p = g.find_path(l.name, inp)
        if p is not None:
            break
    if p is not None:
       return render(request, 'home.html', {'data2': p})
    return render(request, 'home.html', {'data1':'not found'})
