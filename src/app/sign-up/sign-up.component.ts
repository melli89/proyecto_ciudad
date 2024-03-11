import { Component, Inject } from '@angular/core';
import { Validators, FormGroup, FormBuilder} from '@angular/forms';
import { UserModel } from '../models/user.model';
import { SharedService } from '../shared/shared.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SignUpService } from '../services/sign-up.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {

  autonomous_regions_list: string[] = [
    'Andalucía', 
    'Aragón', 
    'Asturias', 
    'Baleares', 
    'Canarias', 
    'Cantabria', 
    'Castilla la Mancha', 
    'Castilla y León', 
    'Cataluña', 
    'Comunidad Valenciana', 
    'Extremadura', 
    'Galicia', 
    'La Rioja', 
    'Madrid', 
    'Murcia', 
    'Navarra', 
    'País Vasco', 
    'Ceuta', 
    'Melilla',
    'Otro'
  ];

  roles_list: string[] = [
    'usuario',
    'administrador'
  ];

  regForm: FormGroup;


  constructor(
    private _fb: FormBuilder,
    private _userService: SignUpService,
    private _sharedService: SharedService,
    private _redirect: Router,
    @Inject(MAT_DIALOG_DATA) public data: UserModel) 
    {
    this.regForm = this._fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password:['',[Validators.required]],
      password2:['',[Validators.required]],
      autonomous_region: [null],   
      birthday: [null],
      genre: [null]
    });
  }

  submitRegForm()
  {
    if(this.regForm.valid && this.regForm.value.password == this.regForm.value.password2)  
    {
      // FORMATEO DE FECHA
      const formBirthday = this.regForm.value.birthday;     
      let formattedBirthday: Date | undefined;      // Inicializa formattedDate como null si no se seleccionó ninguna fecha
      
      // Si la fecha no es nula, opera con ella. Si no, la guarda nula
      if (formBirthday!=null) {
        // Suma un día a la fecha seleccionada, ya que si no, guarda un día antes al seleccionado por la zona horaria, al convertirlo luego con toISOString
        let nextDay = new Date(formBirthday);
        nextDay.setDate(formBirthday.getDate() + 1);
        // Se queda sólo la parte de fecha, sin la hora, y luego la convierte en fecha
        formattedBirthday = nextDay.toISOString().slice(0, 10) as unknown as Date;
      }

      // Creamos la instancia de UserModel
      let userData: UserModel = new UserModel(  
        this.regForm.value.id,
        this.regForm.value.email,
        this.regForm.value.firstName,
        this.regForm.value.lastName,
        this.regForm.value.phone,
        "esteseraeltoken",   // Password
        'usuario',
        formattedBirthday,
        this.regForm.value.genre,
        this.regForm.value.autonomous_region,
      );
      

      if(this.data)        
      {

        const proceso_email = this._userService.check_email(this.regForm.value.email).subscribe({
          next: (val:boolean) => {
            if (!val){
              const proceso = this._userService.add_user(userData).subscribe({
                next: (val: any) => {
                  this._sharedService.openSnackBar("El usuario se ha añadido correctamente.");
                  this._redirect.navigate(['/home']);
                },
                complete: () => {proceso.unsubscribe()},
                error: console.log
              });
            }else{
              this._sharedService.openSnackBar("El email introducido ya existe.");
            }
          },
          complete: ()=> {proceso_email.unsubscribe()},
          error: console.log
        })
      } 
    }else{
      this._sharedService.openSnackBar("Error, las contraseñas no son iguales.");
    }
  }
}

