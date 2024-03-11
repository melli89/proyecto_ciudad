import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  email: string = "";
  isAdmin: boolean = false;
  nombre: string = "";

  constructor (private _cookieService: CookieService, private _router: Router, private _sharedService: SharedService){}

  ngOnInit(){
    this.getLoggedFirstName();
  }

  // Si hay token en una cooki, devuelve true y guarda el nombre de usuario. Si no, devuelve false
  getLoggedFirstName(): boolean {

    // Lee el token de la cookie y extrae el nombre de usuario
    let token: string = this._cookieService.get('token');  
    
    if (!token)
      return false;
    else
    {
      let tokenPayload = JSON.parse(atob(token.split('.')[1]));
      this.email = tokenPayload.email;
      this.nombre = tokenPayload.nombre;

      if (tokenPayload.tipo_usuario === "admin"){
        this.isAdmin = true;
      }else if(tokenPayload.tipo_usuario === "usuario"){
        this.isAdmin = false;

      }
      
      return true;
    }
  }

  // Elimina la cookie y muestra la página de Inicio
  logout(){
    this._cookieService.delete('token');   
    this._router.navigate(['/home']); 
    this._sharedService.openSnackBar("La sesión se ha cerrado correctamente.");
  }

}
