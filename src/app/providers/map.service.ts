import { Injectable } from '@angular/core';
import { WebsocketService } from './web-socket.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {map} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class MapService {

  baseUrl:string

  constructor(private wsService:WebsocketService, private http:HttpClient) { 

    this.baseUrl = environment.backUrl;
  }

  getMarkers(){
    let url = `${this.baseUrl}/markers`
    return this.http.get(url).pipe(map((res:any)=>{ console.log(res); return res.markers}))
  }
}
