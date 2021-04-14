import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { AuthGuard } from './auth/auth.guard';
import { CreateUserComponent } from './auth/create-user/create-user.component';
import { LoginComponent } from './auth/login/login.component';
import { GameComponent } from './game/game/game.component';
import { GamesComponent } from './game/games/games.component';

const routes: Routes = [
  { 
    path: '', 
    component: GamesComponent,
    canActivate: [AuthGuard] 
  },
  { 
    path: 'game/:id', 
    component: GameComponent,
    canActivate: [AuthGuard] 
  },
  { path: 'login', component: LoginComponent },
  { path: 'createUser', component: CreateUserComponent },
  // { path: 'second-component', component: SecondComponent },
  // { path: '',   redirectTo: '/first-component', pathMatch: 'full' }, // redirect to `first-component`
  // { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }