import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { concatMap } from 'rxjs/operators';
import {  EMPTY } from 'rxjs';
import { from, Observable, of } from 'rxjs';
import { catchError, mergeMap, toArray } from 'rxjs/operators';

declare const google: any;

interface Customer {
  id: number;
  pickup_location: string;
  drop_off_location: string;
  time_of_pickup: string;
  phone_number: string;
}
@Component({
  selector: 'app-vtemppage',
  templateUrl: './vtemppage.component.html',
  styleUrls: ['./vtemppage.component.css']
})
export class VtemppageComponent implements OnInit {
  i: number=0;
   vendorForm: FormGroup;
  vendor1Form: FormGroup;
  customers: Customer[] = [];
  editMode: boolean = false;
  bidValues: any[] = [];
  c_phone:any[]=[];
status: any[] = [];
 addressValidation: string = '';
 distance: any[]=[];
duration: any[]=[];
vdistance: any[]=[];
vduration: any[]=[];
response: any;
errorMessage: string='';
successMessage: string='';



  constructor(private http: HttpClient,private formBuilder: FormBuilder,private route: ActivatedRoute,private router: Router,private mapsAPILoader: MapsAPILoader,) { this.vendorForm = this.formBuilder.group({
    id:['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone_number: ['', Validators.required],
      driving_license_number: ['', Validators.required],
      location: ['', Validators.required],
    });
 this.vendor1Form = new FormGroup({});}

  ngOnInit() {
    this.initForm();
    this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    console.log('id:', id);
    if (id != null) {
      this.fetchVendorData(id);
    }
  });
    this.fetchCustomers()
   this.loadGoogleMapsAPI();
  }

  loadGoogleMapsAPI() {
    this.mapsAPILoader.load().then(() => {
      // Google Maps API loaded
      this.initializeAddressValidation();
    });
  }

  initializeAddressValidation() {
    const addressControls = ['location'];
    addressControls.forEach((controlName) => {
      const addressControl = this.vendorForm.get(controlName);
      if (addressControl) {
        addressControl.valueChanges.subscribe(() => {
          this.validateAddress(controlName);
        });
      }
    });
  }
  validateAddress(controlName: string) {
    
    const addressControl = this.vendorForm.get(controlName);
    if (addressControl) {
      const address = addressControl.value;
      // Rest of your address validation code
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': address }, (results: any[], status: string) => {
         if (status === google.maps.GeocoderStatus.OK || status === 'OK') {
      // Address is valid
      this.addressValidation = 'location is valid!';
    } else {
      // Address is invalid
      this.addressValidation = 'location is invalid!';
    }
      });
    }}

  handleClick(index: number) {
    const bidValue = this.vendor1Form.get('bidValue' + index)?.value;
    const phone = this.vendor1Form.get('phone_number' + index)?.value;
    const id =this.vendor1Form.get('id' + index)?.value;
    const vid=this.vendorForm.get('id')?.value;
    const vphone=this.vendorForm.get('phone_number')?.value;
    const data={ "c_Id" : id,
    "c_phone_number":phone,
    "v_id":vid,
    "bid_value" : bidValue,
    "v_phone_number": vphone};
    console.log(bidValue, phone, id, vid);
 this.http.get('http://127.0.0.1:8000/bids/' + id + "/" + vid + "/").subscribe(
    (res: any) => {
      console.log(res);
      let r = JSON.parse(JSON.stringify(res));

      if (r["id"]) {
        this.http.put('http://127.0.0.1:8000/bids/' + r["id"] + "/", data).subscribe(
          (res1: any) => {
            console.log(res1);
            this.response = res1;
            this.successMessage = 'Bid updated successfully.';
            this.errorMessage = '';
          },
          error => {
            console.error(error);
            this.errorMessage = 'Failed to update bid. Please try again.';
            this.successMessage = '';
          }
        );
      } else {
        this.http.post('http://127.0.0.1:8000/bids/', data).subscribe(
          (res: any) => {
            console.log(res);
            this.response = res;
            this.successMessage = 'Bid created successfully.';
            this.errorMessage = '';
          },
          error => {
            console.error(error);
            this.errorMessage = 'Failed to create bid. Please try again.';
            this.successMessage = '';
          }
        );
      }
    },
    error => {
      console.error(error);
      this.errorMessage = 'Failed to fetch bid details. Please try again.';
      this.successMessage = '';
    }
  );

  // Perform actions with the bidValue
}



  fetchVendorData(id: string) {
  // Perform API call to fetch customer data and populate the form

  this.http.get('http://127.0.0.1:8000/vendors/' + id).subscribe(
    (res: any) => {
      console.log(res)
      const vendorData = res;
      this.vendorForm.patchValue(vendorData);
    },
    error => {
      console.error(error);
      // Handle error (e.g., display error message to the user)
    }
  );
}

  initForm() {
   
  }

  fetchCustomers() {
    this.http.get<Customer[]>('http://127.0.0.1:8000/customers/')
      .subscribe((response: Customer[]) => {
        console.log(response)
        this.customers = response;
        this.populateForm();
      }, (error) => {
        console.log('Error fetching customers:', error);
      });
  }

  edit() {
    this.editMode = true;
  }
 parseDistance(distance: string): number {
  if (distance) {
    const numericDistance = parseFloat(distance.replace(/[^\d.]/g, ''));
    return numericDistance;
  }
  return 0; // Return a default value or handle the case when distance is undefined
}



populateForm() {
  const vendorId = this.vendorForm.get('id')?.value;

  const observables: Observable<any>[] = []; // Declare observables array

  this.customers.forEach((customer, index) => {
    console.log(index);
    const id = customer.id;

    const bidObservable = this.http.get('http://127.0.0.1:8000/bids/' + id + '/' + vendorId + '/');
    observables.push(bidObservable);

    this.vendor1Form.addControl('pickupLocation' + index, new FormControl(customer.pickup_location));
    this.vendor1Form.addControl('dropOffLocation' + index, new FormControl(customer.drop_off_location));
    this.vendor1Form.addControl('id' + index, new FormControl(customer.id));
    this.vendor1Form.addControl('phone_number' + index, new FormControl(customer.phone_number));
    this.vendor1Form.addControl('time' + index, new FormControl(customer.time_of_pickup));
    this.vendor1Form.addControl('bidValue' + index, new FormControl());
  });

  from(observables)
    .pipe(
      mergeMap((observable: Observable<any>) =>
        observable.pipe(
          catchError((error: any) => {
            console.error('Error occurred:', error);
            // Handle the error appropriately
            return of(null); // or any other observable to continue the sequence
          })
        )
      ),
      toArray() // Collect all the responses into an array
    )
    .subscribe(
      async (responses: any[]) => {
        const apiResponses: any[] = [];

        for (let i = 0; i < responses.length; i += 1) {
          const bidResponse = responses[i];
          apiResponses.push(bidResponse);
        }

        for (let i = 0; i < apiResponses.length; i += 1) {
          const bidResponse = apiResponses[i];
          console.log('Response:', bidResponse);

          const dataIndex = Math.floor(i / 1);
          console.log('dataIndex:', dataIndex);

          if (bidResponse) {
            this.duration[dataIndex] = bidResponse.duration;
            this.distance[dataIndex] = bidResponse.distance;
            this.vduration[dataIndex] = bidResponse.vduration;
            this.vdistance[dataIndex] = bidResponse.vdistance;
            this.bidValues[dataIndex] = bidResponse.bid_value;
            this.status[dataIndex] = bidResponse.status;
            this.c_phone[dataIndex] = bidResponse.c_phone_number;
            console.log('bidValues:', this.bidValues[dataIndex], 'status:', this.status[dataIndex], 'c_phone:', this.c_phone[dataIndex]);
          } else {
            this.bidValues[dataIndex] = undefined;
            this.status[dataIndex] = undefined;
            this.c_phone[dataIndex] = undefined;
            console.log('bidValues:', this.bidValues[dataIndex], 'status:', this.status[dataIndex], 'c_phone:', this.c_phone[dataIndex]);
          }
        }
      },
      error => {
        console.error('Error occurred:', error);
        // Handle the error appropriately
      }
    );
}







save() {
  if (this.vendorForm.valid) {
    const vendorData = this.vendorForm.value;
    console.log(vendorData);
    const vendorId = this.vendorForm.get('id')?.value;
    console.log(vendorId);

    if (vendorId) {
      // Perform API call to update the customer details in the database
      this.http.put('http://127.0.0.1:8000/vendors/' + vendorId, vendorData).subscribe(
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
    }
  } else {
    this.vendorForm.markAllAsTouched();
  }
}


  cancel() {
  const vendorId = this.vendorForm?.get('id')?.value;
  if (vendorId) {
    // Perform API call to delete the customer data from the database
    this.http.delete(`http://127.0.0.1:8000/vendors/${vendorId}`).subscribe(
      res => {
        console.log(res);
        // Handle success (e.g., display success message to the user)
      },
      error => {
        console.error(error);
        // Handle error (e.g., display error message to the user)
      }
    );
    this.router.navigate(['/Vendorlogin']);
  } else {
    // Handle the case when the form, id control, or id value is null
  }
}
}



