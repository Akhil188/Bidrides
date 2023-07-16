# Generated by Django 3.2.5 on 2023-05-26 02:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bids', '0004_bid_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bid',
            name='status',
            field=models.CharField(choices=[('accepted', 'Accepted'), ('rejected', 'Rejected'), ('none', 'None')], default='none', max_length=20),
        ),
    ]