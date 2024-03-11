import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '../shared/shared.service';
import { SitioModel } from '../models/sitio.model';
import { SitioService } from '../services/sitio.service';


@Component({
  selector: 'app-editar-lugares',
  templateUrl: './editar-lugares.component.html',
  styleUrls: ['./editar-lugares.component.css']
})
export class EditarLugaresComponent implements OnInit{

  
  roles_list: string[] = [
    'usuario',
    'administrador'
  ];

  regForm: FormGroup;
  //dataSource!: MatTableDataSource<any>;  

  /*@ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;*/

  constructor(
    private _fb: FormBuilder,
    private _sitioService: SitioService,
    private _sharedService: SharedService,
    private _dialogRef: MatDialogRef<EditarLugaresComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SitioModel) 
    {
    this.regForm = this._fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      puntuacion: ['', [Validators.required]],
      imagen: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.regForm.patchValue(this.data);
  }

  /*// Muestra el listado de usuarios que hay en el gimnasio
  getPlacesList() {
    this._sitioService.get_all().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log
    });
  }*/

  // Manda el formulario para editar o registrar el usuario
  submitRegForm()
  {
    if(this.regForm.valid)
    {
      // FORMATEO DE FECHA
      const formBirthday = this.regForm.value.birthday;     
      let formattedBirthday: Date | null = null;      // Inicializa formattedDate como null si no se seleccionó ninguna fecha
      
      // Si la fecha no es nula, opera con ella. Si no, la guarda nula
      if (formBirthday!=null) {
        // Suma un día a la fecha seleccionada, ya que si no, guarda un día antes al seleccionado por la zona horaria, al convertirlo luego con toISOString
        let nextDay = new Date(formBirthday);
        nextDay.setDate(formBirthday.getDate() + 1);
        // Se queda sólo la parte de fecha, sin la hora, y luego la convierte en fecha
        formattedBirthday = nextDay.toISOString().slice(0, 10) as unknown as Date;
      }

      // Creamos la instancia de UserModel
      let placeData: SitioModel = new SitioModel(  
        this.regForm.value.id,
        this.regForm.value.nombre,
        this.regForm.value.descripcion,
        this.regForm.value.puntuacion,
        this.regForm.value.imagen
      );
      

      if(this.data && this.data.id !== undefined)         // ACTUALIZA
      {
        this._sitioService.edit_place(this.data.id, placeData).subscribe({
          next: (val: any) => {
            this._sharedService.openSnackBar("El usuario se ha modificado correctamente.");
            this._dialogRef.close(true);      // Cerramos la ventana de edición
          },
          error: console.log
        });
      } else {                                            // REGISTRA
        this._sitioService.add_place(placeData).subscribe({
          next: (val: any) => {
            this._sharedService.openSnackBar("El usuario se ha añadido correctamente.");
            this._dialogRef.close(true);      // Cerramos la ventana de registro
          },
          error: console.log
        });
      } 
    }
  }
}
