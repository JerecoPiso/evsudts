# Generated by Django 3.1.1 on 2021-10-28 09:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('evsudts', '0013_auto_20211028_1717'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='changepass',
        ),
    ]