import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SitioModel } from '../models/sitio.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class SitioService {

  //Ruta donde está alojada la base de datos
  private url_servidor="http://localhost:3000/lugares";

  //Cliente http
  constructor(private _http:HttpClient) { }

  get_place(id:string): Observable<SitioModel>{
    let petition = this._http.get<SitioModel>(`${this.url_servidor}/${id}`);
    return petition;
  }

  get_all(): Observable<SitioModel[]>{
    let petition = this._http.get<SitioModel[]>(this.url_servidor);
    return petition;
  }

  edit_place(id:string, place: SitioModel): Observable<SitioModel>{
    let petition = this._http.put<SitioModel>(`${this.url_servidor}/${id}`, place);
    return petition;
  }

  add_place(place: SitioModel): Observable <SitioModel>{
    return this._http.post<SitioModel>(`${this.url_servidor}`, place);
  }

  delete_place(id: string): Observable<any> {
    return this._http.delete(`${this.url_servidor}/${id}`);
  }

  update_points(id:string, puntos: number){
    let puntuacion = this._http.patch<SitioModel>(`${this.url_servidor}/${id}`, {puntuacion:puntos});
    return puntuacion;
  }
}
