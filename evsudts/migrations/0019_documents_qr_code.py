# Generated by Django 3.1.1 on 2021-10-28 11:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('evsudts', '0018_auto_20211028_1906'),
    ]

    operations = [
        migrations.AddField(
            model_name='documents',
            name='qr_code',
            field=models.ImageField(blank=True, upload_to='qrcodes/'),
        ),
    ]
