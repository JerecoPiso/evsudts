# Generated by Django 3.1.1 on 2021-10-28 09:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('evsudts', '0014_remove_user_changepass'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='photo',
            field=models.ImageField(blank=True, upload_to='media/'),
        ),
    ]
