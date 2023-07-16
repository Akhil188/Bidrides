from django.db import models

class Vendor(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=15)
    driving_license_number = models.CharField(max_length=20)
    location = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
