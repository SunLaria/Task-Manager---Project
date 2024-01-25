from django import forms	
from django.forms import ModelForm
from django.contrib.auth.forms import UserCreationForm
from .models import Task, Category
from django.contrib.auth.models import User
from .fields import ListTextWidget


class LoginForm(forms.Form):
    Username=forms.CharField(max_length=20)
    Password=forms.CharField(widget=forms.PasswordInput())

     

class TaskModelForm(ModelForm):
	def __init__(self, *args,**kwargs):
		user_id = kwargs.get("user_id")
		kwargs.pop("user_id")
		category_list=User.objects.get(id=user_id).category_set.all().values('Name')
		super(TaskModelForm, self).__init__(*args, **kwargs)
		self.fields['Category'] = forms.CharField(required=True)
		self.fields['Category'].widget = ListTextWidget(data_list=category_list, name='category_list')
	class Meta():
		model = Task
		fields = ['Name','Date','Category','Tag','Description']
		widgets = {'Date': forms.DateTimeInput(attrs={'type': 'Date'})}
		


class RegisterForm(UserCreationForm):
	class Meta():
		model=User
		fields = ['username','email','password1','password2']
		widgets = {'username' : forms.TextInput(attrs={'minlength':"6",'maxlength':"30",'pattern':'[A-z]+'}),
                    'email': forms.EmailInput(attrs={'pattern':'[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$'}),
					'password1':forms.PasswordInput(attrs={'pattern':'[0-9a-fA-F]{4,8}','placeholder': 'Password'}),
					'password2':forms.PasswordInput(attrs={'pattern':'[0-9a-fA-F]{4,8}'})}
	

# not working
# Password Pattern = "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,16}$"