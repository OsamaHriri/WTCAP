from django.contrib import admin
from django.urls import path, include,re_path
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
    re_path('termTree/$', views.termTree, name="termTree"),
    re_path('save_term_tags/$', views.save_term_tags, name='save_term_tags'),
    re_path('suggest_tags/$', views.suggest_tags, name='suggest_tags'),
    re_path('get_children/$', views.get_children, name='get_children'),
    re_path('get_parent/$', views.get_parent, name='get_parent'),
    re_path('get_roots/$', views.get_roots, name='get_roots'),
    re_path('add_root/$', views.add_root, name='add_root'),
    re_path('add_tag/$', views.add_tag, name='add_tag'),
    re_path('get_brothers/$', views.get_brothers, name='get_brothers'),
    re_path('get_depth/$', views.get_depth, name='get_depth'),
    re_path('remove_tag/$', views.remove_tag, name='remove_tag'),
]
