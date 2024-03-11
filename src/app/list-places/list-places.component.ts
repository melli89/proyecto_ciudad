import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SitioModel } from '../models/sitio.model';
import { SharedService } from '../shared/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EditarLugaresComponent } from '../editar-lugares/editar-lugares.component';
import { SitioService } from '../services/sitio.service';


@Component({
  selector: 'app-list-places',
  templateUrl: './list-places.component.html',
  styleUrls: ['./list-places.component.css']
})
export class ListPlacesComponent {
  displayedColumns: string[] = ['name', 'actions'];
  dataSource!: MatTableDataSource<SitioModel>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _dialog: MatDialog, private _sitioService: SitioService, private _sharedService: SharedService){}

  ngOnInit(): void {
    this.getPlaceList();
  } 

  // Abre la ventana para editar un nuevo usuario
  openAddEditPlaceDialog(data?: SitioModel){
    let dialogRef;

    if(data)
      dialogRef = this._dialog.open(EditarLugaresComponent, {data});  // Edita el usuario
    else
      dialogRef = this._dialog.open(EditarLugaresComponent);    // Registra el usuario


    dialogRef.afterClosed().subscribe({   
      next: (val) => {                        // Si recibe true cuando se cierra, se actualiza la lista
        if (val)
          this.getPlaceList();    
      }
    });
  }


  // Muestra el listado de usuarios que hay en el gimnasio
  getPlaceList() {
    this._sitioService.get_all().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log
    })
  }

  // Elimina un usuario
  deletePlace(id: string){
    this._sitioService.delete_place(id).subscribe({
      next: (res) => {
        this._sharedService.openSnackBar("El usuario se ha eliminado correctamente.");
        this.getPlaceList();    // Actualizamos el listado de usuarios
      },
      error: console.log
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
