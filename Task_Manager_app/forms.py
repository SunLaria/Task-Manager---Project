from django import forms	


class LoginForm(forms.Form):
    Username=forms.CharField(max_length=20)
    Password=forms.CharField(widget=forms.PasswordInput())