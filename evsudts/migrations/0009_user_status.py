# Generated by Django 3.1.1 on 2021-10-27 10:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('evsudts', '0008_user_department'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='status',
            field=models.CharField(default=2, max_length=255),
            preserve_default=False,
        ),
    ]