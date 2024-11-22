import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';  
import { environment } from 'src/environments/environment'; 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),  
    AngularFireAuthModule,  
    AngularFirestoreModule, 
  ],
  declarations: [LoginPage],
})
export class LoginPageModule {}
