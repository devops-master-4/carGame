import {Car, carBorder} from "./type";

export const checkCarPos =(carsList:Array<Car>, currentCar:Car):boolean=>{
    return carsList?.some((item)=>{
        const carA = getCarPos(item);
        const carB = getCarPos(currentCar);

        return(
            carA.left < carB.right &&
            carA.right > carB.left &&
            carA.top < carB.bottom &&
            carA.bottom > carB.top
        )
    })
}

export const collision =(playerCar:Car, currentCar:Car):boolean=>{

        const carA = getCarPos(playerCar); // user car
        const carB = getCarPos(currentCar); // generated car


        return(
            carA.left < carB.right &&
            carA.right > carB.left &&
            carA.top < carB.bottom &&
            carA.bottom > carB.top
        )

}

export const getCarPos =(currentCar:Car):carBorder=>{
    const leftSide:number = currentCar.posX - currentCar.width;
    const rightSide:number =  currentCar.posX + currentCar.width;
    const topSide:number =  currentCar.posY - currentCar.height;
    const bottomSide:number =  currentCar.posY + currentCar.height;

    return {
        left: leftSide,
        right: rightSide,
        top: topSide,
        bottom: bottomSide
    };
}

export const CarBounds = {
    MinX: 0,
    MaxX: 800, // Mettez ici la largeur du canvas
};


export const generateRandomCarPosition = (canvaSize:any): { x: number; y: number } => {
    const carWidth = 30; // Largeur de la voiture
    const carHeight = 40; // Hauteur de la voiture

    const maxX = canvaSize.width - carWidth; // Valeur maximale pour la position en x
    const maxY = canvaSize.height - carHeight;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    return { x: randomX, y: randomY };
};

export const move = (car: Car) => {
    car.velocityX *= car.friction;
    car.posX += car.velocityX;

    if (car.posX > CarBounds.MaxX - car.width) {
        car.posX = CarBounds.MaxX - car.width;
    } else if (car.posX < CarBounds.MinX) {
        car.posX = CarBounds.MinX;
    }
};

export const random = (max:number, min:number=0) =>{
    return Math.random() * (max - min) + min;
}