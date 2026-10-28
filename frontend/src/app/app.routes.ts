import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'articulo',
    loadComponent: () => import('./pages/article/article.component').then(m => m.ArticleComponent)
  },
  {
    path: 'diccionario',
    loadComponent: () => import('./pages/dictionary/dictionary.component').then(m => m.DictionaryComponent)
  },
  {
    path: 'modelos',
    loadComponent: () => import('./pages/models/models.component').then(m => m.ModelsComponent)
  },
  { path: '**', redirectTo: '' }
];
