import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  
  email: string = '';
  password: string = '';
  passwordVisible: boolean = false;

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  
  constructor(
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router
  ) {}

  async login() {
    try {
      const userCredential = await this.authService.login(this.email, this.password);
      console.log('Usuário autenticado', userCredential);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Erro ao fazer login', error);
    }
  }

  async recsenha() {
    const alert = await this.alertController.create({
      header: 'Recuperar Senha',
      message: 'Por favor, insira o e-mail associado à sua conta.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Digite seu e-mail',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Enviar',
          handler: async (data) => {
            const email = data.email; // Captura o e-mail do input
            if (!email) {
              const errorAlert = await this.alertController.create({
                header: 'Erro',
                message: 'Por favor, insira um e-mail válido.',
                buttons: ['OK'],
              });
              await errorAlert.present();
              return;
            }
  
            try {
              await this.authService.recsenha(email);
              const successAlert = await this.alertController.create({
                header: 'Sucesso',
                message: 'Um e-mail para redefinir sua senha foi enviado.',
                buttons: ['OK'],
              });
              await successAlert.present();
            } catch (error) {
              console.error('Erro ao enviar e-mail de recuperação:', error);
            }
          },
        },
      ],
    });
  
    await alert.present();
  }
  
  
  
}
