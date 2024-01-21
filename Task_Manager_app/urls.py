from django.urls import path
from . import views

urlpatterns = [
    path('url_name/', views.request_name, name='url_name'),
]

