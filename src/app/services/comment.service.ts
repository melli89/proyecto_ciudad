import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CommentModel } from '../models/comment.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })

export class CommentService {

    private URL_API = 'http://localhost:3000/comentarios';

    constructor(private _http: HttpClient) { }
    
    get_comments(idSitio: string){
      let request = this._http.get<CommentModel[]>(`${this.URL_API}?id_sitio=${idSitio}`);
      return request;
    }

    get_user_comments(idUser: string, idSitio: string){
      return this._http.get<CommentModel[]>(`${this.URL_API}`).pipe(
        map(data => {
          let usuarioValido = data.find((comentario: CommentModel) => comentario.id_usuario === idUser && comentario.id_sitio == idSitio);
  
          return usuarioValido ? true : false;
        })
      );
    }

    create_comment(comentario: CommentModel) {
      return this._http.post<CommentModel>(`${this.URL_API}`, comentario);
    }
}