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
from nltk.stem.isri import ISRIStemmer
from farasa.stemmer import FarasaStemmer


# Create your views here.


poem_id = ''
stemmer = FarasaStemmer(interactive=True)

def main_tag_page(request):
    t = Tag()
    all_tags = t.getAllTags()["tags"]
    c = Connector()
    if request.method == 'GET':
        id = request.GET['poem_iid']
    else:
        id = 2066

    global poem_id
    poem_id = id
    poem = c.get_poem(id)[0]

    context = {
        'poems': poem,
        'title': 'Home',
        'all_tags': all_tags
    }
    return render(request, 'main_tag_page.html', context)


def index(request):

    t = Tag()

    all_tags = t.getAllTags()
    c = Connector()
    if request.method == 'POST':
        id = request.POST['poem_iid']
    else:
        id = 2066
    poem = (c.get_poem(id))[0]

    context = {
        'poems': poem,
        'title': 'Home',

        'all_tags': all_tags
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
def select_poet_page(request):
    c = Connector()
    poets = c.get_poets()
    poems = c.get_poems()
    context = {
        'poets': poets,
        'poems': poems,
        'title': 'Selection'
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
        poems = c.get_poems_by_poet(poetId)
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


def all_poems(request):
    """
    not sure if you need this one
    try using the poem list you already rendered with the page
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
        return HttpResponse("not success")


def save_term_tags(request):
    if request.method == 'GET':
        data = request.GET
        term = data.get('term')
        # remove term tashkeel and white space
        term = araby.strip_tashkeel(term).strip()
        term = stemmer.stem(term)
        tag = data.get('tag')
        t = Tagging()
        mutex.acquire()
        print(poem_id)
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

def get_poemid(request):
    if request.method == 'GET':
        print(poem_id)
        if poem_id is not None:
            return JsonResponse({"id":poem_id})
        else:
            return HttpResponse("not found")


mutex = Lock()
