from django.contrib.auth.hashers import make_password
from django.db.models.expressions import F
from django.http import HttpResponse, HttpResponseRedirect
from django.http.response import JsonResponse, Http404
from django.shortcuts import redirect, render
# import shutil
from evsudts.models import Documents, User, SharedFile, RecentActivities, Notification
from django.conf import settings
import os, json, mimetypes, datetime, random
from pathlib import Path
from django.core.files.storage import FileSystemStorage
from datetime import date, timedelta
import qrcode, datetime
from io import BytesIO
from django.core.files import File
from PIL import Image, ImageDraw
from django.db.models import Q
from django.contrib import messages


listoffolders = []




def download(request, fname):
    BASE_DIR = os.path.join(settings.MEDIA_ROOT, fname)
    if os.path.exists(BASE_DIR):
        f = open(BASE_DIR, "rb+")
        mime_type, _ = mimetypes.guess_type(BASE_DIR)
        response = HttpResponse(f, content_type=mime_type)
        response['Content-Disposition'] = "attachment; filename=%s" % fname
        return response
    else:
        request.session['error'] = "Document not found!"
        return redirect("/error")

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

def documents(request):
    request.session['title'] = "Documents"
    if request.session.get("user_loggin") == True and request.session.get("user_role") == "User":

        return render(request, 'html/user/documents.html')
    
    else:
        return redirect("/")
   


# login page of the user
def index(request): 
    request.session['title'] = "Home"
    # s = User.objects.all()
    # s.update(photo="user.jpg")
    if request.session.get("user_loggin") == True and request.session.get("user_role") == "User":

        return render(request, 'html/user/index.html')
    
    else:
        return redirect("/")

# login page of the user
def userSettings(request): 
    request.session['title'] = "Settings"
    # s = RecentActivities.objects.all()
    # s.delete()
    if request.session.get("user_loggin") == True and request.session.get("user_role") == "User":

        return render(request, 'html/user/settings.html')
    
    else:
        return redirect("/")


def recyclebin(request):
    request.session['title'] = "Recycle Bin"
    if request.session.get("user_loggin") == True and request.session.get("user_role") == "User":

        return render(request, 'html/user/recyclebin.html')
    
    else:
        return redirect("/")
        
def deleteReceivedDoc(request):
    ret_msg = ''
    try:
        if request.method == 'POST':
            if request.POST['id'] != '':
                share = SharedFile.objects.get(id=request.POST['id'])
                if share.receiver_id == request.session.get("id"):
                     
                     notification = "You  deleted the document <strong>" + getFilename(os.path.splitext(share.docname)[0])+"</strong> that you've received from <strong>"+ share.sender +".</strong> <strong> <br> Trace #: " +str(share.traceid)+".</strong>"
                     recent = RecentActivities(notification=notification, notified_id=request.session.get("id"), date=getDateTime())
                     recent.save()
                else:
                     notification = "An admin has deleted the document <strong>" + getFilename(os.path.splitext(share.docname)[0])+"</strong> that you've received from <strong>"+ share.sender +".</strong> <strong> <br> Trace #: " +str(share.traceid)+".</strong>"
                     notif = Notification(notification=notification, notified_id=share.receiver_id, date=getDateTime())
                     notif.save() 

                share.delete()

                ret_msg = "Success"

            else:
                ret_msg = "ID can't be null!"

        else:
            ret_msg = "Something went wrong!"

    except:
            ret_msg = "Something went wrong!"

    return HttpResponse(ret_msg)

def rejectDoc(request):
    ret_msg = ''
    try:
        if request.method == 'POST':
            if request.POST['id'] != '':
                share = SharedFile.objects.get(id=request.POST['id'])
                notif = Notification.objects.get(tracenumber=share.traceid)
                notif.delete()
                notif_txt = "<strong>"+share.receiver_name + "</strong> rejected the document <strong>" + getFilename(os.path.splitext(share.docname)[0])  +'</strong> that you shared with him.'
                notif = Notification(notification=notif_txt,notified_id=share.sender_id,date=getDateTime())
                notif.save()
                share.delete()
           
                ret_msg = "Success"

            else:
                ret_msg = "ID can't be null!"

        else:
            ret_msg = "Something went wrong!"

    except:
            ret_msg = "Something went wrong!"

    return HttpResponse(ret_msg)

def rejectDocViaNotification(request, notifid, sharedfileid):
  
        share = SharedFile.objects.get(id=sharedfileid)
        notif = Notification.objects.get(tracenumber=share.traceid)
        notif.delete()
        notif_txt = "<strong>"+share.receiver_name + "</strong> rejected the document <strong>" + getFilename(os.path.splitext(share.docname)[0])  +'</strong> that you shared with him.'
        notif = Notification(notification=notif_txt,notified_id=share.sender_id,date=getDateTime())
        notif.save()
        share.delete()
        messages.success(request, 'Rejected successfully')
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

def deleteNotification(request):
    ret_msg = ''
    try:
        if request.method == 'POST':
            if request.POST['id'] != '':
                notif = Notification.objects.get(id=request.POST['id'])
              
                notif.delete()
           
                ret_msg = "Success"

            else:
                ret_msg = "ID can't be null!"

        else:
            ret_msg = "Something went wrong!"

    except:
            ret_msg = "Something went wrong!"

    return HttpResponse(ret_msg)

def cancelSharedDoc(request):
    ret_msg = ''
    try:
        if request.method == 'POST':
            if request.POST['id'] != '':
                share = SharedFile.objects.get(id=request.POST['id'])
                notif = "You cancelled the document that you want to share with <strong> "+share.receiver_name+"</strong>. <br> <strong> Trace #: "+str(share.traceid)+"</strong>"
                recent = RecentActivities(notification=notif, notified_id=request.session.get("id"), date=getDateTime())
                
                notif = Notification.objects.filter(tracenumber=share.traceid)
                notif.delete()

                recent.save()
                share.delete()
                ret_msg = "Success"

            else:
                ret_msg = "ID can't be null!"

        else:
            ret_msg = "Something went wrong!"

    except:
            ret_msg = "Something went wrong!"

    return HttpResponse(ret_msg)

def deleteDoc(request):
    ret_msg = ''
    try:
        if request.method == 'POST':
            if request.POST['id'] != '':
                doc = Documents.objects.get(id=request.POST['id'])
                # doc.last_status = doc.status
                doc.status = "Removed"
                if doc.uploader_id == request.session.get("id"):
                     
                     notification = "You temporarily deleted <strong>" + getFilename(os.path.splitext(doc.document.name)[0])+". <br> Trace #: " +str(doc.trace_id)+".</strong>"
                     recent = RecentActivities(notification=notification, notified_id=request.session.get("id"), date=getDateTime())
                     recent.save()
                else:
                     notification = "An Admin has temporarily deleted your uploaded document <strong> " +getFilename(os.path.splitext(doc.document.name)[0])+".</strong>  <br> <strong> Trace #: " +str(doc.trace_id)+".</strong>"
                     notif = Notification(notification=notification, notified_id=doc.uploader_id, date=getDateTime())
                     notif.save() 
            
                doc.save()
                sharefile = SharedFile.objects.filter(file_id=request.POST['id'])
                sharefile.update(doc_status="Removed")
                
                ret_msg = "Success"
            else:
                ret_msg = "ID can't be null!"

        else:
            ret_msg = "Something went wrong!"

    except:
            ret_msg = "Something went wrong!"

    return HttpResponse(ret_msg)

def deleteDocPermanently(request):
    ret_msg = ''
    try:
        if request.method == 'POST':
            if request.POST['id'] != '':
                doc = Documents.objects.get(id=request.POST['id'])
                if doc.uploader_id == request.session.get("id"):
                     notification = "You permanently deleted <strong>" + getFilename(os.path.splitext(doc.document.name)[0])+".</strong> <strong> <br> Trace #: " +str(doc.trace_id)+".</strong>"
                     recent = RecentActivities(notification=notification, notified_id=request.session.get("id"), date=getDateTime())
                     recent.save()
                else:
                     notification = "An admin has permanently deleted your uploaded document <strong> " +getFilename(os.path.splitext(doc.document.name)[0])+".</strong> <strong> <br> Trace #: " +str(doc.trace_id)+".</strong>"
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

   
# logout
def logout(request):
    try:
        del request.session['user_loggin']
        del request.session['username']

    except:
        pass    

    return redirect("/")


# upload multiple files
def uploadDoc(request):
    # timenow = datetime.datetime.now().strftime("%m")+"-"+datetime.datetime.now().strftime("%d")+"-"+datetime.datetime.now().strftime("%Y")+" "+datetime.datetime.now().strftime("%H")+":"+datetime.datetime.now().strftime("%M")+":"+datetime.datetime.now().strftime("%S")
    traceid = 0
    ret_msg = ''
    ret = {}
    docstatus = ""
    doclast_status = ""
    qrname = ''
    if request.method == "POST":
        
        if request.POST['type'] and request.POST['desc'] and request.POST['dept'] != "":
                    uploaded_file = request.FILES['file']
                  
                    if Documents.objects.all().count() > 0:
                        last_id = Documents.objects.latest('id')
                    
                        traceid = (last_id.id + 1) + 1000000
                             
                    else:
                        
                        traceid = 1 + 1000000

                    if request.session.get("user_role") == "User":
                        docstatus = "Pending"
                        doclast_status = "Pending"

                    else:
                        docstatus = "Approved"
                        doclast_status = "Approved"

                    docs = Documents(document=os.path.splitext(uploaded_file.name)[0]+"_"+str(traceid)+os.path.splitext(uploaded_file.name)[1], uploader_id=request.session.get("id"), uploaded_at=getDateTime(), updated_at=getDateTime(), type=request.POST['type'], desc=request.POST['desc'], status=docstatus, department=request.POST['dept'], trace_id=traceid, last_status=doclast_status)
                    
                    qrcode_img = qrcode.make(traceid)
                    canvas = Image.new('RGB', (290,290), 'white')
                    draw = ImageDraw.Draw(canvas)
                    canvas.paste(qrcode_img)
                    qrname = str(traceid) + '.png'
                    buffer = BytesIO()
                    canvas.save(buffer, 'PNG')
                    docs.qr_code.save(qrname, File(buffer), save=False)
                    docs.qr_code = qrname

                    docs.save()
                    fss = FileSystemStorage()
                    newDocName =  os.path.splitext(uploaded_file.name)[0]
                    fss.save(os.path.splitext(uploaded_file.name)[0]+"_"+str(traceid)+os.path.splitext(uploaded_file.name)[1], uploaded_file)
                    notification = "You uploaded a new document <strong>" + getFilename(os.path.splitext(uploaded_file.name)[0]+"_"+str(traceid)) +"</strong>. <br> Trace #: "+str(traceid)
                    recent = RecentActivities(notification=notification, notified_id=request.session.get("id"), date=getDateTime())
                    recent.save()
                    ret_msg = "Success"


        else:
            ret_msg = "All fields must be filled up"
     
        
    else:
        qrname = ''
        ret_msg = "An error has occured!"
    

    return JsonResponse({'docname': os.path.splitext(uploaded_file.name)[0]+"_"+str(traceid)+os.path.splitext(uploaded_file.name)[1],'message': ret_msg, 'traceid': traceid, 'qrname': qrname, 'dept': request.POST['dept'], 'type': request.POST['type'], 'date': getDateTime(), 'desc': request.POST['desc'], 'status': 'Pending'})

 
# def viewFile(request, file):
 
#    try:

#         filepath = os.path.join(Path(__file__).resolve().parent.parent.parent, 'media'+'\\'+file.replace('%', '\\'))
#         os.startfile(filepath)
#         return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

#    except:
#         return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


def approvedDoc(request):
    ret_msg = ""
    if request.method == "POST":
        if request.POST['id'] != "":
            shared = SharedFile.objects.get(id=request.POST['id'])
            shared.status = "Approved"
            notif_txt = "<strong>"+shared.receiver_name + "</strong> accept the document <strong>" + getFilename(os.path.splitext(shared.docname)[0] ) +'</strong> that you shared with him. <br> <strong> Trace #: '+str(shared.traceid)+"</strong>"
            notif = Notification(notification=notif_txt,notified_id=shared.sender_id,date=getDateTime())
            notif.save()
            notif_txt2 = "You accepted the document <strong>" + getFilename(os.path.splitext(shared.docname)[0])  +'</strong> that has been shared to you by <strong>'+ shared.sender +"</strong>. <br> <strong> Trace #: "+str(shared.traceid)+"</strong>"
            
            recent = RecentActivities(notification=notif_txt2,notified_id=shared.receiver_id,date=getDateTime())
            recent.save()
            shared.received_on = getDateTime()
            
            noti = Notification.objects.get(tracenumber=shared.traceid)
            noti.delete()
        
            shared.save()


            ret_msg = "Success"
        else:
             ret_msg = "Id can't be empty!"
    else:

        ret_msg = "Error"

    return HttpResponse(ret_msg)

def approvedDocViaNotification(request, notifid, sharedfileid):
        if SharedFile.objects.filter(id=sharedfileid).exists():
            shared = SharedFile.objects.get(id=sharedfileid)
            shared.status = "Approved"
            notif_txt = "<strong>"+shared.receiver_name + "</strong> accepted the document <strong>" + getFilename(os.path.splitext(shared.docname)[0])  +'</strong> that you shared with him. <br> <strong> Trace #: '+str(shared.traceid)+"</strong>"
            notif = Notification(notification=notif_txt,notified_id=shared.sender_id,date=getDateTime())
            notif.save()
            notif_txt2 = "You accepted the document <strong>" + getFilename(os.path.splitext(shared.docname)[0])  +'</strong> that has been shared to you by <strong>'+ shared.sender +"</strong>. <br> <strong> Trace #: "+str(shared.traceid)+"</strong>"
            recent = RecentActivities(notification=notif_txt2,notified_id=shared.receiver_id,date=getDateTime())
            recent.save()
            shared.received_on = getDateTime()
            noti = Notification.objects.get(tracenumber=shared.traceid)
            noti.delete()
            shared.save()
            messages.success(request, 'Document approved successfully')
            return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

        else:
            request.session['error'] = "Document not found!"
            return redirect("/error")
            
def approvedAllPendingDocs(request):
    retmsg = ""
   
    try:
        shared = SharedFile.objects.filter(status="Pending")
        if shared.count() > 0:
            for share in shared:
                notif_txt = "<strong>"+share.receiver_name + "</strong> accept the document <strong>" + getFilename(os.path.splitext(share.docname)[0])  +'</strong> that you shared with him. <br> <strong> Trace #: '+str(share.traceid)+"</strong>"
                notif = Notification(notification=notif_txt,notified_id=share.sender_id,date=getDateTime())
                notif.save()
                notif_txt2 = "You accepted the document <strong>" + getFilename(os.path.splitext(share.docname)[0])  +'</strong> that has been shared to you by <strong>'+ share.sender +"</strong>. <br> <strong> Trace #: "+str(share.traceid)+"</strong>"
                recent = RecentActivities(notification=notif_txt2,notified_id=share.receiver_id,date=getDateTime())
                recent.save()
                noti = Notification.objects.get(tracenumber=share.traceid)
                noti.delete()
      
            shared.update(status="Approved", received_on = getDateTime())
           
            retmsg = "Success"

        else:
            retmsg = "No pending documents found"
    
    except:
        retmsg = "Something went wrong!"
  
    return HttpResponse(retmsg)

def unRemovedDoc(request):
    ret_msg = ""
    if request.method == "POST":
        if request.POST['id'] != "":
            doc = Documents.objects.get(id=request.POST['id'])
            doc.status = doc.last_status
            sharefile = SharedFile.objects.filter(file_id=request.POST['id'])
            # print(sharefile.count())
            sharefile.update(doc_status=doc.status)
            if doc.uploader_id == request.session.get("id"):
                notification = "You restore <strong>" + getFilename(os.path.splitext(doc.document.name)[0])+".</strong> <br> <strong>Trace #: "+str(doc.trace_id)+"</strong>"
                recent = RecentActivities(notification=notification, notified_id=request.session.get("id"), date=getDateTime())
                recent.save()
            else:
                notification = "An admin has restore your document " +getFilename(os.path.splitext(doc.document.name)[0])+". <br> Trace #: " +str(doc.trace_id)+"."
                notif = Notification(notification=notification, notified_id=doc.uploader_id, date=getDateTime())
                notif.save() 

            doc.save()
           
            ret_msg = "Success"
        else:
             ret_msg = "Id can't be empty!"
    else:

        ret_msg = "Error"

    return HttpResponse(ret_msg)

def getRecentActivities(request):
    recent = RecentActivities.objects.filter(notified_id=request.session.get("id")).order_by("-id").values()[:100]
    return JsonResponse(list(recent), safe=False)

def getNotifications(request):
    notif = Notification.objects.filter(notified_id=request.session.get("id")).order_by("-id").values()[:100]
    return JsonResponse(list(notif), safe=False)

def getDocs(request):
    docs = Documents.objects.filter(uploader_id=request.session.get("id")).exclude(status="Removed").order_by("-id").values()
    return JsonResponse(list(docs), safe=False)

def getUsers(request):
    if request.session.get('user_role') == "Admin":
        users = User.objects.exclude(id=request.session.get("id")).values()
    else:
        users = User.objects.exclude(id=request.session.get("id")).exclude(role="Admin").values()

    return JsonResponse(list(users), safe=False)

def getUnapprovedSharedDocs(request):
    shared = SharedFile.objects.filter(receiver_id=request.session.get("id")).exclude(status="Approved").exclude(status="Removed").values()
    return JsonResponse(list(shared), safe=False)

def getUserInfo(request):
    info = User.objects.get(id=request.session.get("id"))
    return JsonResponse({'role': info.role,'username': info.username, 'hint': info.hint, 'department': info.department, 'photo': str(info.photo)}, safe=False)

def getReceivedDoc(request):
    received = SharedFile.objects.filter(receiver_id=request.session.get("id")).exclude(status="Pending").values()
    return JsonResponse(list(received), safe=False)

def getPendingSharedDocs(request):
    pending = SharedFile.objects.filter(sender_id=request.session.get("id")).exclude(status="Approved").exclude(doc_status="Removed").values()
    return JsonResponse(list(pending), safe=False)

def getRemovedDocs(request):
    removed = Documents.objects.filter(Q(status="Removed") & Q(uploader_id=request.session.get("id"))).values()
    return JsonResponse(list(removed), safe=False)

def getAllRemovedDocs(request):
    removed = Documents.objects.filter(Q(status="Removed")).exclude(uploader_id=request.session.get('id')).values()
    return JsonResponse(list(removed), safe=False)

def searchDocs(request):
    search = request.POST['search']
    docs = Documents.objects.filter((Q(document__icontains=search) | Q(uploaded_at__icontains=search ) | Q(type__icontains=search ) | Q(desc__icontains=search ) | Q(status__icontains=search ) | Q(department__icontains=search ) | Q(trace_id__icontains=search )) & Q(uploader_id=request.session.get('id'))).exclude(status="Removed").values()
    return JsonResponse(list(docs), safe=False)


def searchRemovedDocs(request):
    search = request.POST['search']
    docs = Documents.objects.filter((Q(document__icontains=search) | Q(uploaded_at__icontains=search ) | Q(type__icontains=search ) | Q(desc__icontains=search ) | Q(status__icontains=search ) | Q(department__icontains=search ) | Q(trace_id__icontains=search )) & Q(uploader_id=request.session.get('id'))).exclude(status="Approved").exclude(status="Pending").values()
    return JsonResponse(list(docs), safe=False)

def searchAllRemovedDocs(request):
    search = request.POST['search']
    docs = Documents.objects.filter((Q(document__icontains=search) | Q(uploaded_at__icontains=search ) | Q(type__icontains=search ) | Q(desc__icontains=search ) | Q(status__icontains=search ) | Q(department__icontains=search ) | Q(trace_id__icontains=search ))).exclude(status="Approved").exclude(status="Pending").exclude(uploader_id=request.session.get('id')).values()
    return JsonResponse(list(docs), safe=False)

def searchReceived(request):
    search = request.POST['search']
    share = SharedFile.objects.filter((Q(docname__icontains=search) | Q(traceid__icontains=search ) | Q(status__icontains=search ) | Q(send_on__icontains=search ) | Q(type__icontains=search ) | Q(department__icontains=search )) & Q(receiver_id=request.session.get('id'))).exclude(status="Pending").values()
    return JsonResponse(list(share), safe=False)

def searchUnapprovedSharedDocs(request):
    search = request.POST['search']
    share = SharedFile.objects.filter((Q(docname__icontains=search) | Q(traceid__icontains=search ) | Q(status__icontains=search ) | Q(send_on__icontains=search ) | Q(type__icontains=search ) | Q(department__icontains=search )) & Q(receiver_id=request.session.get('id')) & Q(status__iexact="Pending")).values()
    return JsonResponse(list(share), safe=False)

def updateDocInfo(request):
    ret_msg = ""
    if request.method == "POST":    
        id = request.POST['id']
        desc = request.POST['desc']
        dept = request.POST['dept']
        type = request.POST['type']
        if id != "":
            if desc and dept and type != "":

                doc = Documents.objects.get(id=id)
                doc.desc = desc
                doc.type = type
                doc.department = dept
                doc.uploaded_at = getDateTime()
                if doc.uploader_id == request.session.get("id"):
                    notif = "You updated the info of <strong>"+str(doc.document.name)+"</strong> <br> <strong> Trace #: "+str(doc.trace_id)+"</strong>"
                    recent = RecentActivities(notification=notif, notified_id=request.session.get("id"), date=getDateTime())
                    recent.save()

                else:
                    notif = "An admin updated the info of <strong>"+str(doc.document.name)+"</strong> <br> <strong> Trace #: "+str(doc.trace_id)+"</strong>"
                    recent = Notification(notification=notif, notified_id=doc.uploader_id, date=getDateTime())
                    recent.save()

                doc.save()
                ret_msg = "Success"

            else:
                ret_msg = "All field must be fileld up"

        else:
            ret_msg = "Id is empty. Can't select data to update!"
    
    else:

        ret_msg = "Something went wrong!"
    

    return HttpResponse(ret_msg)

def updateUsername(request):
    retmsg = ''
    if request.method == "POST":
        if request.POST['username'] != "":
            if all(string.isspace() or string.isalpha() for string in request.POST['username']):
              
                 if User.objects.filter(username__iexact=request.POST['username']).exists():
                     user = User.objects.get(id=request.session.get("id"))
                     if user.username == request.POST['username']:
                        
                         retmsg = "No changes performed"
                     else:

                         retmsg = 'Username already exist!'
                 else:
                     request.session['username'] = request.POST['username']
                     user = User.objects.get(id=request.session.get("id"))
                     user.username=request.POST['username']
                     user.save()
                     retmsg = "Success"
            else:

                retmsg = "Username must contain letters only"

        else:
            retmsg = "Username can't be empty!"

    else:
        retmsg = "Something went wrong!"

    return HttpResponse(retmsg)

def updateDp(request):
    retmsg = ""
    if request.method == "POST":
          upload_file = request.FILES["photo"]
          extension = os.path.splitext(upload_file.name)[1]
          rename = datetime.datetime.now().strftime("%Y_%m_%d %H_%M_%S") + extension
          user = User.objects.get(id=request.session.get("id"))
          user.photo = rename
          user.save()
          fss = FileSystemStorage()
          fss.save(rename, upload_file)
          retmsg = "Success"
    else:
        retmsg = "Something went wrong"
    
    return HttpResponse(retmsg)

def updateHint(request):
    retmsg = ""
    if request.method == "POST":
          if request.POST['hint'] != "":
              user = User.objects.get(id=request.session.get("id"))
              user.hint = request.POST['hint']
              user.save()
              retmsg = "Success"
          else:
              retmsg = "Hint can't be empty!"
              
    else:
        retmsg = "Something went wrong!"
    
    return HttpResponse(retmsg)

def updateDept(request):
    retmsg = ""
    if request.method == "POST":
          if request.POST['dept'] != "":
              user = User.objects.get(id=request.session.get("id"))
              user.department = request.POST['dept']
              user.save()
              retmsg = "Success"
          else:
              retmsg = "Hint can't be empty!"
              
    else:
        retmsg = "Something went wrong!"
    
    return HttpResponse(retmsg)

def updatePassword(request):
    retmsg = ""
    if request.method == "POST":
        if request.POST['password'] and request.POST['password2'] != "":
            if request.POST['password'] == request.POST['password2']:
                hashed_pwd = make_password(request.POST['password'], salt=None, hasher="default")
                user = User.objects.get(id=request.session.get("id"))
                user.password = hashed_pwd
                user.save()
                retmsg = "Success"

            else:
                retmsg = "Password didn't matched!"

        else:

            retmsg = "All field must be filled up!"

    else:
        retmsg = "Something went wrong!"
    
    return HttpResponse(retmsg)

def renameDoc(request):
    retmsg = ""
    if request.method == "POST":
        if request.POST['id'] == "":
            retmsg = "Id is empty!"
        elif request.POST['docname'] == "":
            retmsg = "Docname is empty!"
        else:
            doc = Documents.objects.get(id=request.POST['id'])
            ext = os.path.splitext(doc.document.name)[1]
            
            current_name = os.path.join(Path(__file__).resolve().parent.parent.parent, 'media\\'+str(doc.document.name))
            new_name = os.path.join(Path(__file__).resolve().parent.parent.parent, 'media\\'+request.POST['docname']+"_"+str(doc.trace_id)+ext)
            os.rename(current_name,new_name)
            doc.document = request.POST['docname']+"_"+str(doc.trace_id)+ext
            if doc.uploader_id == request.session.get("id"):
                notif = "You changed the name of <strong>"+getFilename(str(doc.document.name))+"</strong> to <strong>"+ request.POST['docname'].upper() +"</strong><br> <strong> Trace #: "+str(doc.trace_id)+"</strong>"
                recent = RecentActivities(notification=notif, notified_id=request.session.get("id"), date=getDateTime())
                recent.save()

            else:
                notif = "An admin changed the name of <strong>"+getFilename(str(doc.document.name))+"</strong> to <strong>"+ request.POST['docname'].upper() +"</strong><br> <strong> Trace #: "+str(doc.trace_id)+"</strong>"
                recent = Notification(notification=notif, notified_id=doc.uploader_id, date=getDateTime())
                recent.save()
          
            if SharedFile.objects.filter(traceid=doc.trace_id).count() > 0:
                  shared = SharedFile.objects.filter(traceid=doc.trace_id)
                  shared.update(docname=request.POST['docname']+"_"+str(doc.trace_id)+ext)

            doc.save()
            retmsg = "Success"
    else:   
        retmsg = "Something went wrong"

    return HttpResponse(retmsg)

def sharefile(request):
    # last_id = 0
    # last_shared_id = 0
    ret_msg = ""
    # timenow = datetime.datetime.now().strftime("%m")+"-"+datetime.datetime.now().strftime("%d")+"-"+datetime.datetime.now().strftime("%Y")+" "+datetime.datetime.now().strftime("%H")+":"+datetime.datetime.now().strftime("%M")+":"+datetime.datetime.now().strftime("%S")
    if request.method == "POST":
        # user = User.objects.get(id=request.POST['receiver_id'])
        doc = Documents.objects.get(id=request.POST['docid'])
        if doc.status != "Pending":
             if SharedFile.objects.filter(Q(file_id=request.POST['docid']) & Q(sender_id=request.session.get('id')) & Q(receiver_id=request.POST['receiver_id'])).count() > 0:
                ret_msg = "You could only share the file with a user once!"
             else:
                share = SharedFile(file_id=request.POST['docid'], docname=doc.document.name, traceid=doc.trace_id, status="Pending", receiver_id=request.POST['receiver_id'], receiver_name = request.POST['receiver_name'], send_on=getDateTime(), sender=request.session.get('username'), sender_id=request.session.get('id'), type=doc.type, department=doc.department, doc_status=doc.status, comment=request.POST['comment'])
                share.save()
                last_shared_id = SharedFile.objects.latest("id")

                datetimenow = getDateTime()

                recent = Notification(notification="None", notified_id=request.POST['receiver_id'], date=datetimenow, tracenumber=doc.trace_id)
                recent.save()
                last_id = Notification.objects.latest('id')
                notification = "<strong>"+ request.session.get("username") + "</strong> wants to share a document <strong> (" + getFilename(os.path.splitext(str(doc.document.name))[0]) +")</strong> to you <br> <a href='/user/approvedvianotification/"+str(last_id.id)+"/"+str(last_shared_id.id)+"'>Click here to approved</a> <br> <a href='/user/rejectvianotification/"+str(last_id.id)+"/"+str(last_shared_id.id)+"'>Click here to reject</a>"
                
                
                lastnotif = Notification.objects.get(date=datetimenow)
                lastnotif.notification = notification
                lastnotif.save()
    
                ret_msg = "Success"

        else:
            ret_msg = "Can't share document! It should be approved first by an Admin."
       
    else:
        ret_msg = "Error"

    return HttpResponse(ret_msg)


def sendfile(request):
    # last_id = 0
    # last_shared_id = 0
    ret_msg = ""
    # timenow = datetime.datetime.now().strftime("%m")+"-"+datetime.datetime.now().strftime("%d")+"-"+datetime.datetime.now().strftime("%Y")+" "+datetime.datetime.now().strftime("%H")+":"+datetime.datetime.now().strftime("%M")+":"+datetime.datetime.now().strftime("%S")
    if request.method == "POST":

                    uploaded_file = request.FILES['file']
                
                    
                    traceid = str(random.randint(1,9))+str(random.randint(0,9))+str(random.randint(0,9))+str(random.randint(0,9))+str(random.randint(0,9))+str(random.randint(0,9))+str(random.randint(0,9))+str(random.randint(0,9))+str(random.randint(0,9))+str(random.randint(0,9))
                    while Documents.objects.filter(trace_id=traceid).count() > 0:
                         traceid = str(random.randint(0,9))+str(random.randint(0,9))+str(random.randint(0,9))+str(random.randint(0,9))+str(random.randint(0,9))+str(random.randint(0,9))+str(random.randint(0,9))+str(random.randint(0,9))+str(random.randint(0,9))+str(random.randint(0,9))
                    
                    qrcode_img = qrcode.make(traceid)
                    canvas = Image.new('RGB', (290,290), 'white')
                    draw = ImageDraw.Draw(canvas)
                    canvas.paste(qrcode_img)
                    qrname = str(traceid) + '.png'
                    buffer = BytesIO()
                    canvas.save(buffer, 'PNG')
             
                    user = User.objects.get(id=request.POST['receiver_id'])
                    share = SharedFile(file_id=0, docname=os.path.splitext(uploaded_file.name)[0]+"_"+str(traceid)+os.path.splitext(uploaded_file.name)[1], traceid=traceid, status="Pending", receiver_id=request.POST['receiver_id'], receiver_name = user.username, send_on=getDateTime(), sender=request.session.get('username'), sender_id=request.session.get('id'), type=request.POST['type'], department=request.POST['dept'], doc_status="Approved", comment=request.POST['comment'])
                    share.ownqr_code.save(qrname, File(buffer), save=False)
              
                    share.ownqr_code = qrname
                    share.save()
                    last_shared_id = SharedFile.objects.latest("id")
          
                    fss = FileSystemStorage()
                    newDocName =  os.path.splitext(uploaded_file.name)[0]
                    fss.save(os.path.splitext(uploaded_file.name)[0]+"_"+str(traceid)+os.path.splitext(uploaded_file.name)[1], uploaded_file)
                 
                    last_shared_id = SharedFile.objects.latest("id")

                    datetimenow = getDateTime()

                    recent = Notification(notification="None", notified_id=request.POST['receiver_id'], date=datetimenow, tracenumber=traceid)
                    recent.save()
                    last_id = Notification.objects.latest('id')
                    notification = "<strong>"+ request.session.get("username") + "</strong> wants to share a document <strong> (" + getFilename(os.path.splitext(uploaded_file.name)[0]+"_"+str(traceid)+os.path.splitext(uploaded_file.name)[1]) +")</strong> to you <br> <a href='/user/approvedvianotification/"+str(last_id.id)+"/"+str(last_shared_id.id)+"'>Click here to approved</a> <br> <a href='/user/rejectvianotification/"+str(last_id.id)+"/"+str(last_shared_id.id)+"'>Click here to reject</a>"
                    
                    
                    lastnotif = Notification.objects.get(date=datetimenow)
                    lastnotif.notification = notification
                    lastnotif.save()
                    ret_msg = "Success"
       
    else:
        ret_msg = "Error"

    return HttpResponse(ret_msg)
