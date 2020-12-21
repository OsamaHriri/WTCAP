from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from .scripts.almaany_translator_bot import ALmaanyBot
from .scripts.tagGraph import Tag
from .scripts.mongodbConnector import Connector
from .scripts.wordTagging import Tagging
from django.contrib.auth.decorators import login_required
import requests
import pyarabic.araby as araby
from threading import Thread, Lock
from farasa.stemmer import FarasaStemmer
import json
from django.contrib.staticfiles import finders
import re

# Create your views here.

stemmer = FarasaStemmer(interactive=True)


def main_tag_page(request):
    t = Tag()
    all_tags = t.getAllTags()["tags"]
    c = Connector()
    if request.method == 'GET':
        id = request.GET['poem_iid']
    else:
        id = 2066

    poem = (c.get_poem(id))[0]

    split_context = []
    for row in poem['context']:
        split_context.append({'row_index': row['row_index'],
                              'sadr': row['sadr'].strip().split(' '),
                              'ajuz': row['ajuz'].strip().split(' ')})
    poem['context'] = split_context
    # meta_data = c.get_meta_data(poem.poet_id)
    context = {
        'poems': poem,
        # 'meta': meta_data,
        'title': 'Home',
        'all_tags': all_tags,
        'poem_id': id,
    }
    return render(request, 'main_tag_page.html', context)


def index(request):
    context = {
        'title': 'Main Page',
    }
    return render(request, 'index.html', context)


@login_required()
def tags(request):
    t = Tag()
    all_tags = t.getAllTags()["tags"]
    context = {
        'title': 'Tags',
        'all_tags': all_tags
    }
    return render(request, 'manage_tags.html', context)


# def process_lines(request):
#     selected = []
#     if request.method == 'POST':
#         chosen_lines = list(request.POST.values())
#         for value in poem.__iter__():
#             if value.__getitem__('index') in chosen_lines:
#                 print('this index exists')
#                 selected.append(value)
#                 print(selected)
#     context = {
#         'selected': selected
#     }
#     return render(request, 'process_lines.html', context)


@login_required()
def settings(request):
    context = {
        'title': 'Settings',
    }
    return render(request, 'settings.html', context)


@login_required()
def statistics(request):
    c = Connector()
    periods = c.get_periods()
    frequency = [10, 20, 30, 50, 70, 80, 100, 200, 300, 400, 500, 1000]
    frequency.reverse()
    range = ['0-50', '50-100', '100-150', '150-200', '200-250', '250-300', '300-350', '350-400', '400-450',
             '450-500', '500-550', '550-600', '600-650', '650-700', '700-750', '750-800', '800-850', '850-900',
             '900-950', '950-1000']
    reslut = finders.find('images/Analysis/generalInfo.json')
    f = open(reslut)
    json_string = f.read()
    f.close()
    # Convert json string to python object
    data = json.loads(json_string)
    context = {
        'title': 'Statistics',
        'frequency': frequency,
        'info': data[0],
        'range': range,
        'periods': periods
    }
    return render(request, 'statistics.html', context)


@login_required()
def select_poet_page(request):
    c = Connector()
    poets = c.get_poets()
    poems = c.get_poems()
    context = {
        'poets': poets,
        'poems': poems,
        'title': 'Poem selection'
    }
    return render(request, 'select_poet.html', context)


def poet_poems(request):
    """
    :param HTTP request:
    :return: STRING of poems for this poet, split by ,
    """
    if request.method == 'GET':
        poetId = request.GET['poet_id']
        c = Connector()
        poems = c.get_poems_by_poet(int(poetId))
        idlist = ""
        for pp in poems:
            idlist = idlist + pp['id'] + ","
        if idlist is not None:
            print(idlist)
            return JsonResponse({
                "poem_ids": idlist})
        else:
            return HttpResponse("not found")
    else:
        return HttpResponse("not success")


def all_poems(request):
    """

    :param request: An empty GET request
    :return: a list of all poems we have in db
    """
    if request.method == 'GET':
        c = Connector()
        poems = c.get_poems()
        idlist = ""
        for pp in poems:
            idlist = idlist + pp['id'] + ","
        if idlist is not None:
            print(idlist)
            return HttpResponse(idlist)
        else:
            return HttpResponse("not found")
    else:
        return HttpResponse("not success")


def button(request):
    return render(request, 'home.html')


def output(request):
    data = requests.get("https://www.google.com/")
    print(data.text)
    data = data.text
    return render(request, 'home.html', {'data': data})


def newexternal(request):
    """
    this one returns the json representation of the tags
    """
    if request.method == 'POST':
        print("getting here")
        t = Tag()
        json_tags = t.getAllTagsbyjson()
        if json_tags is not None:
            print("sending")
            return HttpResponse(json_tags)  # Sending an success response
        else:
            return HttpResponse("not found")
    else:
        return HttpResponse("not success")


def external(request):
    inp = request.POST.get('param')
    bot = ALmaanyBot()
    out = bot.search(inp)
    return render(request, 'home.html', {'data1': out})


def termTree(request):
    if request.method == 'GET':
        t = Tag()
        json_tags = t.getAllTagsbyjson()
        json_tags = {'tree': json_tags}
        if json_tags is not None:
            return JsonResponse(json_tags)  # Sending an success response
        else:
            return HttpResponse("not found")
    else:
        return HttpResponse("not success")


def save_term_tags(request):
    if request.method == 'GET':
        data = request.GET
        term = data.get('term')
        # remove term tashkeel and white space
        term = araby.strip_tashkeel(term).strip()
        term = stemmer.stem(term)
        tag = data.get('tag')
        poem_id = data.get('id')
        t = Tagging()
        mutex.acquire()
        try:
            suc = t.tagWord(term, tag, poem_id, int(data.get('place')), int(data.get('row')), int(data.get('position')))
        finally:
            mutex.release()

        if suc:
            return HttpResponse("Success")  # Sending an success response
        else:
            return HttpResponse("not found")
    else:
        return HttpResponse("not success")


def suggest_tags(request):
    if request.method == 'GET':
        data = request.GET
        term = data.get('term')
        # remove term tashkeel and white space
        term = araby.strip_tashkeel(term).strip()
        term = stemmer.stem(term)
        t = Tagging()
        mutex.acquire()
        try:
            suggestions = t.searchTagsOfWord(term)
        finally:
            mutex.release()
        if suggestions is not None:
            return JsonResponse(suggestions)
        else:
            return HttpResponse("not found")


def get_children(request):
    if request.method == 'GET':
        data = request.GET
        term = data.get('term')
        t = Tag()
        children = t.getChildrens(term)
        if children is not None:
            return JsonResponse(children)
        else:
            return HttpResponse("not found")


def get_parent(request):
    if request.method == 'GET':
        data = request.GET
        term = data.get('term')
        t = Tag()
        parent = t.getParent(term)
        if parent is not None:
            return JsonResponse(parent)
        else:
            return HttpResponse("not found")


def get_roots(request):
    if request.method == 'GET':
        data = request.GET
        t = Tag()
        roots = t.getAllheads()
        if roots is not None:
            return JsonResponse(roots)
        else:
            return HttpResponse("not found")


def add_root(request):
    if request.method == 'GET':
        data = request.GET
        term = data.get('term')
        t = Tag()
        bool = t.addTag(term)
        if bool is not None:
            return JsonResponse(bool)
        else:
            return HttpResponse("not found")


def add_tag(request):
    if request.method == 'GET':
        data = request.GET
        term = data.get('term')
        parent = data.get('parent')
        t = Tag()
        bool = t.addTag(term, parent)
        if bool is not None:
            return JsonResponse(bool)
        else:
            return HttpResponse("not found")


def get_brothers(request):
    if request.method == 'GET':
        data = request.GET
        term = data.get('term')
        parent = data.get('parent')
        t = Tag()
        brothers = t.getBrothers(term, parent)
        if brothers is not None:
            return JsonResponse(brothers)
        else:
            return HttpResponse("not found")


def get_depth(request):
    if request.method == 'GET':
        data = request.GET
        term = data.get('term')
        t = Tag()
        depth = t.findDepth(term)
        if depth is not None:
            return JsonResponse(depth)
        else:
            return HttpResponse("not found")


def remove_tag(request):
    if request.method == 'GET':
        data = request.GET
        term = data.get('term')
        t = Tag()
        flag = t.removeTag(term)
        if flag is not None:
            return JsonResponse(flag)
        else:
            return HttpResponse("not found")


def add_parent(request):
    if request.method == 'GET':
        data = request.GET
        term = data.get('term')
        parent = data.get('parent')
        t = Tag()
        flag = t.newParent(term, parent)
        if flag is not None:
            return JsonResponse(flag)
        else:
            return HttpResponse("not found")


def edit_tag(request):
    if request.method == 'GET':
        data = request.GET
        term = data.get('term')
        edit = data.get('edit')
        t = Tag()
        flag = t.editTag(term, edit)
        if flag is not None:
            return JsonResponse(flag)
        else:
            return HttpResponse("not found")


def change_parent(request):
    if request.method == 'GET':
        data = request.GET
        term = data.get('term')
        parent = data.get('parent')
        t = Tag()
        flag = t.changeParent(term, parent)
        if flag is not None:
            return JsonResponse(flag)
        else:
            return HttpResponse("not found")


def delete_all(request):
    if request.method == 'GET':
        data = request.GET
        term = data.get('term')
        t = Tag()
        flag = t.deleteAllChildrens(term)
        if flag is not None:
            return JsonResponse(flag)
        else:
            return HttpResponse("not found")


def get_all_tags(request):
    if request.method == 'GET':
        t = Tag()
        tags = t.getAllTags()
        if tags is not None:
            return JsonResponse(tags)
        else:
            return HttpResponse("not found")


def get_all_poems(request):
    """
    Given a GET request returns all poems from database.

    :param request:
    :return: JSON response with all poem ids, poets id and names looks like:
    {"poems": [{"id": 2, "name": name}, {}....]
    """
    if request.method == 'GET':
        c = Connector()
        poems = c.get_poems()
        if tags is not None:
            return JsonResponse({
                "poems": poems})
        else:
            return HttpResponse("not found")


def get_all_poets(request):
    """
    Given a GET request returns all poets from database.

    :param request:
    :return: JSON response with all poet ids and names looks like:
    {"poet": [{"id": 2, "name": name}, {}....]
    """
    if request.method == 'GET':
        c = Connector()
        poets = c.get_poets()
        if tags is not None:
            return JsonResponse({
                'poets': poets})
        else:
            return HttpResponse("not found")


def get_terms_freq(request):
    if request.method == 'GET':
        req = request.GET
        if req.get('p') == "all periods":
            reslut = finders.find('images/Analysis/TermFreq.json')
        else:
            reslut = finders.find('images/Analysis/TermFreqperPeriod.json')
        f = open(reslut)
        json_string = f.read()
        f.close()

        # Convert json string to python object
        data = json.loads(json_string)
        if int(req.get('n')) == 1:
            x = int(req.get('f'))
            if req.get('p') == "all periods":
                d = data[:x]
                max = x
            else:
                period = req.get('p').strip()
                if len(data[period]) < x:
                    d = data[period][:len(data[period])]
                    max = len(data[period])
                else:
                    d = data[period][:x]
                    max = x
            return JsonResponse({"t": d, "m": max})
        else:
            y = req.get('f').strip().split("-")
            if req.get('p') == "all periods":
                d = data[int(y[0]):int(y[1])]
                max = int(y[1])
            else:
                period = req.get('p').strip()
                length = len(data[period])
                if int(y[1]) > length:
                    d = data[period][int(y[0]):length]
                    max = length
                else:
                    d = data[period][int(y[0]):int(y[1])]
                    max = int(y[1])
            return JsonResponse({"t": d, "m": max})


def maxFrequencyinPeriod(request):
    if request.method == 'GET':
        req = request.GET
        period = req.get('p').strip()
        if period == "all periods":
            return JsonResponse({"max": 1000})
        else:
            reslut = finders.find('images/Analysis/TermFreqperPeriod.json')
            f = open(reslut)
            json_string = f.read()
            f.close()
            data = json.loads(json_string)
            return JsonResponse({"max": len(data[period])})


def getTaggedWords(request):
    if request.method == 'GET':
        req = request.GET
        id = req.get('id')
        c = Connector()
        poem = (c.get_poem(id))[0]
        l = " "
        dictenory = {}
        for j in poem["context"]:
            s = ""
            if 'sadr' in j:
                for word in j['sadr'].split():
                    temp = stemmer.stem(araby.strip_tashkeel(word))
                    if temp in dictenory:
                        if word not in dictenory[temp]:
                            dictenory[temp].append(word)
                    else:
                        dictenory[temp] = [word]
                    s += temp + " "
                # s += stemmer.stem(araby.strip_tashkeel(j['sadr'])) + " "
            if 'ajuz' in j:
                for word in j['ajuz'].split():
                    temp = stemmer.stem(araby.strip_tashkeel(word))
                    if temp in dictenory:
                        if word not in dictenory[temp]:
                            dictenory[temp].append(word)
                    else:
                        dictenory[temp] = [word]
                    s += temp + " "
            l += s
        tokens = re.findall(r"[\w']+", l)
        w = Tagging()
        currentTagged = w.get_tagged_words_from_poem(tokens)
        l = []
        for key, value in dictenory.items():
            if key in currentTagged:
                l += dictenory[key]
        return JsonResponse({"word": l})


mutex = Lock()
