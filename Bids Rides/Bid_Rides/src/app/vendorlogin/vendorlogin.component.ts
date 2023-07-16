import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';

declare const google: any;
@Component({
  selector: 'app-vendorlogin',
  templateUrl: './vendorlogin.component.html',
  styleUrls: ['./vendorlogin.component.css']
})

export class VendorLoginComponent implements OnInit {
  vendorForm: FormGroup;
 addressValidation: string = '';
  constructor(
    private formBuilder: FormBuilder,private mapsAPILoader: MapsAPILoader,
    private http: HttpClient,private router: Router
  ) {   this.vendorForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone_number: ['', Validators.required],
      driving_license_number: ['', Validators.required],
      location: ['', Validators.required],
    });}

  ngOnInit() {
    this.initializeForm();
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
  initializeForm() {
 
  }

  get formControls() {
    return this.vendorForm.controls;
  }

  onSubmit() {
    if (this.vendorForm.valid) {
      const phone = this.vendorForm.controls['phone_number'].value;
      const vendorData = this.vendorForm.value;
      console.log(vendorData);
       this.http.get('http://127.0.0.1:8000/vendors/'+phone+'/' )
      .subscribe(
        response => {
          let r = JSON.parse(JSON.stringify(response))
          // Check the response from the API
          if (r["id"]) {
            console.log('user exists');
            // Perform further actions (e.g., redirect to a dashboard page)
            const id = r['id'];
          } else {
             // Perform API call to submit the vendor details to the database
    
           }
        },
        error => {
          // Handle error
            this.http.post('http://127.0.0.1:8000/vendors/', vendorData).subscribe(res => {
        let r = JSON.parse(JSON.stringify(res))
        //console.log(r.meta.otpReferId)
        console.log(res)
        const id = r['id'];
      this.router.navigate(['/Vtemppage',id]);
      });
          console.error('Error occurred:', error);
          // Perform further error handling (e.g., display an error message)
        }
      );
     
       
     
    } else {
      this.vendorForm.markAllAsTouched();
    }
  }
}
