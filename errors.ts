import { Log } from './models/log.model';
var log
var dia = new Date();
dia.setHours(dia.getHours()-5);
function middleware(error:any, req:any, res:any, next:any): void {
    res.json({
        status:'error',
        name: error.name,
        message: error.message,
        date: Date(),
    });
    
    log = {
        nombre: error.name,
        mensaje: error.message,
        fecha : dia,
    };
    Log.create(log).then(logDB=>{ 
        console.log('Se guardo con exito el log');
    }).catch(err => {
        next(err);
    })
};


module.exports =  middleware;
