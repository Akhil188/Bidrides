import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';

declare const google: any;

@Component({
  selector: 'app-customerlogin',
  templateUrl: './customerlogin.component.html',
  styleUrls: ['./customerlogin.component.css']
})
export class CustLoginComponent implements OnInit {
  apiKey = 'AIzaSyAmm-W7-HamjOGZKfjsJ5-O1jGaErjbl14';
  customerForm: FormGroup;
  addressValidation: string = '';
  dropOffLocationValidation: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private mapsAPILoader: MapsAPILoader) {
    this.customerForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      phone_number: new FormControl('', [Validators.required]),
      pickup_location: new FormControl('', [Validators.required]),
      drop_off_location: new FormControl('', [Validators.required]),
      time_of_pickup: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
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
    if (controlName === 'pickup_location') {
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
      }
    }
    if (controlName === 'drop_off_location') {
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

  get firstname() { return this.customerForm.get('firstname'); }
  get lastname() { return this.customerForm.get('lastname'); }
  get phone_number() { return this.customerForm.get('phone_number'); }
 
  get pickup_location() { return this.customerForm.get('pickup_location'); }
  get drop_off_location() { return this.customerForm.get('drop_off_location'); }
  get time_of_pickup() { return this.customerForm.get('time_of_pickup'); }
  get formControls() {
    return this.customerForm.controls;
  }

  onSubmit() {
    if (this.customerForm.valid) {
      const customerData = this.customerForm.value;
      console.log(customerData);
      const phone = this.customerForm.controls['phone_number'].value;

      this.http.get('http://127.0.0.1:8000/customers/' + phone + '/').subscribe(
        response => {
          let r = JSON.parse(JSON.stringify(response));
          if (r["id"]) {
            console.log('User exists');
            // Perform further actions (e.g., redirect to a dashboard page)
            const id = r['id'];
            this.router.navigate(['/dashboard', id]);
          } else {
            console.log('User does not exist');
        
          }
        },
        error => {    this.http.post('http://127.0.0.1:8000/customers/', customerData).subscribe(
              res => {
                let r = JSON.parse(JSON.stringify(res));
                if (r.id) {
                  const id = r.id;
                  this.successMessage = 'Registration successful!';
                  this.router.navigate(['/Ctemppage', id]);
                } else {
                  this.errorMessage = 'Registration failed. Please try again.';
                }
                console.log(res);
              },
              error => {
                console.error('Error occurred:', error);
                this.errorMessage = 'Registration failed. Please try again.';
              }
            );
          console.error('Error occurred:', error);
          this.errorMessage = 'An error occurred while checking user existence.';
        }
      );
    } else {
      this.customerForm.markAllAsTouched();
    }
  }
}




