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
const log_1 = __importDefault(require("./routes/log"));
const errorMiddleware = require('./errors');
const server = new server_1.default();
//El Middleware es una funcion que se ejecuta antes que otras
//Body Parser viene siendo un middleware que procesa los post para nuestro caso 
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
// con el urlencoded voy a recibir peticiones en formato x-www-form-encoded son las que se usa comunmente para enviar inf de angular
server.app.use(body_parser_1.default.json()); // recibir los posteos en formato json
// Configuracion CORS
server.app.use(cors_1.default({ origin: true, credentials: true }));
// CORS añade funcionalidades nuevas a las peticiones AJAX como las peticiones entre dominios (cross-site), eventos de progreso y envio de datos binarios.
// rutas de mi aplicacion
server.app.use('/api', radiacion_1.default);
server.app.use('/api', log_1.default);
mongoose_1.default.connect('mongodb+srv://Ian:2078389epn@cluster0-ru9rg.mongodb.net/mapa?retryWrites=true&w=majority' || 'mongodb://localhost', { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err)
        throw err;
    console.log('Base de datos OnLine no se cayo..!!!');
});
// controlador de errores
server.app.use(errorMiddleware);
// Levantar el servidor
server.start();
