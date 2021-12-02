from django.http import HttpResponse, HttpResponseRedirect
from django.http.request import HttpRequest
from django.http.response import JsonResponse
from django.shortcuts import redirect, render
# import shutil
from django.conf import settings
import os, json, mimetypes, datetime
from pathlib import Path
from evsudts.models import Department, SharedFile, User, Documents, DocType, Notification, RecentActivities
from django.db.models import Q
# login page of the user

def getDateTime():
    hour = ""
    am_pm = ""
    if int(datetime.datetime.now().strftime("%H")) > 12:
       hour = int(datetime.datetime.now().strftime("%H")) - 12
       am_pm = " PM"
    else:
       hour = datetime.datetime.now().strftime("%H")
       am_pm = " AM"
    datenow =  datetime.datetime.now().strftime("%h") + "-" + datetime.datetime.now().strftime("%d") + "-"+ datetime.datetime.now().strftime("%Y") + " " + str(hour) + ":" + datetime.datetime.now().strftime("%M")+ ":" + datetime.datetime.now().strftime("%S") + "" + am_pm
   
    return datenow

def getFilename(str):

    return str[0:str.rfind("_")].upper()

def index(request):
    request.session['title'] = "Home"
    if request.session.get("user_loggin") == True and request.session.get("user_role") == "Admin":

        return render(request, 'html/admin/index.html')
    
    else:
        return redirect("/")


# logout
def logout(request):
    try:
        del request.session['user_loggin']
        del request.session['username']
        del request.session['id']
        del request.session['user_role']
    except:
        pass    

    return redirect("/")
    
def documents(request):
    request.session['title'] = "Documents"
    if request.session.get("user_loggin") == True and request.session.get("user_role") == "Admin":

        return render(request, 'html/admin/documents.html')
    
    else:
        return redirect("/")

def mydocuments(request):
    request.session['title'] = "My Documents"
    if request.session.get("user_loggin") == True and request.session.get("user_role") == "Admin":

        return render(request, 'html/admin/mydocuments.html')
    
    else:
        return redirect("/")

def users(request):
    request.session['title'] = "Users"
    if request.session.get("user_loggin") and request.session.get("user_role") == "Admin":

        return render(request, 'html/admin/users.html')
    
    else:
        return redirect("/")
    

def department(request):
    request.session['title'] = "Departments"
    if request.session.get("user_loggin") and request.session.get("user_role") == "Admin":

        return render(request, 'html/admin/departments.html')
    
    else:
        return redirect("/")

def settings(request):
    request.session['title'] = "Settings"
    if request.session.get("user_loggin") and request.session.get("user_role") == "Admin":

        return render(request, 'html/admin/settings.html')
    
    else:
        return redirect("/")

def recyclebin(request):
    request.session['title'] = "Recycle Bin"
    if request.session.get("user_loggin") == True and request.session.get("user_role") == "Admin":

        return render(request, 'html/admin/recyclebin.html')
    
    else:
        return redirect("/")

def doctype(request):
    request.session['title'] = "Doctype"
    if request.session.get("user_loggin") == True and request.session.get("user_role") == "Admin":

        return render(request, 'html/admin/doctype.html')
    
    else:
        return redirect("/")

def addDept(request):
    ret_msg = ''
    if request.method == "POST":
        if request.POST['dept'] != "":
            if Department.objects.filter(department__iexact=request.POST['dept']).count() == 0:
                dept = Department(department=request.POST['dept'])
                dept.save()
                notification = "You added a new department <strong>" + request.POST['dept'] +"</strong>"
                recent = RecentActivities(notification=notification, notified_id=request.session.get("id"), date=getDateTime())
                recent.save()
                ret_msg = "Success"
            else:
                ret_msg = "Department already exist!"


        else:
            ret_msg = "Department name should not be empty!"
    else:
        ret_msg = "Something went wrong!"
    
    return HttpResponse(ret_msg)

def addType(request):
    ret_msg = ''
    if request.method == "POST":
        if request.POST['type'] != "":
            if DocType.objects.filter(type__iexact=request.POST['type']).count() == 0:
                type = DocType(type=request.POST['type'])
                type.save()
                
                notification = "You added a new document type <strong>" + request.POST['type'] +"</strong>."
                recent = RecentActivities(notification=notification, notified_id=request.session.get("id"), date=getDateTime())
                recent.save()
                ret_msg = "Success"
            else:
                ret_msg = "Document type already exist!"


        else:
            ret_msg = "Document type name should not be empty!"
    else:
        ret_msg = "Something went wrong!"
    
    return HttpResponse(ret_msg)

def deleteDept(request):
    ret_msg = ""
    if request.method == "POST":
        if request.POST['id'] != "":
            
            try:
                   dept = Department.objects.get(id=request.POST['id'])
                   dept.delete()
                   ret_msg = "Success"
       
            except:
                   ret_msg = "Something went wrong!"
                  
        else:
            ret_msg = "Id is empty!"

    else:
        ret_msg = "Something went wrong!"
    

    return HttpResponse(ret_msg)

def deleteType(request):
    ret_msg = ""
    if request.method == "POST":
        if request.POST['id'] != "":
            
            try:
                   type = DocType.objects.get(id=request.POST['id'])
                   type.delete()
                   ret_msg = "Success"
       
            except:
                   ret_msg = "Something went wrong!"
                  
        else:
            ret_msg = "Id is empty!"

    else:
        ret_msg = "Something went wrong!"
    
    return HttpResponse(ret_msg)

def deleteUser(request):
    ret_msg = ""
    if request.method == "POST":
        if request.POST['id'] != "":
            
            try:
                   user = User.objects.get(id=request.POST['id'])
                   user.delete()
                   ret_msg = "Success"
       
            except:
                   ret_msg = "Something went wrong!"
                  
        else:
            ret_msg = "Id is empty!"

    else:
        ret_msg = "Something went wrong!"
    
    return HttpResponse(ret_msg)

def updateDept(request):
    ret_msg = ''

    if request.method == "POST":
        if request.POST['dept'] != "":
            
            dept = Department.objects.get(id=request.POST['id'])
            dept.department = request.POST['dept']
            dept.save()

            ret_msg = "Success"

        else:
            ret_msg = "Department name should not be empty!"
        
    else:
        ret_msg = "Something went wrong!"

    
    return HttpResponse(ret_msg)

def updateType(request):
    ret_msg = ''

    if request.method == "POST":
        if request.POST['type'] != "":
            
            type = DocType.objects.get(id=request.POST['id'])
            type.type = request.POST['type']
            type.save()

            ret_msg = "Success"

        else:
            ret_msg = "Document type  should not be empty!"
        
    else:
        ret_msg = "Something went wrong!"

    
    return HttpResponse(ret_msg)

def updateUser(request):
    retmsg = ''
    username = request.POST['username']
    hint = request.POST['hint']
    role = request.POST['role']
    dept = request.POST['dept']
    uid = request.POST['id']
    if uid != "":
        if username and hint and role and dept != "":
            if User.objects.filter(username__iexact=request.POST['username']).exists():
                user = User.objects.get(username=request.POST['username'])
                if user.username == request.POST['username']:
                        
                    retmsg = "No changes performed"
                else:

                    retmsg = 'Username already exist!'
            else:
                user = User.objects.get(id=uid)
                user.username = username
                user.hint = hint
                user.role = role
                user.department = dept
                user.save()
                retmsg = "Success"
        else:
            retmsg = "All fields must be filled up!"

    else:
        retmsg = "ID can't be empty!"
    
    return HttpResponse(retmsg)

def approvedDoc(request):
    retmsg = ""
    if request.method == "POST":
        if request.POST['id'] != "":
            doc = Documents.objects.get(id=request.POST['id'])
            doc.status = "Approved"
            doc.last_status = "Approved"
            notif_txt = "An admin has accepted your document <strong>" + getFilename(os.path.splitext(doc.document.name)[0] ) +'</strong>. <strong> <br> Trace #: '+ str(doc.trace_id)+"</strong>"
            notif = Notification(notification=notif_txt,notified_id=doc.uploader_id,date=getDateTime())
            notif.save()
            doc.save()
            retmsg = "Success"
        else:
            retmsg = "ID can't be empty!"
    else:
        retmsg = "Something went wrong!"

    return HttpResponse(retmsg)

def approvedAllPendingDocs(request):
    retmsg = ""
   
    try:
        doc = Documents.objects.filter(status="Pending")
        if doc.count() > 0:
            for d in doc:
                notif_txt = "An admin has accepted your document <strong>" + getFilename(os.path.splitext(d.document.name)[0] ) +'</strong>. <strong> <br> Trace #: '+ str(d.trace_id)+"</strong>"
                notif = Notification(notification=notif_txt,notified_id=d.uploader_id,date=getDateTime())
                notif.save()

            doc.update(status="Approved", last_status="Approved")
           
            retmsg = "Success"

        else:
            retmsg = "No pending documents found"
    
    except:
        retmsg = "Something went wrong!"
  
    return HttpResponse(retmsg)
   
def getDept(request):
    dept = Department.objects.all().order_by("-id").values()
    return JsonResponse(list(dept), safe=False)

def getDocTypes(request):
    doctype = DocType.objects.all().order_by("-id").values()
    return JsonResponse(list(doctype), safe=False)
    
def getType(request):
    type = DocType.objects.all().order_by("-id").values()
    return JsonResponse(list(type), safe=False)

def getUsers(request):
    users = User.objects.all().exclude(id=request.session.get("id")).order_by("-id").values()
    return JsonResponse(list(users), safe=False)

def getApprovedDocs(request):
    docs = Documents.objects.filter(status__iexact="Approved").exclude(status="Removed").order_by("-id").values()
    return JsonResponse(list(docs), safe=False)

def getSharedDocs(request):
    docs = SharedFile.objects.all().order_by("-id").values()
    return JsonResponse(list(docs), safe=False)
    
def getPendingDocs(request):
    docs = Documents.objects.filter(status__iexact="Pending").exclude(status="Removed").order_by("-id").values()
    return JsonResponse(list(docs), safe=False)


def searchApprovedDocs(request):
    search = request.POST['search']
    docs = Documents.objects.filter((Q(document__icontains=search) | Q(uploaded_at__icontains=search ) | Q(type__icontains=search ) | Q(desc__icontains=search ) | Q(status__icontains=search ) | Q(department__icontains=search ) | Q(trace_id__icontains=search )) ).exclude(status="Pending").exclude(status="Removed").order_by("-id").values()
    return JsonResponse(list(docs), safe=False)


def searchPendingDocs(request):
    search = request.POST['search']
    docs = Documents.objects.filter((Q(document__icontains=search) | Q(uploaded_at__icontains=search ) | Q(type__icontains=search ) | Q(desc__icontains=search ) | Q(status__icontains=search ) | Q(department__icontains=search ) | Q(trace_id__icontains=search )) ).exclude(status="Approved").exclude(status="Removed").order_by("-id").values()
    return JsonResponse(list(docs), safe=False)


def searchSharedDocs(request):
    search = request.POST['search']
    docs = SharedFile.objects.filter((Q(docname__icontains=search) | Q(traceid__icontains=search ) | Q(status__icontains=search ) | Q(type__icontains=search ) | Q(department__icontains=search ) | Q(sender__icontains=search ) | Q(receiver_name__icontains=search ))).exclude(doc_status="Removed").order_by("-id").values()
    return JsonResponse(list(docs), safe=False)

def searchDept(request):
    search = request.POST['search']
    dept = Department.objects.filter(department__icontains=search).order_by("-id").values()
    return JsonResponse(list(dept), safe=False)

def searchType(request):
    search = request.POST['search']
    type = DocType.objects.filter(type__icontains=search).order_by("-id").values()
    return JsonResponse(list(type), safe=False)

def searchUser(request):
    search = request.POST['search']
    user = User.objects.filter((Q(username__icontains=search) | Q(role__icontains=search ) | Q(department__icontains=search ))).exclude(id=request.session.get("id")).order_by("-id").values()
    return JsonResponse(list(user), safe=False)

def rejectPendingDoc(request):
    ret_msg = ''
    try:
        if request.method == 'POST':
            if request.POST['id'] != '':
                doc = Documents.objects.get(id=request.POST['id'])
               
                notification = "An admin has rejected your uploaded document <strong>" +getFilename(os.path.splitext(doc.document.name)[0])+".</strong> <strong> <br> Trace #: " +str(doc.trace_id)+". </strong>"
                notif = Notification(notification=notification, notified_id=doc.uploader_id, date=getDateTime())
                notif.save() 

                doc.delete()
                sharefile = SharedFile.objects.filter(file_id=request.POST['id'])
                sharefile.delete()
                
                ret_msg = "Success"

            else:
                ret_msg = "ID can't be null!"

        else:
            ret_msg = "Something went wrong!"

    except:
            ret_msg = "Something went wrong!"

    return HttpResponse(ret_msg)


