import { Router, Request, Response } from "express";
import { Radiacion } from '../models/radiacion.model';
import Metodos from '../metodos';

const userRoutes = Router();
var radio: number = 1 ;
var coordenadas = Metodos.calcularCoordenadas(radio);
var errores:any [] = [];

userRoutes.post('/radio', (req: Request,res: Response,next)=>{
    radio = req.body.dato;
    coordenadas = Metodos.calcularCoordenadas(radio);
    try{
        res.json({ // esta es la respuesta que le voy a mandar al navegador si se logra crear el item radiacion de la BD
            ok:"true",
            radio
         });
    }catch(err){
            var error:any = { 
                status:'error',
                name: err.name,
                message: err.message,
                date: Date(),
            }
        errores.push(error);
        next(err); // genera el error con un response
    }
})


//var myDate = new Date("2019-12-2T01:00:00Z"); // para pruebas unicamente ya que en la bd puse muestras existentes para dias despues del actual osea hoy
// OJOOO SE QUEDA HOY CON EL VALOR QUEMADO EN CASO DE QUE EL USUARIO DEJE ABIERTA LA APP TODO EL DIA, NO SE ACTUALIZARA CON EL DIA ACTUAL
userRoutes.get('/recientes',(req: Request, res:Response, next)=>{ // envia las ultimas muestras por sensor
    var hoy = new Date(); // obtenemos el dia, mes y anio del dia de hoy 
    hoy.setHours(0); // seteamos a 0 la hora debido a que nos interesa obtener todas las muestras del dia actual desde las 5 am (5 horas agregadas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5)
    //abc();
    // console.log(errorMiddleware);
    Radiacion.find({hora:{$gt:new Date(hoy)}}).sort({hora:1}).exec((err,radiacion)=>{
        //console.log('hoyees:', hoy);
        //Radiacion.find({hora:{$gt:new Date(hoy),$lt:new Date(myDate)}}).exec((err,radiacion)=>{
        // gt es un operador para los valores mayores para nuestro ej todas las muestras del dia actual
        if(err){
            var error:any = { 
                    status:'error',
                    name: err.name,
                    message: 'Error en el servidor',
                    date: Date(),
                }
                errores.push(error);
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
                var error:any = { 
                    status:'error',
                    name: err.name,
                    message: err.message,
                    date: Date(),
                }
                errores.push(error);
                next(err);
            }
        }
    });
});
userRoutes.get('/radiacion',(req: Request, res:Response, next)=>{ // envia todas las muestras por todos los sensores en el dia actual
    // let radio = 1 ; 
    // let coordenadas: number[] = Metodos.calcularCoordenadas(radio); 
    // no quitamos este metodo calcularC y el radio = 1, debido a que en el metodo marcadoresRecientes llama a este metodo internamente
    // {hora:{$gt:new Date(hoy)}}
    var hoy = new Date(); // obtenemos el dia, mes y anio del dia de hoy 
    hoy.setHours(0); // seteamos a 0 la hora debido a que nos interesa obtener todas las muestras del dia actual desde las 5 am (5 horas agregadas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5)
    Radiacion.find({hora:{$gt:new Date(hoy)}}).sort({hora:1}).exec((err,radiacion)=>{ // eliminar el myDate de la consulta cuando no se agregen muestras posteriores a la fecha actual
        // falta hacer un control de las muestras en la hora correcta
        if(err){
            var error:any = { 
                    status:'error',
                    name: err.name,
                    message: 'Error en el servidor',
                    date: Date(),
                }
                errores.push(error);
            next(err);
        }else{
            if(Object.keys(radiacion).length !== 0){  
                res.status(200).send({
                    radiacion
                
                });
            }else{
                var err = new Error('No hay muestras en la base');
                var error:any = { 
                    status:'error',
                    name: err.name,
                    message: err.message,
                    date: Date(),
                }
                errores.push(error);
                next(err);
            }
        }
    });
});
userRoutes.get('/mes',(req: Request, res:Response, next)=>{
    var hoy = new Date(); // obtenemos el dia, mes y anio del dia de hoy 
    hoy.setHours(0); // seteamos a 0 la hora debido a que nos interesa obtener todas las muestras del dia actual desde las 5 am (5 horas agregadas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5)
    Radiacion.find().sort({hora:1}).exec((err,radiacion)=>{
        if(err){
            var error:any = { 
                    status:'error',
                    name: err.name,
                    message: 'Error en el servidor',
                    date: Date(),
                }
                errores.push(error);
            next(err);
        }else{
            if(Object.keys(radiacion).length !== 0){
                radiacion=Metodos.marcadoresMes(radiacion);
                res.status(200).send({
                    radiacion
                });
            }else{
                var err = new Error('No hay muestras en la base');
                var error:any = { 
                    status:'error',
                    name: err.name,
                    message: err.message,
                    date: Date(),
                }
                errores.push(error);
                next(err);
            }
        }
    });
    
});
userRoutes.get('/maxmes',(req: Request, res:Response, next)=>{
    var hoy = new Date(); // obtenemos el dia, mes y anio del dia de hoy 
    hoy.setHours(0); // seteamos a 0 la hora debido a que nos interesa obtener todas las muestras del dia actual desde las 5 am (5 horas agregadas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5)
    Radiacion.find().sort({hora:1}).exec((err,radiacion)=>{
        if(err){
            var error:any = { 
                    status:'error',
                    name: err.name,
                    message: 'Error en el servidor',
                    date: Date(),
                }
                errores.push(error);
            next(err);
        }else{
            if(Object.keys(radiacion).length !== 0){
                radiacion=Metodos.maximoMes(radiacion);
                res.status(200).send({
                    radiacion
                });
            }else{
                var err = new Error('No hay muestras en la base');
                var error:any = { 
                    status:'error',
                    name: err.name,
                    message: err.message,
                    date: Date(),
                }
                errores.push(error);
                next(err);
            }
        }
    });
    
});
userRoutes.get('/semanal',(req: Request, res:Response, next)=>{ 
    var hoy = new Date(); // obtenemos el dia, mes y anio del dia de hoy 
    hoy.setHours(0); // seteamos a 0 la hora debido a que nos interesa obtener todas las muestras del dia actual desde las 5 am (5 horas agregadas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5)
    let start= new Date(hoy);
    let end = new Date(hoy);
    end.setDate(end.getDate()+1);
    start.setDate(start.getDate()-19); // es -19 porque el chartjs solo permite mostrar 20 valores
    Radiacion.find({hora: {$gte: start, $lt: end}}).sort({hora:1}).exec((err,radiacion)=>{
        if(err){
            var error:any = { 
                    status:'error',
                    name: err.name,
                    message: 'Error en el servidor',
                    date: Date(),
                }
                errores.push(error);
            next(err);
        }else{
            if(Object.keys(radiacion).length !== 0){
                radiacion=Metodos.marcadoresSemanal(radiacion);
                res.status(200).send({
                    radiacion
                });
            }else{
                var err = new Error('No hay muestras en la base');
                var error:any = { 
                    status:'error',
                    name: err.name,
                    message: err.message,
                    date: Date(),
                }
                errores.push(error);
                next(err);
            }
        }
    });
});
userRoutes.get('/maxsemanal',(req: Request, res:Response, next)=>{ 
    var hoy = new Date(); // obtenemos el dia, mes y anio del dia de hoy 
    hoy.setHours(0); // seteamos a 0 la hora debido a que nos interesa obtener todas las muestras del dia actual desde las 5 am (5 horas agregadas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5)
    let start= new Date(hoy);
    let end = new Date(hoy);
    end.setDate(end.getDate()+1);
    start.setDate(start.getDate()-19); // es -19 porque el chartjs solo permite mostrar 20 valores
    Radiacion.find({hora: {$gte: start, $lt: end}}).sort({hora:1}).exec((err,radiacion)=>{
        if(err){
            var error:any = { 
                    status:'error',
                    name: err.name,
                    message: 'Error en el servidor',
                    date: Date(),
                }
                errores.push(error);
            next(err);
        }else{
            if(Object.keys(radiacion).length !== 0){
                radiacion=Metodos.maximoSemana(radiacion);
                res.status(200).send({
                    radiacion
                });
            }else{
                var err = new Error('No hay muestras en la base');
                var error:any = { 
                    status:'error',
                    name: err.name,
                    message: err.message,
                    date: Date(),
                }
                errores.push(error);
                next(err);
            }
        }
    });
});

userRoutes.get('/errores',(req: Request, res:Response, next)=>{
    errores;
    try{
        res.json({ // esta es la respuesta que le voy a mandar al navegador si se logra crear el item radiacion de la BD
             lista: errores,
         });
    }catch(err){
        var error:any = { 
            status:'error',
            name: err.name,
            message: err.message,
            date: Date(),
    }
    errores.push(error);
    next(err); // genera el error con un response
    }
});
userRoutes.get('/limpiar',(req: Request, res:Response, next)=>{
    errores = [];
    try{
    res.json({ // esta es la respuesta que le voy a mandar al navegador si se logra crear el item radiacion de la BD
         lista: errores,
     });
    }catch(err){
        var error:any = { 
            status:'error',
            name: err.name,
            message: err.message,
            date: Date(),
    }
    errores.push(error);
    next(err); // genera el error con un response
    }
 });
userRoutes.post('/crear', (req: Request,res: Response)=>{
    const dato = {
        uv: req.body.uv,
    };
    res.json({ // esta es la respuesta que le voy a mandar al navegador si se logra crear el item radiacion de la BD
        ok:true,
        uv: dato.uv,
    });
     
})

userRoutes.post('/create', (req: Request,res: Response, next)=>{
    const radiacion = {
        ubicacion: req.body.ubicacion,
        uv: req.body.uv,
        hora: req.body.hora,
        latitud: req.body.latitud,
        longitud: req.body.longitud
    };
    // radiacion.hora.setHours(radiacion.hora.getHours()-5);
    // then es de una promesa
    Radiacion.create( radiacion).then(radiacionDB=>{ // radiacionDB es el cuerpo de cuando se cumpla la promesa
        res.json({ // esta es la respuesta que le voy a mandar al navegador si se logra crear el item radiacion de la BD
            ok:true,
            radiacion: radiacionDB // muestro el item radiacion creado al postman para decir q fue un exito
        });
        // console.log("se creo con exito el objetoo..");
    }).catch(err => {
        var error:any = { 
                status:'error',
                name: err.name,
                message: err.message,
                date: Date(),
        }
        errores.push(error);
        next(err); // genera el error con un response
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