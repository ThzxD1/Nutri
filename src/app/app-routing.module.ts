import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'recipes',
    loadChildren: () => import('./recipes/recipes.module').then( m => m.RecipesPageModule)
  },
  { path: 'recipe-detail/:id', loadChildren: () => import('./recipe-detail/recipe-detail.module').then(m => m.RecipeDetailPageModule) },
  {
    path: 'nutri',
    loadChildren: () => import('./nutri/nutri.module').then( m => m.NutriPageModule)
  },
  {
    path: 'alarms',
    loadChildren: () => import('./alarms/alarms.module').then( m => m.AlarmsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
