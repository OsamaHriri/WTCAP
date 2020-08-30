from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [

    # if you change the name here make sure to change it in the navbar in base.html
    path('', views.index, name='index'),
    path('main_tag_page/', views.main_tag_page, name='main_tag_page'),
    path('tags/', views.tags, name='tags'),
    path('process_lines/', views.process_lines, name='process_lines'),
    path('select_poet_page/', views.select_poet_page, name='select_poet_page'),
    path('label/', views.button, name='label'),
    path('output/', views.output, name="script"),
    path('external/', views.external, name="script1"),
    path('newexternal/', views.newexternal, name="script3"),
    path('poet_poems/', views.poet_poems, name="poet_poems"),
    path('external2/', views.external2, name="script2"),
    path('termTree/', views.termTree, name="termTree"),
    path('save_term_tags/', views.save_term_tags, name='save_term_tags'),
    path('suggest_tags/', views.suggest_tags, name='suggest_tags'),
    path('get_children/', views.get_children, name='get_children'),
    path('get_parent/', views.get_parent, name='get_parent'),
    path('get_roots/', views.get_roots, name='get_roots'),
]
