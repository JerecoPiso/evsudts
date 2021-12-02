from django.db import models
import qrcode
from io import BytesIO
from django.core.files import File
from PIL import Image, ImageDraw
from django.contrib.auth.hashers import make_password, check_password
import os
from pathlib import Path

class User(models.Model):
    username = models.CharField(max_length=255, blank=False)
    password = models.CharField(max_length=500, blank=False)
    hint = models.CharField(max_length=500, blank=False)
    photo = models.ImageField(upload_to='media/', blank=True)
    role = models.CharField(max_length=255, blank=True)
    department = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=255, blank=True)
    changepass = models.BooleanField()

    def __str__(self):
        return self.username + ' ' + self.password + ' ' + self.hint + ' ' + self.photo + ' ' + self.folder_name + " " + self.role + " " + self.department + " " + self.status + " " + self.changepass
    
class Documents(models.Model):
        document = models.FileField(upload_to="media/")
        uploader_id = models.IntegerField()
        uploaded_at = models.CharField(max_length=100)
        updated_at = models.CharField(max_length=100)
        type = models.CharField(max_length=100)
        desc = models.TextField()
        status = models.CharField(max_length=255)
        department = models.CharField(max_length=255)
        qr_code = models.ImageField(upload_to='qrcodes/')
        trace_id = models.BigIntegerField()
        last_status = models.CharField(max_length=255)


        def __str__(self):
            return self.document + ' ' + self.uploader_id + ' ' + self.uploaded_at + ' ' + self.updated_at + ' ' + self.type + ' ' + self.desc + ' ' + self.status + ' ' + self.department + ' ' + self.last_status
            
        def delete(self,*args,**kwargs):
            self.document.delete()
            super().delete(*args,**kwargs)


class Department(models.Model):
        department = models.CharField(max_length=255)

        def __str__(self):
            return self.department

class SharedFile(models.Model):
        file_id = models.IntegerField()
        docname = models.CharField(max_length=255, blank=False)
        traceid = models.BigIntegerField()
        status = models.CharField(max_length=50, blank=False)
        received_on = models.CharField(max_length=50)
        receiver_id = models.IntegerField()
        receiver_name = models.CharField(max_length=100)
        send_on = models.CharField(max_length=50)
        sender = models.CharField(max_length=255)
        sender_id = models.IntegerField()
        type = models.CharField(max_length=100)
        department = models.CharField(max_length=255)
        doc_status = models.CharField(max_length=255)
        comment = models.TextField()
        ownqr_code = models.ImageField(upload_to='qrcodes/',)

class RecentActivities(models.Model):
        notification = models.TextField()
        notified_id = models.IntegerField()
        date = models.CharField(max_length=100)
    

class Notification(models.Model):
        notification = models.TextField()
        notified_id = models.IntegerField()
        date = models.CharField(max_length=100)
        tracenumber = models.IntegerField(default=0)
      

class DocType(models.Model):
        type = models.CharField(max_length=255, blank=False)

        def __str__(self):
            return self.type

       




