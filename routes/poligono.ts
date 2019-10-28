import { Router, Request, Response } from "express";
import { Radiacion } from '../models/radiacion.model';
import Metodos from '../metodos';

const userRoutes = Router();
var poligono = new Radiacion();
var err: string;

userRoutes.post('/createpoli', (req: Request,res: Response)=>{
    const poligono = {
        ubicacion: req.body.ubicacion,
        uv: req.body.uv,
        hora: req.body.hora,
        latitud: req.body.latitud,
        longitud: req.body.longitud
    };
    // then es de una promesa
    Radiacion.create( poligono).then(radiacionDB=>{ // radiacionDB es el cuerpo de cuando se cumpla la promesa
        res.json({ // esta es la respuesta que le voy a mandar al navegador si se logra crear el item radiacion de la BD
            ok:true,
            radiacion: radiacionDB // muestro el item radiacion creado al postman para decir q fue un exito
        })
    }).catch(err => {
        res.json({
            ok: false, // significa que lo hizo mal la insercion de datos
            err //envio el error
        })
    })
});


export default userRoutes;