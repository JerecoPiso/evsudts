# Generated by Django 3.1.1 on 2021-11-08 11:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('evsudts', '0037_notification_tracenumber'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='tracenumber',
            field=models.IntegerField(blank=True),
        ),
    ]