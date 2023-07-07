export interface Car{
    image:CanvasImageSource,
    posY:number,
    posX:number,
    color:string,
    width:number,
    height:number,
    speed:number,
    velocityX:number
    friction:number
}

export interface carBorder{
    left:number,
    right:number,
    top:number,
    bottom:number
}

export interface  keys{
    right:boolean
    left:boolean
}