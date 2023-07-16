import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
declare const google: any;

interface Vendor {
  id: number;
bid_value: number;
  v_phone_number: string;
  c_Id: number;
  v_id:number;
  status: string;
   
}
@Component({
  selector: 'app-ctemppage',
  templateUrl: './ctemppage.component.html',
  styleUrls: ['./ctemppage.component.css']
})
export class CtemppageComponent implements OnInit {
   apiKey = 'AIzaSyAmm-W7-HamjOGZKfjsJ5-O1jGaErjbl14';
  customerForm: FormGroup;
  vendorsdata: FormGroup;
  editMode: boolean = false;
  vendors: Vendor[] = [];
addressValidation: string = '';
dropOffLocationValidation: string = '';
distance: string='';
duration: string='';

  constructor(private http: HttpClient,private route: ActivatedRoute,private router: Router, private mapsAPILoader: MapsAPILoader ) {
    this.customerForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      phone_number: new FormControl('', [Validators.required]),
      pickup_location: new FormControl('', [Validators.required]),
      drop_off_location: new FormControl('', [Validators.required]),
      time_of_pickup: new FormControl('', [Validators.required])
    });this.vendorsdata = new FormGroup({});
  }

ngOnInit() {
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    console.log('id:', id);
    if (id != null) {
      this.fetchCustomerData(id);
    }
    
  });
    this.loadGoogleMapsAPI();
  }

  loadGoogleMapsAPI() {
    this.mapsAPILoader.load().then(() => {
      // Google Maps API loaded
      this.initializeAddressValidation();
    });
  }

    initializeAddressValidation() {
    const addressControls = ['pickup_location', 'drop_off_location'];
    addressControls.forEach((controlName) => {
      const addressControl = this.customerForm.get(controlName);
      if (addressControl) {
        addressControl.valueChanges.subscribe(() => {
          this.validateAddress(controlName);
        });
      }
    });
  }
    validateAddress(controlName: string) {
    if (controlName === 'pickup_location'){
    const addressControl = this.customerForm.get(controlName);
    if (addressControl) {
      const address = addressControl.value;
      // Rest of your address validation code
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': address }, (results: any[], status: string) => {
         if (status === google.maps.GeocoderStatus.OK || status === 'OK') {
      // Address is valid
      this.addressValidation = 'pickup_location is valid!';
    } else {
      // Address is invalid
      this.addressValidation = 'pickup_location is invalid!';
    }
      });
    }}
        if (controlName === 'drop_off_location'){
           const addressControl = this.customerForm.get(controlName);
    if (addressControl) {
      const address = addressControl.value;
      // Rest of your address validation code
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': address }, (results: any[], status: string) => {
         if (status === google.maps.GeocoderStatus.OK || status === 'OK') {
      // Address is valid
      this.dropOffLocationValidation = 'drop_off_location is valid!';
    } else {
      // Address is invalid
      this.dropOffLocationValidation = 'drop_off_location is invalid!';
    }
      });
    }
        }

  }
rejectBid(cId: number, vId: number){
  
const data={ "status":"rejected"
}
this.http.put('http://127.0.0.1:8000/bids/' + cId + '/' + vId+'/',data).subscribe(
    (res: any) => {
      console.log(res);});

}
acceptBid(cId: number, vId: number){
 
  const data={ "status":"accepted"
}
this.http.put('http://127.0.0.1:8000/bids/' + cId + '/' + vId+'/',data).subscribe(
    (res: any) => {
      console.log(res);});


}
 populateForm() {
     this.vendors.forEach((vendor, index) => {
      this.vendorsdata.addControl('phone_number' + index, new FormControl(vendor.v_phone_number));
      this.vendorsdata.addControl('bidValue' + index, new FormControl(vendor.bid_value));
      this.vendorsdata.addControl('c_id' + index, new FormControl(vendor.c_Id));
      this.vendorsdata.addControl('v_id' + index, new FormControl(vendor.v_id));
      this.vendorsdata.addControl('status' + index, new FormControl(vendor.status));
    });
  }
fetchCustomerData(id: string) {
  console.log(id)
  // Perform API call to fetch customer data and populate the form
   this.http.get<Vendor[]>('http://127.0.0.1:8000/bids/customer/'+id+'/')
      .subscribe((response: Vendor[]) => {
        console.log(response)
        this.vendors = response;
        this.populateForm();
      }, (error) => {
        console.log('Error fetching customers:', error);
      });

  this.http.get('http://127.0.0.1:8000/customers/' + id).subscribe(
    (res: any) => {
      
      this.distance =res.distance
      this.duration=res.duration
      console.log(res,this.distance,this.duration)
      const customerData = res;
      this.customerForm.patchValue(customerData);

});
}



  edit() {
    this.editMode = true;
  }

  save() {
    if (this.customerForm.valid) {
      const customerData = this.customerForm.value;
      console.log(customerData);
      const customerId = this.customerForm?.get('id')?.value;
      console.log(customerId)
    if (customerId) {

      // Perform API call to update the customer details in the database
      this.http.put('http://127.0.0.1:8000/customers/'+customerId, customerData).subscribe(
        res => {
          console.log(res);
          // Handle success (e.g., display success message to the user)
          this.editMode = false;
        },
        error => {
          console.error(error);
          // Handle error (e.g., display error message to the user)
        }
      );
    }}
     else {
      this.customerForm.markAllAsTouched();
    }
  }
cancel() {
  const customerId = this.customerForm?.get('id')?.value;
  if (customerId) {
    // Perform API call to delete the customer data from the database
    this.http.delete(`http://127.0.0.1:8000/customers/${customerId}`).subscribe(
      res => {
        console.log(res);
        // Handle success (e.g., display success message to the user)
      },
      error => {
        console.error(error);
        // Handle error (e.g., display error message to the user)
      }
    );this.router.navigate(['/Customerlogin']);
  } else {
    // Handle the case when the form, id control, or id value is null
  }
}

}

