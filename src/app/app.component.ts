import { Component } from '@angular/core';
import { WebsocketService } from './providers/web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private wsService:WebsocketService){
    this.wsService.checkStatus()
  }
  title = 'google-map';
}
