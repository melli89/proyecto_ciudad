import { Component, OnInit } from '@angular/core';
import { SitioService } from '../services/sitio.service';
import { SitioModel } from '../models/sitio.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

//Implementamos el método Oninit que se ejecuta cuando se inicia el componente.
export class HomeComponent implements OnInit{
  sitios_info: SitioModel[] = [];
  
  constructor(private _sitio_service:SitioService){}

  ngOnInit(): void {
    this._sitio_service.get_all().subscribe(
      data=>{
        this.sitios_info = data;
      }
    )
  }
}
