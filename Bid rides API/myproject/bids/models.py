from django.db import models

class Bid(models.Model):
    STATUS_CHOICES = [
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('none', 'None')
    ]
    c_Id = models.IntegerField()
    c_phone_number = models.CharField(max_length=20)
    v_id = models.IntegerField()
    bid_value = models.DecimalField(max_digits=10, decimal_places=2)
    v_phone_number = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='none')


    def __str__(self):
        return f"Bid ID: {self.id}"
