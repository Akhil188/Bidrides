from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Bid
from rest_framework import serializers
from django.http import Http404
from rest_framework.exceptions import NotFound
from customer.models import Customer
import requests
from vendor.models import Vendor
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

class BidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bid
        fields = '__all__'

class BidList(APIView):
    def get(self, request):
        bids = Bid.objects.all()
        serializer = BidSerializer(bids, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BidSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class BidDetail(APIView):
    def get_object(self, pk):
        try:
            return Bid.objects.get(pk=pk)
        except Bid.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        bid = self.get_object(pk)
        serializer = BidSerializer(bid)
        return Response(serializer.data)

    def put(self, request, pk):
        bid = self.get_object(pk)
        serializer = BidSerializer(bid, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        bid = self.get_object(pk)
        bid.delete()
        return Response(status=204)

class BidDetail2(APIView):
    def get_object(self, c_id, v_id):
        try:
            return Bid.objects.get(c_Id=c_id, v_id=v_id)
        except Bid.DoesNotExist:

            bid_data = {
                'c_Id': c_id,
                'v_id': v_id,
            }
            return Bid(**bid_data)
    def calculate_distance(self, origin, destination):
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

    def get(self, request, c_id, v_id):
        try:
            bid = self.get_object(c_id, v_id)
            customer = Customer.objects.get(id=c_id)
            vendor=Vendor.objects.get(id=v_id)
            origin = customer.pickup_location
            destination = customer.drop_off_location
            vorigin=vendor.location

            # Calculate the distance and duration
            distance, duration = self.calculate_distance(origin, destination)
            vdistance,vduration=self.calculate_distance(vorigin,origin)

            # Serialize the bid object along with the distance and duration
            serializer = BidSerializer(bid)
            response_data = serializer.data.copy()
            response_data['distance'] = distance
            response_data['duration'] = duration
            response_data['vdistance'] = vdistance
            response_data['vduration'] = vduration

            return Response(response_data)
        except NotFound as e:
            return Response(str(e), status=404)


    def put(self, request, c_id, v_id):
        bid = self.get_object(c_id, v_id)
        serializer = BidSerializer(bid, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(status=request.data.get('status'))
            return Response(serializer.data)
        return Response(serializer.errors, status=400)




class BidRetrieveByCId(APIView):
    def get(self, request, c_id):
        bids = Bid.objects.filter(c_Id=c_id)
        serializer = BidSerializer(bids, many=True)
        return Response(serializer.data)

class BidRetrieveByVId(APIView):
    def get(self, request, v_id):
        bids = Bid.objects.filter(v_Id=v_id)
        serializer = BidSerializer(bids, many=True)
        return Response(serializer.data)
