from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required
from .forms import LoginForm,TaskModelForm,RegisterForm

@login_required(login_url="/login")
def home(request):
    return render(request,"Task_Manager_app/index.html",{"form":TaskModelForm(user_id=request.user.id)})


def login_view(request):
    if request.method=="GET":
        return render(request,"Task_Manager_app/login.html",context={"form":LoginForm()})
    if request.method=="POST":
        login_form = LoginForm(request.POST)
        if login_form.is_valid():
            user = authenticate(request, username=login_form.cleaned_data["Username"], password=login_form.cleaned_data["Password"])
            if user:
                login(request,user)
                return redirect("home")
        messages.error(request, 'Login Failed')
        return redirect("login")

def logout_view(request):
    logout(request)
    return redirect("login")

def register_view(request):
    if request.method == 'GET':
        form = RegisterForm()
        return render(request, 'Task_Manager_app/register.html', { 'form': form})  
    if request.method == 'POST':
        form = RegisterForm(request.POST) 
        if form.is_valid():
            user = form.save(commit=False)
            user.username = user.username.lower()
            user.save()
            messages.success(request, 'You have singed up successfully')
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Error Creating Account, Try again')
            return redirect("register")
    else:
        return redirect("register")