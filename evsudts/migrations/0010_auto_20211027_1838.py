# Generated by Django 3.1.1 on 2021-10-27 10:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('evsudts', '0009_user_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='status',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
