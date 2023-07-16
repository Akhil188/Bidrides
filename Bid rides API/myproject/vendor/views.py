from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Vendor
from rest_framework import serializers
from django.http import Http404






class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = '__all__'

class VendorList(APIView):
    def get(self, request):
        Vendors = Vendor.objects.all()
        serializer = VendorSerializer(Vendors, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = VendorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class VendorDetail(APIView):
    def get_object(self, pk):
        try:
            return Vendor.objects.get(pk=pk)
        except Vendor.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        Vendor = self.get_object(pk)
        serializer = VendorSerializer(Vendor)
        return Response(serializer.data)

    def put(self, request, pk):
        Vendor = self.get_object(pk)
        serializer = VendorSerializer(Vendor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        Vendor = self.get_object(pk)
        Vendor.delete()
        return Response(status=204)

class VendorID(APIView):
    def get(self, request, phone_number):
        try:
            vendor = Vendor.objects.get(phone_number=phone_number)
            return Response({'id': vendor.id,
                'last_name':vendor.last_name})
        except Vendor.DoesNotExist:
            return Response({'message': 'Vendor not found.'}, status=404)

