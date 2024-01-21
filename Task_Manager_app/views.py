from django.shortcuts import render
from django.http import HttpResponse

def request_name(request):
    return HttpResponse("Hello world!")	

