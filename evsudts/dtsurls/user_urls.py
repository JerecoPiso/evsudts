from django.conf.urls import url
from ..views import user_views

urlpatterns = [
    url(r'^$', user_views.index, name='index'),
    url(r'^documents', user_views.documents, name='Documents'),
    url(r'^logout', user_views.logout, name='Logout User'),
    url(r'^recyclebin', user_views.recyclebin, name='Recycle Bin of the User'),
    
    url(r'^settings', user_views.userSettings, name='User Settings'),
    url(r'^uploaddoc', user_views.uploadDoc, name='Upload Document'),
    url(r'^senddoc', user_views.sendfile, name='Send Document'),
    # url(r'^viewfile/(?P<file>.+)$', user_views.viewFile, name='View Selected File'),
    url(r'^approveddoc', user_views.approvedDoc, name='Approved Uploaded Document'),
    url(r'^unremoveddoc', user_views.unRemovedDoc, name='Restore Document'),
    url(r'^sharefile', user_views.sharefile, name='Shared Document'),
    url(r'^rejectdoc', user_views.rejectDoc, name='Reject Uploaded Document'),
    url(r'^cancelshareddoc', user_views.cancelSharedDoc, name='Cancel Shared Document'),
    url(r'^approvedvianotification/(?P<notifid>.+)/(?P<sharedfileid>.+)$', user_views.approvedDocViaNotification, name='Approved Uploaded Document Via Notification'),
    url(r'^rejectvianotification/(?P<notifid>.+)/(?P<sharedfileid>.+)$', user_views.rejectDocViaNotification, name="Reject Uploaded Document Via Notification" ),
    url(r'^approvedallpendingdoc', user_views.approvedAllPendingDocs, name='Approved All Pending Documents'),
    # delete links
    url(r'^deletefile', user_views.deleteDoc, name='Delete File'),
    url(r'^deletereceiveddoc', user_views.deleteReceivedDoc, name='Delete Received Document'),
    url(r'^deletedocpermanently', user_views.deleteDocPermanently, name='Delete Document Permanently'),
    url(r'^deletenotification', user_views.deleteNotification, name='Delete Notification'),

    # getting datas
    url(r'^getpendingshareddocs', user_views.getPendingSharedDocs, name='Get Shared Documents By The User'),
    url(r'^getunapprovedshareddocs', user_views.getUnapprovedSharedDocs, name='Get Unapproved Shared Documents'),
    url(r'^getremoveddocs', user_views.getRemovedDocs, name='Get Temporarily Deleted Documents'),
    url(r'^getallremoveddocs', user_views.getAllRemovedDocs, name='Get All Temporarily Deleted Documents'),
    url(r'^getreceiveddoc', user_views.getReceivedDoc, name='Get Received Documents'),
    url(r'^getdocs', user_views.getDocs, name='Get All Documents'),
    url(r'^getrecentactivities', user_views.getRecentActivities, name='Get Current Users Recent Activities'),
    url(r'^getnotifications', user_views.getNotifications, name='Get Current Users Notifications'),
    url(r'^getusers', user_views.getUsers, name='Get All Users'),
    url(r'^getuserinfo', user_views.getUserInfo, name='Get User Info'),

    # searching to show in tables
    url(r'^searchdocs', user_views.searchDocs, name='Search Documents'),
    url(r'^searchremoveddocs', user_views.searchRemovedDocs, name='Search Removed Documents'),
    url(r'^searchallremoveddocs', user_views.searchAllRemovedDocs, name='Search All Removed Documents'),
    url(r'^searchreceived', user_views.searchReceived, name='Search Removed Documents'),
    url(r'^searchunapprovedshareddocs', user_views.searchUnapprovedSharedDocs, name='Search Unapproved Shared Documents'),

    url(r'^updatedocinfo', user_views.updateDocInfo, name='Update Document Information'),
    url(r'^updateusername', user_views.updateUsername, name='Update Username'),
    url(r'^updatedp', user_views.updateDp, name='Update Profile Picture'),
    url(r'^updatepassword', user_views.updatePassword, name='Update Password'),
    url(r'^updatehint', user_views.updateHint, name='Update Hint'),
    url(r'^updatedept', user_views.updateDept, name='Update User Department'),
    url(r'^renamedoc', user_views.renameDoc, name='Rename Document'),
    url(r'^download/(?P<fname>.+)$', user_views.download, name='Download Document'),

    # url(r'^createfolder', user_views.createFolder, name='Create Folder'),
    # url(r'^uploadfolder', user_views.uploadfolder, name='Upload Folder'),
    # url(r'^renamefolderorfile', user_views.renameFolderOrFile, name='Rename a Folder or File'),
    # url(r'^getfolderfiles', user_views.getFolderFiles, name='Get Folder and Files'),
    # url(r'^deletefolder', user_views.deleteFolder, name='Delete File'),
]