import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MarkerData } from '../../models/marker-data.model';
import { WebsocketService } from '../../providers/web-socket.service';
import { MapService } from '../../providers/map.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy{

  @ViewChild('mapContainer') mapContainer:ElementRef;
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow

  markers:{id:string,info:string,marker:MapMarker}[]=[]
  zoom = 15
  center: google.maps.LatLngLiteral;
  height:string;
  width:string;
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 8,
  }
  infoContent:{info:string,markerId:string} = {info:'',markerId:undefined}
  newMarkerSubs:Subscription;
  moveMarkerSubs:Subscription;
  markerRemoveSubs:Subscription;

  constructor(private wsService:WebsocketService, private mapService:MapService) {}

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition(position => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      this.setSize();
      this.mapService.getMarkers().subscribe((markers:MarkerData[])=>{ 
        markers.forEach((marker:MarkerData)=>{
              this.addMarker(marker)
        })
       })
    })

    this.listenningNewMarkers();
    this.listenningMarkersMove();
    this.listenningMarkersRemoval();
  }

  addMarker(data?: any, infoText?: string,) {
    if(!data){
      data = new MarkerData(String(new Date().getTime()), { lat: this.center.lat, lng: this.center.lng },infoText?infoText:undefined);
      this.wsService.emit('new-marker',data)
    }
      this.markers.push({
        id: data.id,
        info:data.info,
        marker:<MapMarker> {
          position: {lat: data.position.lat,lng:data.position.lng},
          label: {
            color: 'red',
            text: 'Marker label ' + (this.markers.length + 1),
          },
          title: 'Marker title ' + (this.markers.length + 1),
          options: {
            animation: google.maps.Animation.BOUNCE,
            draggable: true
          },
        }
      })
  }


  removeMarker(){
    this.markers = this.markers.filter((marker: {id: string, info: string, marker: MapMarker})=>{ 
      return marker.id  != this.infoContent.markerId;
    })
     this.wsService.emit('remove-marker',this.infoContent.markerId)
  }

  markerDrag(event: any, markerId: string) {
    let data = { id: markerId, position: { lng: event.latLng.lng(), lat: event.latLng.lat() } }
    this.wsService.emit('marker-move', data)
  }

  listenningNewMarkers(){
    this.newMarkerSubs = this.wsService.listen('new-marker').subscribe((data:MarkerData)=>{
          this.addMarker(data)
    })
  }

  listenningMarkersMove(){
    this.moveMarkerSubs= this.wsService.listen('marker-move').subscribe((data:MarkerData)=>{
       this.markers.filter((marker: { id: string, info: string, marker: MapMarker })=>{  return marker.id === data.id})[0].marker.position = data.position;
     })
  }

  listenningMarkersRemoval(){
   this.markerRemoveSubs= this.wsService.listen('remove-marker').subscribe((id:string)=>{
      this.markers = this.markers.filter((marker: { id: string, info: string, marker: MapMarker })=>{ return marker.id != id })
    })
  }


  onResize(){
    this.setSize();
  }

  setSize(){
    this.height = `${this.mapContainer.nativeElement.offsetHeight}px`;
    this.width = `${this.mapContainer.nativeElement.offsetWidth}px`;
  }

  openInfo(marker:MapMarker,id:string){
    this.infoContent.info = this.markers.filter((marker)=>{ return marker.id === id})[0].info;
    this.infoContent.markerId = id;
    this.info.open(marker);
  }

  ngOnDestroy(){
    this.markerRemoveSubs.unsubscribe;
    this.moveMarkerSubs.unsubscribe();
    this.newMarkerSubs.unsubscribe();
  }

}

