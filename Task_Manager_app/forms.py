from django import forms	
from django.forms import ModelForm
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
		
		
