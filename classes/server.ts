import express from 'express';
export default class Server{
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