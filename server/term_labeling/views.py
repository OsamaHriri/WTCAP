from django.shortcuts import render
from server.term_labeling.scripts import ALmaanyBot
from server.term_labeling.scripts import Graph
import requests

# Create your views here.

# create dummy data of line and context

poem = [
    {
        'index': '1',
        'content': {
            'first': 'لَوَتْ بِالسَّلامِ بَنَانًا خَضيبا',
            'second': 'وَلَحْظًا يشوقُ الفؤادَ الطَّرُوبا'
        }
    },
    {
        'index': '2',
        'content': {
            'first': 'َزَارَتْ على عَجَلٍ فاكْتَسى',
            'second': 'لِزَوْرَتِها ((أَبْرَقُ الحَزْنِ)) طيبا'
        }
    },
    {
        'index': '3',
        'content': {
            'first': 'فكانَ العبيرُ بها وَاشِيًا',
            'second': 'وَجَرْسُ الحُلِيِّ عليها رَقيبا'
        }
    },
    {
        'index': '4',
        'content': {
            'first': 'وَلَمْ أَنْسَ لَيْلَتَنَا في العِنَا',
            'second': 'وقِ لَفَّ الصَّبَا بِقَضيبٍ قَضيبا '
        }
    }, {
        'index': '5',
        'content': {
            'first': 'سُكُوتٌ يَحرُّ عليهِ الهوى',
            'second': 'وشكوى تَهِيجُ البُكا والنَّحيبا'
        }
    },
    {
        'index': '6',
        'content': {
            'first': 'َمَا افْتَنَّتِ الرّيحُ فِي مَرِّها',
            'second': 'فَطَوْرًا خُفُوتًا، وَطَوْرًا هُبُوبا'
        }
    },
    {
        'index': '7',
        'content': {
            'first': 'عَنَتْ كَبِدي قَسْوةٌ منكِ ما',
            'second': 'تَزالُ تُجدِّدُ فيها نُدُوبا'
        }
    },
    {
        'index': '8',
        'content': {
            'first': 'وَحُمِّلْتُ عِنْدَكِ ذَنْبَ المَشي',
            'second': 'بِ، حَتّى كَأَنّي ابْتَدَعْتُ المَشِيبا'
        }
    },
    {
        'index': '9',
        'content': {
            'first': ' وَمَنْ يَطَّلِعْ شَرَفَ الأَرْبَعِي ',
            'second': 'ن يُحَيِّ مِنَ الشَّيْبِ زَوْرًا غريبا'
        }
    },
    {
        'index': '10',
        'content': {
            'first': ' بَلَوْنا ضَرَائبَ مَنْ قَدْ نَرى',
            'second': 'فَما إِنْ رَأَيْنا لِ((فَتْحٍ)) ضَرِيبا'
        }
    },
    {
        'index': '11',
        'content': {
            'first': 'هُوَ المَرْءُ أَبْدَتْ لَهُ الحَادِثا ',
            'second': ' تُ عَزْمًا وَشِيكًا وَرَأْيًا صَلِيبا '
        }
    },
    {
        'index': '12',
        'content': {
            'first': 'تَنَقَّل في خُلُقَى سُؤْدُدٍ:',
            'second': ' سَمَاحًا مَرُجًّى، وَبَأْسًا مَهِيبا '
        }
    },
]


def index(request):
    context = {
        'poems': poem
    }
    return render(request, 'index.html', context)


def process_lines(request):
    selected = []
    if request.method == 'POST':
        chosen_lines = list(request.POST.values())
        for value in poem.__iter__():
            if value.__getitem__('index') in chosen_lines:
                print('this index exists')
                selected.append(value)
                print(selected)
    context = {
        'selected': selected
    }
    return render(request, 'process_lines.html', context)


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
    inp = request.POST.get('param')
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
        return render(request, 'home.html', {'data1': p})
    return render(request, 'home.html', {'data1': 'not found'})
