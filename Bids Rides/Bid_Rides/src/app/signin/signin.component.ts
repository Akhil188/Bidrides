import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

    loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,private router: Router) { this.loginForm = this.formBuilder.group({
      userType: ['', Validators.required]
    });}

  ngOnInit() {
   
  }


  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
 console.log(this.loginForm.value.userType);
    const userType = this.loginForm.value.userType;
    // Redirect to the appropriate page based on user selection
    if (userType === 'customer') {
      this.router.navigate(['/Customerlogin']);
    } else if (userType === 'vendor') {
      this.router.navigate(['/Vendorlogin']);
    }
  }

}






