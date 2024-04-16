import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearnComponent } from './pages/learn/learn.component'
import { LoginComponent } from './pages/login/login.component'
import { HomeComponent } from './pages/home/home.component';
import { AppLayoutComponent } from './pages/app-layout/app-layout/app-layout.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  {path: '', component: LearnComponent},
  {path: 'login', component: LoginComponent},
  {path: 'learn', component: AppLayoutComponent, 
  children: [
    {path: ':id', component: LearnComponent},
    {path: '', component: HomeComponent},
  ]},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
