import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})

export class SignUpService {
  private url_servidor="http://localhost:3000/usuarios";

  constructor(private _http:HttpClient) { }

  add_user(user:UserModel): Observable<UserModel>{
    let petition = this._http.post<UserModel>(this.url_servidor, user);
    return petition;
  }

  check_email(email: string): Observable<boolean> {
    return this._http.get<UserModel[]>(`${this.url_servidor}`).pipe(
      map(data => {
        // Encuentra el usuario válido
        let validUser = data.find((user: UserModel) => user.email === email);
        
        // Si el usuario es válido, devuelve el rol y el token; de lo contrario, devuelve un objeto vacío
        return validUser ? true : false;
      })
    );
  }
}