export class UserModel {
  constructor (
      public id:number,
      public email:string,
      public nombre:string,
      public apellidos:string,
      public telefono:string,
      public contrasena:string,
      public tipo_usuario:string,
      public fecha_nacimiento?:Date,
      public genero?:string,
      public origen?:string  
  ){}
}