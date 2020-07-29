import { Router, Request, Response } from "express";
import { Log } from '../models/log.model';

const logRoutes = Router();

logRoutes.get('/errores',(req: Request, res:Response, next)=>{ // mostrar los errores de la coleccion logs BD mapa
    Log.find({}).exec((err,log)=>{ 
        if(err){
            err.message = 'Error en el servidor';
            next(err);
        }else{
            if(Object.keys(log).length !== 0){  
                res.status(200).send({
                    log   
                });
            }else{
                res.status(200).send({
                    log: []
                });
            }
        }
    });
});

logRoutes.get('/limpiar',(req: Request, res:Response, next)=>{ // eliminar los errores de la coleccion logs BD mapa
    const todos = {"nombre" : /$/};
    Log.remove(todos).exec((err,log)=>{ 
        if(err){
            err.message = 'Error en el servidor';
            next(err);
        }else{
            if(log.n !== 0){  
                res.status(200).send({
                    log: []
                });
            }else{
                res.status(200).send({
                    log: [],
                    mensaje: 'no existe documentos en la coleccion'
                });
            }
        }
    });
 });

 export default logRoutes;