import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './login/login.component';
import { CustLoginComponent } from './customerlogin/customerlogin.component';
import { VendorLoginComponent } from './vendorlogin/vendorlogin.component';
import { HttpClientModule } from '@angular/common/http';
import { CtemppageComponent } from './ctemppage/ctemppage.component';
import { VtemppageComponent } from './vtemppage/vtemppage.component';
import { SigninComponent } from './signin/signin.component';
import { AgmCoreModule } from '@agm/core';



@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    CustLoginComponent,
  VendorLoginComponent,
  CtemppageComponent,
  VtemppageComponent,
  SigninComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAmm-W7-HamjOGZKfjsJ5-O1jGaErjbl14'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

