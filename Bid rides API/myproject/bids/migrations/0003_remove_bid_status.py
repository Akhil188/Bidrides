# Generated by Django 3.2.5 on 2023-05-26 01:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bids', '0002_bid_status'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='bid',
            name='status',
        ),
    ]
