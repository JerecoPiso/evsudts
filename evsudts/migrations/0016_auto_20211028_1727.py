# Generated by Django 3.1.1 on 2021-10-28 09:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('evsudts', '0015_auto_20211028_1721'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='changepass',
            field=models.BooleanField(blank=True, default=True),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='user',
            name='photo',
            field=models.ImageField(upload_to='media/'),
        ),
    ]
