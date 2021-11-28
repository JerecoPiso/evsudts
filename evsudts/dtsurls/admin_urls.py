from django.conf.urls import url
from ..views import admin_views

urlpatterns = [
    # links
    url(r'^$', admin_views.index, name='index'),
    url(r'^documents', admin_views.documents, name='Documents'),
    url(r'^mydocuments', admin_views.mydocuments, name='My Documents'),
    url(r'^users', admin_views.users, name='Users'),
    url(r'^departments', admin_views.department, name='Departments'),
   
    url(r'^recyclebin', admin_views.recyclebin, name='Recyle Bin'),
    url(r'^approveddoc', admin_views.approvedDoc, name='Approved Document'),
    url(r'^approvedallpendingdoc', admin_views.approvedAllPendingDocs, name='Approved All Pending Documents'),
    url(r'^doctype', admin_views.doctype, name='Document Types'),
    url(r'^settings', admin_views.settings, name='User Settings'),
    
    # search
    url(r'^searchapproved', admin_views.searchApprovedDocs, name='Search Approved Documents'),
    url(r'^searchpending', admin_views.searchPendingDocs, name='Search Pending Documents'),
    url(r'^searchshared', admin_views.searchSharedDocs, name='Search Shared Documents'),
    url(r'^searchdept', admin_views.searchDept, name='Search Department'),
    url(r'^searchtype', admin_views.searchType, name='Search Document Type'),
    url(r'^searchuser', admin_views.searchUser, name='Search Users'),

    # get
    url(r'^getdept', admin_views.getDept, name='Get Department'),
    url(r'^gettype', admin_views.getType, name='Get Document Type'),
    url(r'^getusers', admin_views.getUsers, name='Get All Users'),
    url(r'^getapproveddocs', admin_views.getApprovedDocs, name='Get Approved Documents'),
    url(r'^getpendingdocs', admin_views.getPendingDocs, name='Get Pending Documents'),
    url(r'^getshareddocs', admin_views.getSharedDocs, name='Get Shared Documents'),
    url(r'^getdoctypes', admin_views.getDocTypes, name='Get Document Types'),

    # add
    url(r'^adddept', admin_views.addDept, name='Add Department'),
    url(r'^addtype', admin_views.addType, name='Add Document Type'),
  
    # delete
    url(r'^deletedept', admin_views.deleteDept, name='Delete Department'),
    url(r'^deletetype', admin_views.deleteType, name='Delete Document Type'),
    url(r'^deleteuser', admin_views.deleteUser, name='Delete User'),
    url(r'^rejectpendingdoc', admin_views.rejectPendingDoc, name='Reject Pending Document'),

    # update
    url(r'^updatedept', admin_views.updateDept, name='Update Department'),
    url(r'^updatetype', admin_views.updateType, name='Update Document Type'),
    url(r'^updateuser', admin_views.updateUser, name='Update User'),



    

]