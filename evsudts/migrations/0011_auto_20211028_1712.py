# Generated by Django 3.1.1 on 2021-10-28 09:12

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('evsudts', '0010_auto_20211027_1838'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='changepass',
            field=models.BooleanField(blank=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='user',
            name='photo',
            field=models.ImageField(upload_to='media/'),
        ),
    ]
