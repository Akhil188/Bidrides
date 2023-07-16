import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;
  loginError: string = '';

successMessage: string=''; // Variable to store the success message

  constructor(
    private _activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      role: ['customer', Validators.required],
      phone: ['', Validators.required],
      lastName:['', Validators.required],
    });
  }

  ngOnInit() { }


onSubmit() {
  if (this.loginForm.invalid) {
    return;
  }

  // Retrieve form values
  const role = this.loginForm.controls['role'].value;
  const phone = this.loginForm.controls['phone'].value;
  const lastName = this.loginForm.controls['lastName'].value;

  console.log(role, phone, lastName);

  // Make API call for login
  if (role === 'customer') {
    this.http.get('http://127.0.0.1:8000/customers/' + phone + '/')
      .subscribe(
        response => {
          let r = JSON.parse(JSON.stringify(response));
          console.log(r)
          // Check the response from the API
          if (r["id"] && r["lastname"] === lastName) {
            // Login successful
            console.log('Login successful.');
            this.successMessage = 'Login successful.';
            // Perform further actions (e.g., redirect to a dashboard page)
            const id = r['id'];
            console.log(id);
            this.router.navigate(['/Ctemppage', id]);
          } else {
            // Login failed
            console.log('Login failed.');
            this.loginError = 'Invalid phone number or last name for customer role.';
          }
        },
        error => {
          // Handle error
          console.error('Error occurred:', error);
          this.loginError = 'An error occurred during login.';
        }
      );
  } else if (role === 'vendor') {
    this.http.get('http://127.0.0.1:8000/vendors/' + phone + '/')
      .subscribe(
        response => {
          let r = JSON.parse(JSON.stringify(response));
          // Check the response from the API
          if (r["id"] && r["last_name"] === lastName) {
            // Login successful
            console.log('Login successful.');
            this.successMessage = 'Login successful.';
            // Perform further actions (e.g., redirect to a dashboard page)
            const id = r['id'];
            console.log(id);
            this.router.navigate(['/Vtemppage', id]);
          } else {
            // Login failed
            console.log('Login failed.');
            this.loginError = 'Invalid phone number or last name for vendor role.';
          }
        },
        error => {
          // Handle error
          console.error('Error occurred:', error);
          this.loginError = 'An error occurred during login.';
        }
      );
  }
}


}
