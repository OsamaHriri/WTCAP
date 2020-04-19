from django.urls import path
from . import views
urlpatterns = [
    path('', views.home, name='labeling-home'),
    path('process/', views.process, name='labeling-home'),

]
