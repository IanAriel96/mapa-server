import { Router, Request, Response } from "express";
import { Radiacion } from '../models/radiacion.model';
import Metodos from '../metodos';

const userRoutes = Router();
var hoy = new Date().toLocaleDateString(); // obtenemos el dia, mes y anio del dia de hoy 

userRoutes.get('/recientes',(req: Request, res:Response)=>{
    Radiacion.find({hora:{$gt:new Date(hoy)}}).exec((err,radiacion)=>{
        // gt es un operador para los valores mayores para nuestro ej todas las muestras del dia actual
        if(err){
            res.status(500).send({
                message: 'Error en el servidor'
            });
        }else{
            if(radiacion){ 
                radiacion = Metodos.marcadoresRecientes(radiacion);
                res.status(200).send({
                    radiacion
                });
            }else{
                res.status(404).send({
                    message:'No hay radiaciones en la base'
                });
            }
        }
    });
});
userRoutes.get('/radiacion',(req: Request, res:Response)=>{
    let radio = 1 ;
    let coordenadas: number[] = Metodos.calcularCoordenadas(radio);
    // {hora:{$gt:new Date(hoy)}}
    Radiacion.find({}).exec((err,radiacion)=>{
        if(err){
            res.status(500).send({
                message: 'Error en el servidor'
            });
        }else{
            if(radiacion){  
                for(var marcador of radiacion){
                    marcador.coordenadas = coordenadas;
                    marcador.color=Metodos.escogerColor(marcador.uv);
                }
                res.status(200).send({
                    radiacion
                
                });
            }else{
                res.status(404).send({
                    message:'No hay radiaciones'
                });
            }
        }
    });
});



userRoutes.post('/create', (req: Request,res: Response)=>{
    const radiacion = {
        ubicacion: req.body.ubicacion,
        uv: req.body.uv,
        hora: req.body.hora,
        latitud: req.body.latitud,
        longitud: req.body.longitud
    };
    // then es de una promesa
    Radiacion.create( radiacion).then(radiacionDB=>{ // radiacionDB es el cuerpo de cuando se cumpla la promesa
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
userRoutes.post('/update',(req:any, res:Response)=>{
    const radiacion={
        uv:req.body.uv,
        hora:req.body.hora 
    }
    
 Radiacion.findByIdAndUpdate("5d82636976ddcb3ea0ead737",radiacion,{new:false},(err,radiacionDB)=>{
     if(err) throw err;
     if(!radiacionDB){
         return res.json({
             ok:false,
             mensaje: 'No exsite esa radiacion con ese ID'
         });
     }
     res.json({ // esta es la respuesta que le voy a mandar al navegador si se logra crear el item radiacion de la BD
        ok:true,
        radiacion: radiacionDB // muestro el item radiacion creado al postman para decir q fue un exito
    })
 })
});

export default userRoutes;