//internal modules**
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

//custom modules**
import { OutbondInterceptor, RefreshTokenInterceptor } from "./libs/security/interceptors";

//COMPONENTS---
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    //outbond interceptor----------
    { provide: HTTP_INTERCEPTORS, useClass: OutbondInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
