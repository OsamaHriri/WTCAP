from django.contrib import admin
from django.urls import path , include
from . import views
urlpatterns = [

    # if you change the name here make sure to change it in the navbar in base.html
    path('', views.index, name='index'),
    path('label/', views.button, name='label'),
    path('output/', views.output, name="script"),
    path('external/', views.external, name="script1"),
    path('external2/', views.external2, name="script2"),
]


