"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const radiacion_1 = __importDefault(require("./routes/radiacion"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const server = new server_1.default();
//El Middleware es una funcion que se ejecuta antes que otras
//Body Parser viene siendo un middleware que procesa los post para nuestro caso 
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
// con el urlencoded voy a recibir peticiones del formato x-www-form-encoded son las que se usa comunmente para enviar inf de angular
server.app.use(body_parser_1.default.json()); // recibir los posteos en forma de json
// Configuracion CORS
server.app.use(cors_1.default({ origin: true, credentials: true }));
// rutas de mi aplicacion
server.app.use('/api', radiacion_1.default);
// para nuestro caso siempre que se ejecute el servicio va a pasar por este middleware de nombre api que le puse 
// conectar DB mongo con node
mongoose_1.default.connect('mongodb+srv://Ian:2078389epn@cluster0-ru9rg.mongodb.net/mapa?retryWrites=true&w=majority' || 'mongodb://localhost', { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err)
        throw err;
    console.log('Base de datos OnLine no se cayo..!!!');
});
// Levantar el servidor
server.start();
