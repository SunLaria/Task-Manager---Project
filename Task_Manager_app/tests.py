from django.test import TestCase
from .models import Tag, Task, Category
from django.contrib.auth.models import User
import datetime

# class TaskTestCase(TestCase):
#     def setUp(Self):
#         Task.objects.create(
#             Name="Walking the Dog",
#             Date=datetime.date.today(),
#             Category="Home",
#             Tags="no-priority",
#             Description="A Description",
#             User=User.object.all()[0]
#         )



    # def test_animals_can_speak(self):
    #     """Animals that can speak are correctly identified"""
    #     lion = Animal.objects.get(name="lion")
    #     cat = Animal.objects.get(name="cat")
    #     self.assertEqual(lion.speak(), 'The lion says "roar"')
    #     self.assertEqual(cat.speak(), 'The cat says "meow"')

