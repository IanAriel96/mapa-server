import Server from './classes/server';
import userRoutes from './routes/radiacion';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

const errorMiddleware = require('./errors');
const server = new Server();


//El Middleware es una funcion que se ejecuta antes que otras
//Body Parser viene siendo un middleware que procesa los post para nuestro caso 
server.app.use(bodyParser.urlencoded({extended: true})); 
// con el urlencoded voy a recibir peticiones en formato x-www-form-encoded son las que se usa comunmente para enviar inf de angular
server.app.use(bodyParser.json()); // recibir los posteos en formato json

// Configuracion CORS
server.app.use(cors({origin: true, credentials: true}));
// CORS añade funcionalidades nuevas a las peticiones AJAX como las peticiones entre dominios (cross-site), eventos de progreso y envio de datos binarios.

// rutas de mi aplicacion
server.app.use('/api',userRoutes); 
// server.app.get('/api/errores',(req: Request, res:Response)=>{
//     // const erroresRes = errores;
//     res.json({ // esta es la respuesta que le voy a mandar al navegador si se logra crear el item radiacion de la BD
//          erroresRes
//      })
//  });
// para nuestro caso siempre que se ejecute el servicio va a pasar por este middleware de nombre api que le puse 

// conectar DB mongo con node
mongoose.connect('mongodb+srv://Ian:2078389epn@cluster0-ru9rg.mongodb.net/mapa?retryWrites=true&w=majority' || 'mongodb://localhost',
                {useNewUrlParser: true, useCreateIndex: true},(err)=>{ //trabajamos con los indices
                if (err) throw err;
                console.log('Base de datos OnLine no se cayo..!!!')
                })

// control de errores

// server.app.use(function(error:any, req:any, res:any, next:any) {
//     res.status(500).json({
//         status:'error',
//         name: error.name,
//         message: error.message,
//         path: error.path,
//         date: Date(),
//     });
// });
server.app.use(errorMiddleware);

// Levantar el servidor
server.start();