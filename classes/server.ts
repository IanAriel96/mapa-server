import express from 'express';    // express me permite crear un servidor web y tiene todo lo necesario para montar un servidor REST 
export default class Server{    // default significa que como tengo solo esta clase (Server) en este archivo se exporta por defecto cuando se llame 
    public app: express.Application;
    public port: number = 3000;
    

    constructor(){
        this.app = express();
    }
     start(){
         this.app.listen(this.port,()=>{console.log(`Servidor corriendo en el puerto ${this.port}`)});
     }
    // el ${this.port}` es de un template literal que permite facilitar el proceso de concatenacion de cadenas con variables
}