



export class MarkerData{
    constructor(
        public id:string,
        public position: { lat: number, lng:number},
        public info?:string

    ){

    }
}