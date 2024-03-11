import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PlaceComponent } from './place/place.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './log-in/log-in.component';
import { ListPlacesComponent } from './list-places/list-places.component';

const routes: Routes = [ 
  {path:"home", component:HomeComponent},
  {path:"place/:id", component:PlaceComponent},
  {path:"sign-up", component:SignUpComponent},
  {path:"log-in", component:LoginComponent},
  {path:"list-places", component:ListPlacesComponent},
  {path: "", redirectTo:"home", pathMatch:"full"},
  {path:"**", redirectTo:"home", pathMatch:"full"}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
