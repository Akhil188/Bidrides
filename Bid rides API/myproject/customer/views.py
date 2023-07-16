from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Customer
from rest_framework import serializers
from django.http import Http404
import requests
from django.utils import timezone
from datetime import timedelta
from bids.models import Bid





def calculate_distance(origin, destination):
    # Replace YOUR_API_KEY with your actual Google Maps API key
    api_key = 'AIzaSyAmm-W7-HamjOGZKfjsJ5-O1jGaErjbl14'
    
    # Construct the URL for the API request
    url = f'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins={origin}&destinations={destination}&key={api_key}'

    # Send the API request
    response = requests.get(url)
    data = response.json()

    # Extract the distance and duration values
    try:
        distance = data['rows'][0]['elements'][0]['distance']['text']
        duration = data['rows'][0]['elements'][0]['duration']['text']
    except (KeyError, IndexError):
        # Handle any potential errors with the API response
        distance = 'N/A'
        duration = 'N/A'

    # Return the distance and duration as a tuple
    return distance, duration





class CustomerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Customer
        fields = '__all__'



   
class CustomerList(APIView):
    def get(self, request):
        current_time = timezone.now()
        customers_to_delete = Customer.objects.filter(time_of_pickup__lt=current_time)
        serializer_delete = CustomerSerializer(customers_to_delete, many=True)

        for customer in customers_to_delete:
            # Delete corresponding bids
            bids = Bid.objects.filter(c_Id=customer.id)
            bids.delete()

            # Delete customer
            customer.delete()

        customers = Customer.objects.all()
        serializer = CustomerSerializer(customers, many=True)

        return Response(serializer.data)


    def post(self, request):
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)



class CustomerDetail(APIView):
    def get_object(self, pk):
        try:
            return Customer.objects.get(pk=pk)
        except Customer.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        customer = self.get_object(pk)

        current_time = timezone.now()
        pickup_time = customer.time_of_pickup
        print(current_time)

        if pickup_time > current_time - timedelta(hours=7):
            serializer = CustomerSerializer(customer)
            pickup_location = serializer.data['pickup_location']
            drop_off_location = serializer.data['drop_off_location']
            distance, duration = calculate_distance(pickup_location, drop_off_location)
            
            if distance is not None and duration is not None:
                response_data = serializer.data.copy()
                response_data['distance'] = distance
                response_data['duration'] = duration

            return Response(response_data)

        # Check if pickup time is at least a few hours in the past
        if pickup_time <= current_time - timedelta(hours=7):
            # Delete the customer if pickup time has expired
            customer.delete()
            return Response({'message': 'Customer has been deleted.'}, status=404)

        return Response({'message': 'Pickup time has not yet passed.'}, status=400)

    def put(self, request, pk):
        customer = self.get_object(pk)
        serializer = CustomerSerializer(customer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        customer = self.get_object(pk)
        customer.delete()
        return Response(status=204)

class CustomerID(APIView):
    def get(self, request, phone_number):
        try:
            customer = Customer.objects.get(phone_number=phone_number)
            return Response({'id': customer.id,
                'lastname':customer.lastname})
        except Customer.DoesNotExist:
            return Response({'message': 'Customer not found.'}, status=404)
class CustomerDistance(APIView):
    def get_object(self, pk):
        try:
            return Customer.objects.get(pk=pk)
        except Customer.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        customer = self.get_object(pk)
        serializer = CustomerSerializer(customer)

        vendor_location = request.query_params.get('vendor_location')  # Get the vendor location from query parameters
        pickup_location = serializer.data['pickup_location']

        distance = calculate_distance(pickup_location, vendor_location)
        if distance is not None:
            response_data = serializer.data.copy()
            response_data['distance_to_vendor'] = distance
            return Response(response_data)

        return Response(serializer.data) 

    
