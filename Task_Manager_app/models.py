from django.db import models
from django.contrib.auth.models import User
from django.conf import settings



class Category(models.Model):
    User = models.ForeignKey(User, on_delete=models.CASCADE)
    Name = models.CharField(max_length=100)

    def __str__(self) -> str:
        return f"{self.Name}"

TAGS_CHOICES = (
    ("high-priority", "High Priority"),
    ("medium-priority", "Medium Priority"),
    ("low-priority", "Low Priority"),
    ("no-priority", "No Priority"),
)


class Task(models.Model):
    Name = models.CharField(max_length=100)
    Date = models.DateField()
    Category = models.ForeignKey(Category,on_delete=models.CASCADE)
    Tag = models.CharField(max_length=16,choices=TAGS_CHOICES, default="no-priority")
    Description = models.TextField(blank=True)
    Created_at = models.DateField(auto_now_add=True)
    Updated_at = models.DateField(auto_now=True)
    User = models.ForeignKey(User, on_delete=models.CASCADE)

    def to_dict(self):
        return {
                "id":self.id,
                "Name":self.Name,
                "Date":self.Date,
                "Category":self.Category.Name,
                "Tag":self.Tag,
                "Description":self.Description,
                "Created_at":self.Created_at,
                "Updated_at":self.Updated_at,
                "User":self.User.id}
    


