import { Component, OnInit } from '@angular/core';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { CohereClientV2 } from 'cohere-ai';
import { AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nutri',
  templateUrl: './nutri.page.html',
  styleUrls: ['./nutri.page.scss'],
})
export class NutriPage implements OnInit {
  user: any = {}; 
  foodQuery: string = '';
  foodInfo: any = null;
  question: string = '';

  constructor(
    private alertController: AlertController,
    private router: Router,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

 
  async loadUserData() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const firestore = getFirestore();
        const userRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          this.user = userDoc.data(); 
          console.log('Dados do usuário carregados:', this.user);
        } else {
          console.warn('Nenhum dado encontrado para o usuário no Firestore');
        }
      } else {
        console.warn('Usuário não está logado.');
        this.router.navigate(['/login']); 
      }
    } catch (error) {
      console.error('Erro ao carregar os dados do usuário:', error);
    }
  }


  logout() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log('Usuário deslogado com sucesso.');
        this.router.navigate(['/login']); 
      })
      .catch((error) => {
        console.error('Erro ao deslogar:', error);
      });
  }

 
  submit() {
    console.log('Pergunta enviada:', this.question);

    const cohere = new CohereClientV2({
      token: 'H18FZBiFr2OVCFnYfkBcFZ88vByi146XwjXkInZX', 
    });

    cohere
      .chat({
        model: 'command-r-plus',
        messages: [
          {
            role: 'user',
            content: this.question,
          },
        ],
      })
      .then((response: any) => {
        console.log('Resposta da API:', response);
        this.showAnswer(response);
      })
      .catch((error) => {
        console.error('Erro na requisição para a API:', error);
      });
  }

  
  async showAnswer(response: any) {
    const responseText =
      response?.message?.content?.[0]?.text || 'Nenhuma resposta encontrada.';

    const alert = await this.alertController.create({
      header: 'Resposta da API',
      subHeader: 'Resultado da consulta',
      message: responseText,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
