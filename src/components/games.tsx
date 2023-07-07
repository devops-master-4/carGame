import React, {Key, useEffect, useRef, useState} from "react";
import {Car, keys} from "../utils/type";
import {checkCarPos, collision, move, random} from "../utils/utilitaire";

import carImage1 from "../assets/green.png";
import carImage2 from "../assets/orange.png";
import carImage3 from "../assets/purple.png";
import carImage4 from "../assets/blue.png";
import carImage5 from "../assets/anthracite.png";
import carImage6 from "../assets/yellow.png";
import carImage7 from "../assets/red.png";
import * as events from "events";

const CarGame = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [cars, setCars] = useState<Array<Car> | null>([]);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>();
    const [playerCar, setPlayerCar]= useState<Car | null>(null);
    const [score, setScore]= useState<number>(0)

    useEffect(()=>{

        const canvas = canvasRef.current;
        const updatedPlayerCar = { ...playerCar };
        if (!canvas) return;

        const handleKeyPressUp = (event:any) => {
            const keyCode = event.keyCode;

            let x = updatedPlayerCar.posX?  updatedPlayerCar.posX: 0 ;
            let carWidth = updatedPlayerCar.width?updatedPlayerCar.width : 0;
            const canvas = canvasRef.current;
            if (!canvas || !updatedPlayerCar) return ;

            if (keyCode === 37) {
                x -=10;
                updatedPlayerCar.posX = x;
                if (updatedPlayerCar.posX < 0) {
                    updatedPlayerCar.posX = 0;
                }
                setPlayerCar(updatedPlayerCar as Car);

            } else if (keyCode === 39) {
                x +=10;
                updatedPlayerCar.posX = x;
                if (updatedPlayerCar.posX > canvas.width -carWidth) {
                    updatedPlayerCar.posX = canvas.width - carWidth;
                }
                setPlayerCar(updatedPlayerCar as Car);
            }
            console.log("car pos", updatedPlayerCar?.posX)
        };

        document.addEventListener('keyup', handleKeyPressUp);

        const handleKeyPressDown = (event:any) => {
            const keyCode = event.keyCode;
            if (keyCode === 37) {
                setPlayerCar(updatedPlayerCar as Car);
            } else if (keyCode === 39) {
                setPlayerCar(updatedPlayerCar as Car);
            }

        }
        document.addEventListener('keydown', handleKeyPressDown);

        return () => {
            document.removeEventListener('keyup', handleKeyPressUp);
            document.removeEventListener('keydown', handleKeyPressDown);
        };
    },[])

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;

        setCtx(context);

    }, []);

    useEffect(() => {
        setCars(initializeCars());
        setPlayerCar(initCarPlayer());
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !ctx) return;

        let score =0;


        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            cars?.forEach((car) => {

                ctx.clearRect(car.posX, car.posY, car.width, car.height);

                // Dessiner la voiture à sa nouvelle position
                ctx.drawImage(car.image, car.posX, car.posY, car.width, car.height);

                car.posY++;
                if (car.posY > canvas.height) {
                    car.posY = -car.height;
                    car.posX = random(canvas.width - car.width);
                    score++;
                    console.log(score)
                }
                ctx.font="120px";
                ctx.fillText("Score :" + score.toString(),canvas.width - 50, 50)

               if(playerCar && collision(playerCar, car)){
                   console.log(playerCar , car);
                   ctx.clearRect(0,0, canvas.width, canvas.height)
               }

                move(car);

            });

            if(playerCar){
                ctx.clearRect(playerCar.posX, playerCar.posY, playerCar.width, playerCar.height);

                ctx.drawImage(playerCar.image, playerCar.posX, playerCar.posY, playerCar.width, playerCar.height);
                //ctx.fillRect(playerCar.posX, playerCar.posY, playerCar.width, playerCar.height)
            }


            requestAnimationFrame(animate); // Appel récursif pour permettre l'animation fluide

        };

        animate();

    }, [cars, ctx, playerCar]);



    const movePlayer = (keyCode:number)=>{

       const updatedPlayerCar = { ...playerCar };
        let x = updatedPlayerCar.posX?  updatedPlayerCar.posX: 0 ;
        let carWidth = updatedPlayerCar.width?updatedPlayerCar.width : 0;
        const canvas = canvasRef.current;
        if (!canvas || !updatedPlayerCar) return ;

        if (keyCode === 37) {
            x -=1;
            updatedPlayerCar.posX = x;
            if (updatedPlayerCar.posX < 0) {
                updatedPlayerCar.posX = 0;
            }
            setPlayerCar(updatedPlayerCar as Car);

        } else if (keyCode === 39) {
            x +=1;
            updatedPlayerCar.posX = x;
            if (updatedPlayerCar.posX > canvas.width -carWidth) {
                updatedPlayerCar.posX = canvas.width - carWidth;
            }
            setPlayerCar(updatedPlayerCar as Car);
        }
    }




    const initCarPlayer =():Car | null=>{
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const image = new Image();
        image.src=carImage7;
        return {
            image:image,
            posX: (canvas.width/2) - 25,
            posY: canvas.height-40,
            color: "black",
            width: 25,
            height: 40,
            velocityX: 0,
            speed: 30,
            friction: 0.9,
        }
    }

    const createNewCar = (color: string): Car | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const carImages = [
            carImage1,
            carImage2,
            carImage3,
            carImage4,
            carImage5,
            carImage6,
        ];

        const loadedImages = carImages.map((imagePath) => {
            const image = new Image();
            image.src = imagePath;
            return image;
        });

        const imageRandom = Math.floor(Math.random() * loadedImages.length);
        const image = loadedImages[imageRandom];

        const x = random(canvas.width - 20);
        const y = random(canvas.height - 20);

        return {
            image:image,
            posX: x - 25,
            posY: y - 40,
            color: color,
            width: 25,
            height: 40,
            velocityX: 0,
            speed: 30,
            friction: 0.9,
        };
    };

    const initializeCars = () => {
        const canvas = canvasRef.current;
        const cars: Array<Car> = [];
        if (!canvas) return cars;

        for (let i = 0; i < 5; i++) {
            const newCar = createNewCar("red");
            if (newCar) {
                if (checkCarPos(cars, newCar)) {
                    continue; // Ignore the new car if there is a collision
                }
                cars.push(newCar);
            }
        }

        return cars;
    };


    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={400}
            style={{ border: "1px solid black" }}
        />
    );
};

export default CarGame;
