import { Component, OnInit } from '@angular/core';
import { SitioService } from '../services/sitio.service';
import { SitioModel } from '../models/sitio.model';
import { ActivatedRoute } from '@angular/router';
import { CommentService } from '../services/comment.service';
import { CommentModel } from '../models/comment.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { SharedService } from '../shared/shared.service';


@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.css']
})

//Implementamos el método Oninit que se ejecuta cuando se inicia el componente.
export class PlaceComponent implements OnInit{
  sitios_info!: SitioModel;
  list_comments:CommentModel[] = [];
  puntuaciones = [1,2,3,4,5];
  commentForm: FormGroup;
  id_user:string = "";
  apellidos_usuario:string = "";
  nombre_usuario:string = "";
  sitio:SitioModel | null = null;
  isAdmin: boolean = false;
  login:boolean = false;
  puntos:number = 0;
  lugarSubscription: Subscription | undefined;
  puedeValorar: boolean = true;
  puntuacion: string = "";
  suma: number = 0;
  cantidad: number = 0;
  

  constructor(private fb: FormBuilder,private _sitio_service:SitioService,private _sharedService: SharedService, private _route:ActivatedRoute, private _comment_service:CommentService, private _cookieService:CookieService){
    this.commentForm = this.fb.group({
      puntuacion: ['', Validators.required],
      textArea: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    let place_id = this._route.snapshot.paramMap.get("id");
    if (place_id){
      this._sitio_service.get_place(place_id).subscribe({
        next: (data:any)=>{
          this.sitios_info = data;
          this.login = this.user_session();
          this.display_comments()
          this.verify_opinion();
        },
        complete: () => {console.log(this.sitios_info.id), console.log(this.id_user),console.log(this.puedeValorar)},
        error: console.log
      })
    }
  }

  zoom(direccion:any): void{
      
    let mainImg = document.getElementById("main_image");
    mainImg?.setAttribute("src", direccion);
  }

  display_comments():void{
    if (this.sitios_info){
      let proceso = this._comment_service.get_comments(this.sitios_info?.id).subscribe({
        next: (val: any) => {
          console.log(val);
          this.list_comments = val;

        },
        complete: () => {proceso.unsubscribe()},
        error: console.log
      })
    }   
  }

  
  submitCommentForm(){
    if (this.commentForm.valid){
      
      let commentData: CommentModel = new CommentModel(
        this.id_user,
        this.sitios_info?.id,
        this.nombre_usuario,
        this.apellidos_usuario,
        this.commentForm.value.puntuacion,
        this.commentForm.value.textArea
      );

      const subscripcion = this._comment_service.create_comment(commentData).subscribe({
        next: (val: any) => {
          this._sharedService.openSnackBar("El comentario se ha añadido correctamente");
          
        },
        complete: () => {
          this.points_average();
          subscripcion.unsubscribe()
   

        },
        error: console.log
      });
    }
  }

  user_session(){
    let token: string = this._cookieService.get('token');  
    
    if (!token)
      return false;
    else
    {
      let tokenPayload = JSON.parse(atob(token.split('.')[1]));
      this.id_user = tokenPayload.id;
      this.nombre_usuario = tokenPayload.nombre;
      this.apellidos_usuario = tokenPayload.apellidos;

      if (tokenPayload.tipo_usuario === "admin"){
        this.isAdmin = true;
      }else if(tokenPayload.tipo_usuario === "usuario"){
        this.isAdmin = false;

      }
      
      return true;
    }
  }

  verify_opinion() {
    const subscripcion = this._comment_service.get_user_comments(this.id_user, this.sitios_info.id).subscribe({
      next: (value: boolean) => {
          this.puedeValorar = !value;
      },
      complete: () => {
        subscripcion.unsubscribe()
      },
      error: console.log
    });
  }

  points_average(){
    let puntos = this._comment_service.get_comments(this.sitios_info.id).subscribe({
      next: (list_comments)=>{
        for(let comment of list_comments){
          this.suma += comment.puntuacion;
          this.cantidad++;
            
        }

        let total_puntos =  Math.round(this.suma/this.cantidad);
        this._sitio_service.update_points(this.sitios_info.id, total_puntos).subscribe({
          next: (val:any)=>{
            window.location.reload();
          }
        });
      },
      complete: () => {
        puntos.unsubscribe();
      },
      error: console.log
    })
  }
}