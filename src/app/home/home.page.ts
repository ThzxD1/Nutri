import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { NutritionService } from '../services/nutrition.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  user: any = {}; // Dados do usuário
  foodQuery: string = '';
  foodInfo: any = null;
  constructor(private nutritionService: NutritionService) {}
  
  searchFoodNutrients() {
    if (this.foodQuery.trim() !== '') {
      this.nutritionService.getNutrients(this.foodQuery).subscribe((data: any) => {
        this.foodInfo = data;
        console.log(data);
      }, error => {
        console.error(error);
      });
    }
  }
  ngOnInit() {
    this.loadUserData();
  }

  async loadUserData() {
    try {
      const auth = getAuth();
      const user = auth.currentUser; // Pega o usuário logado
      console.log('UID do usuário logado:', user?.uid); // Log do UID do usuário

      if (user) {
        const firestore = getFirestore();
        const userRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          this.user = userDoc.data(); // Define os dados do usuário
          console.log('Dados do usuário encontrados:', this.user);
        } else {
          console.log('Não foi encontrado dados do usuário no Firestore');
        }
      } else {
        console.log('Nenhum usuário logado');
      }
    } catch (error) {
      console.error('Erro ao carregar os dados do usuário', error);
    }
  }
}
