from django.db import models

class Customer(models.Model):
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=15)
    pickup_location = models.CharField(max_length=100)
    drop_off_location = models.CharField(max_length=100)
    time_of_pickup = models.DateTimeField()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
