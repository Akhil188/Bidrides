import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './login/login.component';
import { CustLoginComponent } from './customerlogin/customerlogin.component';
import { VendorLoginComponent } from './vendorlogin/vendorlogin.component';
import { CtemppageComponent } from './ctemppage/ctemppage.component';
import { VtemppageComponent } from './vtemppage/vtemppage.component';
import { SigninComponent } from './signin/signin.component';

const routes: Routes = [
  { path: 'login', component: LoginFormComponent},
  { path: 'Signup', component: SigninComponent},
 { path: 'Customerlogin', component: CustLoginComponent},
  { path: 'Vendorlogin', component: VendorLoginComponent },
  { path: 'Ctemppage/:id', component: CtemppageComponent},
  { path: 'Vtemppage/:id', component: VtemppageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

