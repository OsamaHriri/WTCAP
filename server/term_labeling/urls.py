from django.contrib import admin
from django.urls import path , include
from . import views
urlpatterns = [

    path('', views.button),
    path('output/', views.output,name="script"),
    path('external/', views.external,name="script1"),
    path('external2/', views.external2,name="script2"),
]


