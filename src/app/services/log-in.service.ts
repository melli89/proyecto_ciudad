import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UserModel } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private URL_API = 'http://localhost:3000/usuarios';

  constructor(private _http: HttpClient) { }  

  loginUser(email: string, password: string): Observable<{ role: string, token: string } | {}> {
    return this._http.get<UserModel[]>(`${this.URL_API}`).pipe(
      map(data => {
        // Encuentra el usuario válido
        let validUser = data.find((user: UserModel) => user.email === email && JSON.parse(atob(user.contrasena.split('.')[1])).contrasena === password);
        
        // Si el usuario es válido, devuelve el rol y el token; de lo contrario, devuelve un objeto vacío
        return validUser ? { role: validUser.tipo_usuario, token: validUser.contrasena } : {};
      })
    );
  }
}