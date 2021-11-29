from django import http
from django.contrib.messages.api import success
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.hashers import  check_password
from evsudts.models import User, Department
from django.contrib import messages
from django.db.models import Q
import os, shutil
from pathlib import Path
import cv2
from pyzbar.pyzbar import decode
from django.contrib.auth.hashers import make_password, check_password
from evsudts.models import Documents, SharedFile


def searchDocumentUsingTrace(request):
    docname = ''
    traceid = ''
    holder = ''
    status = ''
    type = ''
    department = ''
    retmsg = ''
    uploaded = ''
    qr = ''
    if Documents.objects.filter(trace_id=request.POST['traceid']).count() > 0:
        doc = Documents.objects.get(trace_id=request.POST['traceid'])
        docname = doc.document.name
        traceid = doc.trace_id
        if User.objects.filter(id=doc.uploader_id).count() > 0:
            user = User.objects.get(id=doc.uploader_id)
            holder = user.username
        else:
            holder = 'Unknown'
        status = doc.status
        type = doc.type
        department = doc.department
        uploaded = doc.uploaded_at
        qr = doc.qr_code.name
        

    else:
        if SharedFile.objects.filter(traceid=request.POST['traceid']).count() > 0:
            doc = SharedFile.objects.get(traceid=request.POST['traceid'])
            docname = doc.docname
            traceid = doc.traceid
            status = doc.status
            type = doc.type
            department = doc.department
            holder = doc.receiver_name
            uploaded = doc.send_on
            qr = doc.ownqr_code.name
        else:
            retmsg = "None"
    return JsonResponse({'qr': qr,'retmsg': retmsg, 'docname': docname, 'holder': holder, 'traceid': traceid, 'status': status, 'type': type, 'department': department, 'uploaded': uploaded})
    
def index(request):
    # dept = Department(department="Engineering Department")
    # dept.save()
    request.session['title'] = 'Login'
    if request.session.get("user_loggin"):
        if request.session.get("user_role") == "User":
        
            return redirect("/user/")
        else:
            return redirect("/administrator/")
        

    else:
        # pat = os.path.join(os.path.abspath(os.path.join(os.getcwd()+"//media//"+'asdasd')))
        # os.makedirs(pat)
        # print(os.getcwd())
        # return redirect("/")
        # shutil.move(os.path.join(os.path.abspath(os.path.join(os.getcwd()+"//media//qrcodes//logo.png"))),pat)

        return render(request, 'html/index.html')

def signup(request):
    request.session['title'] = 'Signup'
    if request.session.get("user_loggin"):
        return redirect("/user/")
    else:

        return render(request, 'html/signup.html')

def login(request):
    responseMsg = ''
    if request.method == 'POST':
        if request.POST['username'] != '' and request.POST['password'] != '':
            
            if User.objects.filter(username__exact=request.POST['username']).count() > 0:
                user = User.objects.get(username__exact=request.POST['username'])
                if check_password(request.POST['password'], user.password):
                    if user.role == request.POST['role']:
                          request.session['username'] = request.POST['username']
                          request.session['user_loggin'] = True
                          request.session['id'] = user.id
                          request.session['user_role'] = user.role
                          responseMsg = True

                    else:
                        if user.role == "User":
                             responseMsg = "Can't login as a "+request.POST['role']+"! Your account has an "+ user.role +" role only."
                        else:
                             responseMsg = "Can't login as a "+request.POST['role']+" because your account has a role as an "+ user.role +"."
                        
                else:
                    responseMsg = "Incorrect password!"
            
            else:

                responseMsg = "Username doesn't exist!"


        else:
            responseMsg = 'All fields must be filled up!'

    else:
        responseMsg = "Something went wrong!"
    # if responseMsg == "Login":       
    #     messages.warning(request, responseMsg)
    #     return redirect("/user/")
    # else:         
    #     messages.warning(request, responseMsg)
    #     return redirect("/")

    return HttpResponse(responseMsg)

def register(request):
    responseMsg = ''
    if request.method == 'POST':
        if request.POST['username'] != '' and request.POST['password'] != '' and request.POST['hint'] != '':
            if all(string.isspace() or string.isalpha() for string in request.POST['username']):
                    if User.objects.filter(username__iexact=request.POST['username']).exists():
                        responseMsg = 'Username already exist!'
                    else:
                        hash_pwd = make_password(request.POST['password'], salt=None, hasher='default')
                        user = User(username=request.POST['username'], password=hash_pwd, hint=request.POST['hint'], role=request.POST['role'], department=request.POST['dept'], changepass=False, photo="user.jpg")
                        user.save()
                        responseMsg = 'Success'
                    
            else:
                responseMsg = 'Username must contain letters only!'
        else:
            responseMsg = 'All fields must be filled up!'
    else:
        responseMsg = 'Something went wrong!'
    
    
    data = {
        "responseMsg": responseMsg,
        # "qrcodename": request.POST['username'] + '.png'
       
    }

    return JsonResponse(data)
    # return HttpResponse(responseMsg)

def checkUsername(request):
    responseMsg = ''
    username = request.POST['username']
    if request.method == "POST":
        
        if username != '':
            if all(string.isalpha() or string.isspace() for string in username):
                if User.objects.filter(username__exact=username).exists():
                
                     responseMsg = True

                else:
                     responseMsg = "Username doesn't exist!"
                   

            else:
                responseMsg = 'Username must be letters and whitespaces only!'
        else:
            responseMsg = "Username must not be empty!"

    else:
        responseMsg = "Something went wrong!"

    return HttpResponse(responseMsg)

def checkAccount(request):
    retmsg = ""
    if request.method == "POST":
        if request.POST['username'] and request.POST['hint'] != "":
            if User.objects.filter(Q(username__exact=request.POST['username']) & Q(hint__exact=request.POST['hint'])).exists():
                retmsg = "Success"

            else:
                retmsg = "No account matched with the username and hint!"
        else:
            retmsg = "All field must be filled up!"
    else:
        retmsg = "Something went wrong!"

    return HttpResponse(retmsg)

def changePass(request):
    retmsg = ''
    if request.method == "POST":
        if request.POST['username'] and request.POST['hint'] != "":
            if request.POST['password'] and request.POST['pass2'] != "":
                if User.objects.filter(Q(username__exact=request.POST['username']) & Q(hint__exact=request.POST['hint'])).exists():
                     if request.POST['password'] == request.POST['pass2']:
                         user = User.objects.get(Q(username__exact=request.POST['username']) & Q(hint__exact=request.POST['hint']))
                         hash_pwd = make_password(request.POST['password'], salt=None, hasher='default')
                         user.password = hash_pwd
                         user.save()
                         retmsg = "Success"
                     else:
                         retmsg = "Password didn't matched!"

                else:
                     retmsg = "No account matched with the username and hint!"  
            else:
                retmsg = "All field must be filled up!"
        else:
            retmsg = "Username or Hint is missing. Please try again!"
    else:
        retmsg = "Something went wrong!"
    return HttpResponse(retmsg)

def error(request):
    request.session.set_expiry(9000)
    return render(request, 'html/error.html')