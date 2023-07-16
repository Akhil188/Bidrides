"""myproject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from customer.views import CustomerList, CustomerDetail,CustomerID,CustomerDistance
from vendor.views import VendorList, VendorDetail,VendorID
from bids.views import BidList, BidDetail,BidDetail2, BidRetrieveByCId, BidRetrieveByVId


urlpatterns = [
    path('admin/', admin.site.urls),
        path('customers/', CustomerList.as_view(), name='customer-list'),
    path('customers/<int:pk>', CustomerDetail.as_view(), name='customer-detail'),
     path('vendors/', VendorList.as_view(), name='Vendor-list'),
    path('vendors/<int:pk>', VendorDetail.as_view(), name='Vendor-detail'),
        path('customers/<phone_number>/',CustomerID.as_view(), name='customer_id_api'),
        path('vendors/<phone_number>/',VendorID.as_view(), name='vendor_id_api'),
         path('bids/', BidList.as_view(), name='bid-list'),
    path('bids/<int:pk>/', BidDetail.as_view(), name='bid-detail'),
    path('bids/customer/<int:c_id>/', BidRetrieveByCId.as_view(), name='bid-retrieve-by-cid'),
    path('bids/vendor/<int:v_id>/', BidRetrieveByVId.as_view(), name='bid-retrieve-by-vid'),
    path('bids/<int:c_id>/<int:v_id>/', BidDetail2.as_view(), name='bid-detail2'),
    path('customers/<int:pk>/distance-to-vendor/', CustomerDistance.as_view(), name='customer-distance-to-vendor'),

]

