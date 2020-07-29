import { Router, Request, Response } from "express";
import { Radiacion } from '../models/radiacion.model';
import Metodos from '../metodos';

const userRoutes = Router();
var radio: number = 1 ;
var calendar: Date = new Date();
var coordenadas = Metodos.calcularCoordenadas(radio);

userRoutes.get('/prueba',(req:Request, res: Response)=>{
    res.json({
        ok:true,
        mensaje: 'Todo funciona bien!'
    })
});

userRoutes.post('/radio', (req: Request,res: Response,next)=>{
    radio = req.body.dato;
    coordenadas = Metodos.calcularCoordenadas(radio);
    try{
        res.json({ // esta es la respuesta que le voy a mandar al navegador si se logra crear el item radiacion de la BD
            ok:"true",
            radio
         });
    }catch(err){
        next(err); // genera el error con un response
    }
})

userRoutes.get('/recientes',(req: Request, res:Response, next)=>{ // envia las ultimas muestras por sensor
    var hoy = new Date(); // obtenemos el dia, mes y anio del dia de hoy 
    hoy.setHours(0); // seteamos a 0 la hora debido a que nos interesa obtener todas las muestras del dia actual desde las 5 am (5 horas agregadas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5)
    Radiacion.find({hora:{$gt:new Date(hoy)}}).sort({hora:1}).exec((err,radiacion)=>{
        if(err){
            err.message = 'Error en el servidor';
            next(err);
        }else{
            if(Object.keys(radiacion).length !== 0){ 
                radiacion = Metodos.marcadoresRecientes(radiacion);
                for(var marcador of radiacion){     // añadimos las coordenadas y el color para los poligonos de los marcadores mas recientes por cada sensor que haya funcionado ese dia presente
                    marcador.coordenadas = coordenadas;
                    marcador.color=Metodos.escogerColor(marcador.uv);
                }
                res.status(200).send({
                    radiacion
                });
            }else{
                var err = new Error('No hay muestras en la base');
                next(err);
            }
        }
    });
});
userRoutes.post('/radiacion', (req: Request,res: Response,next)=>{
    calendar = req.body.calendar;
    var end = new Date(calendar); // obtenemos el dia, mes y anio del dia de hoy 
    end.setHours(19); // seteamos a 19 la hora debido a que es una hora posterior a las mediciones del dia del calendario seleccionado
    Radiacion.find({hora:{$gte:new Date(calendar), $lt: end}}).sort({hora:1}).exec((err,radiacion)=>{ // eliminar el myDate de la consulta cuando no se agregen muestras posteriores a la fecha actual
        // falta hacer un control de las muestras en la hora correcta
        if(err){
            err.message = 'Error en el servidor';
            next(err);
        }else{
            if(Object.keys(radiacion).length !== 0){  
                res.status(200).send({
                    radiacion
                });
            }else{
                res.status(200).send({
                    radiacion
                });
            }
        }
    });
})

userRoutes.get('/mes',(req: Request, res:Response, next)=>{
    Radiacion.find().sort({hora:1}).exec((err,radiacion)=>{
        if(err){
            err.message = 'Error en el servidor';
            next(err);
        }else{
            if(Object.keys(radiacion).length !== 0){
                radiacion=Metodos.marcadoresMes(radiacion);
                res.status(200).send({
                    radiacion
                });
            }else{
                var err = new Error('No hay muestras en la base');
                next(err);
            }
        }
    });
    
});
userRoutes.get('/maxmes',(req: Request, res:Response, next)=>{
    Radiacion.find().sort({hora:1}).exec((err,radiacion)=>{
        if(err){
            err.message = 'Error en el servidor';
            next(err);
        }else{
            if(Object.keys(radiacion).length !== 0){
                radiacion=Metodos.maximoMes(radiacion);
                res.status(200).send({
                    radiacion
                });
            }else{
                var err = new Error('No hay muestras en la base');
                next(err);
            }
        }
    });
    
});
userRoutes.get('/semanal',(req: Request, res:Response, next)=>{ 
    var hoy = new Date(); // obtenemos el dia, mes y anio del dia de hoy 
    hoy.setHours(0); // seteamos a 0 la hora debido a que nos interesa obtener todas las muestras del dia actual desde las 5 am (5 horas agregadas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5)
    let start= new Date(hoy);
    let end = new Date(hoy); // no restamos 1 a end debido a que el limite es el dia actual a las 0 para leer todas las fechas de ayer
    // end.setDate(end.getDate()-1); // es -1 xq necesitamos que el ultimo dia sea uno menos del actual
    start.setDate(start.getDate()-30); // es -19 porque el chartjs solo permite mostrar 20 valores
    // console.log('start es:', start,' end es:', end);
    Radiacion.find({hora: {$gte: start, $lte: end}}).sort({hora:1}).exec((err,radiacion)=>{
        if(err){
            err.message = 'Error en el servidor';
            next(err);
        }else{
            if(Object.keys(radiacion).length !== 0){
                radiacion=Metodos.marcadoresSemanal(radiacion);
                res.status(200).send({
                    radiacion
                });
            }else{
                var err = new Error('No hay muestras en la base');
                next(err);
            }
        }
    });
});
userRoutes.get('/maxsemanal',(req: Request, res:Response, next)=>{ 
    var hoy = new Date(); // obtenemos el dia, mes y anio del dia de hoy 
    hoy.setHours(0); // seteamos a 0 la hora debido a que nos interesa obtener todas las muestras del dia actual desde las 5 am (5 horas agregadas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5)
    let start= new Date(hoy);
    let end = new Date(hoy); // no restamos 1 a end debido a que el limite es el dia actual a las 0 para leer todas las fechas de ayer
    start.setDate(start.getDate()-30); // restamos 30 porque queremos los 30 dias anteriores al actual
    Radiacion.find({hora: {$gte: start, $lt: end}}).sort({hora:1}).exec((err,radiacion)=>{
        if(err){
            err.message = 'Error en el servidor';
            next(err);
        }else{
            if(Object.keys(radiacion).length !== 0){
                radiacion=Metodos.maximoSemana(radiacion);
                res.status(200).send({
                    radiacion
                });
            }else{
                var err = new Error('No hay muestras en la base');
                next(err);
            }
        }
    });
});

userRoutes.post('/create', (req: Request,res: Response, next)=>{
    const radiacion = {
        ubicacion: req.body.ubicacion,
        uv: req.body.uv,
        hora: req.body.hora,
        latitud: req.body.latitud,
        longitud: req.body.longitud
    };
    Radiacion.create( radiacion).then(radiacionDB=>{ // radiacionDB es el cuerpo de cuando se cumpla la promesa
        res.json({ // esta es la respuesta que le voy a mandar al navegador si se logra crear el item radiacion de la BD
            ok:true,
            radiacion: radiacionDB // muestro el item radiacion creado al postman para decir q fue un exito
        });
    }).catch(err => {
        next(err); // genera el error con un response
    })
});

export default userRoutes;