import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth'; // Funções modulares do Firebase Auth
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'; 
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null); 
  user$ = this.userSubject.asObservable(); 

  private firestore = getFirestore(); 


  constructor(private router: Router, private alertController: AlertController) {
    this.initializeAuthListener(); 
  }

  private initializeAuthListener() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        
        this.loadUserData(user);
      } else {
        
        this.userSubject.next(null);
      }
    });
  }

  
  
  async login(email: string, password: string): Promise<void> {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        this.loadUserData(user);
      }
    } catch (error: any) {
      console.error('Erro ao fazer login no Firebase', error);

      // Mostra um alerta personalizado baseado no código de erro
      let message = 'Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.';
      if (error.code === 'auth/invalid-credential') {
        message = 'Senha inválida. Por favor, tente novamente.';
      } else if (error.code === 'auth/user-not-found') {
        message = 'Usuário não encontrado. Verifique o e-mail e tente novamente.';
      }

      // Exibe o alerta usando AlertController
      const alert = await this.alertController.create({
        header: 'Erro de Login',
        subHeader: 'Não foi possível acessar sua conta',
        message: message,
        buttons: ['OK'],
      });

      await alert.present();
      throw error; // Opcional: propagar o erro, se necessário
    }
  }

  
  async register(nome: string, email: string, password: string, idade: number, peso: number, altura: number, genero: string) {
    const auth = getAuth();
    try {
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      
      const user = userCredential.user;

      
      const userRef = doc(this.firestore, 'users', user.uid); 
      
      
      await setDoc(userRef, {
        nome: nome,
        email: email,
        idade: idade,
        peso: peso,
        altura: altura,
        genero: genero,
        uid: user.uid,
      });

      
      this.loadUserData(user);

      return userCredential;
    } catch (error) {
      console.error('Erro ao registrar usuário', error);
      throw error;
    }
  }

  
  private async loadUserData(user: User) {
    const userDoc = doc(this.firestore, 'users', user.uid);
    const userData = await getDoc(userDoc);
    
    if (userData.exists()) {
      this.userSubject.next(userData.data()); 
    } else {
      console.log('Documento do usuário não encontrado no Firestore.');
    }
  }


  async logout() {
    const auth = getAuth();
    await signOut(auth); 
    this.userSubject.next(null); 
    this.router.navigate(['/login']); 
  }

  
}
