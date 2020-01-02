import { Router, Request, Response } from "express";
import { Radiacion } from '../models/radiacion.model';
import Metodos from '../metodos';

const userRoutes = Router();
var hoy = new Date(); // obtenemos el dia, mes y anio del dia de hoy 
hoy.setHours(0); // seteamos a 0 la hora debido a que nos interesa obtener todas las muestras del dia actual desde las 5 am (5 horas agregadas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5)
//var myDate = new Date("2019-12-2T01:00:00Z"); // para pruebas unicamente ya que en la bd puse muestras existentes para dias despues del actual osea hoy
// OJOOO SE QUEDA HOY CON EL VALOR QUEMADO EN CASO DE QUE EL USUARIO DEJE ABIERTA LA APP TODO EL DIA, NO SE ACTUALIZARA CON EL DIA ACTUAL
userRoutes.get('/recientes',(req: Request, res:Response)=>{ // envia las ultimas muestras por sensor
    Radiacion.find({hora:{$gt:new Date(hoy)}}).sort({hora:1}).exec((err,radiacion)=>{
        console.log('hoyees:', hoy);
        //Radiacion.find({hora:{$gt:new Date(hoy),$lt:new Date(myDate)}}).exec((err,radiacion)=>{
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
userRoutes.get('/radiacion',(req: Request, res:Response)=>{ // envia todas las muestras por todos los sensores en el dia actual
    let radio = 1 ; 
    let coordenadas: number[] = Metodos.calcularCoordenadas(radio); 
    // no quitamos este metodo calcularC y el radio = 1, debido a que en el metodo marcadoresRecientes llama a este metodo internamente
    // {hora:{$gt:new Date(hoy)}}
    Radiacion.find({hora:{$gt:new Date(hoy)}}).sort({hora:1}).exec((err,radiacion)=>{ // eliminar el myDate de la consulta cuando no se agregen muestras posteriores a la fecha actual
        // falta hacer un control de las muestras en la hora correcta
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
userRoutes.get('/mes',(req: Request, res:Response)=>{
    Radiacion.find().sort({hora:1}).exec((err,radiacion)=>{
        if(err){
            res.status(500).send({
                message: 'Error en el servidor'
            });
        }else{
            if(radiacion){
                radiacion=Metodos.marcadoresMes(radiacion);
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

userRoutes.get('/semanal',(req: Request, res:Response)=>{ 
    let start= new Date(hoy);
    let end = new Date(hoy);
    end.setDate(end.getDate()+1);
    start.setDate(start.getDate()-19); // es -19 porque el chartjs solo permite mostrar 20 valores
    Radiacion.find({hora: {$gte: start, $lt: end}}).sort({hora:1}).exec((err,radiacion)=>{
        if(err){
            res.status(500).send({
                message: 'Error en el servidor'
            });
        }else{
            if(radiacion){
                radiacion=Metodos.marcadoresSemanal(radiacion);
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