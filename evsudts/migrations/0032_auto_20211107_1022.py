# Generated by Django 3.1.1 on 2021-11-07 02:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('evsudts', '0031_notification_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notification',
            name='type',
        ),
        migrations.AddField(
            model_name='notification',
            name='trace_id',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]