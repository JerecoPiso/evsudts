from django.conf.urls import url
from ..views import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^signup', views.signup, name='Signup Form'),
    url(r'^register', views.register, name='Register'),
    url(r'^checkaccount', views.checkAccount, name='Check Account'),
    url(r'^changepass', views.changePass, name='Change Password'),
    url(r'^login', views.login, name='Login'),
    url(r'^error', views.error, name='Error'),
    url(r'^search', views.searchDocumentUsingTrace, name='Search Docs'),
    url(r'^checkusername', views.checkUsername, name='Check Username'),
]