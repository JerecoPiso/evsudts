# Generated by Django 3.1.1 on 2021-09-18 12:38

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Admin',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=255)),
                ('password', models.CharField(max_length=500)),
                ('hint', models.CharField(max_length=500)),
                ('photo', models.FileField(blank=True, upload_to='media/')),
            ],
        ),
    ]
