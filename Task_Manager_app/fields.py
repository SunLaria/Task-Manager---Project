from django import forms
from django.utils.safestring import mark_safe



class ListTextWidget(forms.TextInput):
    def __init__(self, data_list, name, *args, **kwargs):
        super(ListTextWidget, self).__init__(*args, **kwargs)
        self._name = name
        self.list = data_list
        self.attrs.update({'list':f'list__{self._name}'})

    def render(self, name, value, attrs=None, renderer=None):
        text_html = super(ListTextWidget, self).render(name, value, attrs=attrs)
        data_list = f'<datalist id="list__{self._name}">'
        for item in self.list:
            data_list += f'<option value="{item["Name"]}">{item["Name"]}</option>'
        data_list += '</datalist>'

        return mark_safe(text_html + data_list)