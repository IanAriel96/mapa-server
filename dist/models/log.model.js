"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const logSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del Log es necesario']
    },
    mensaje: {
        type: String,
        required: [true, 'El mensaje del Log es necesario']
    },
    fecha: {
        type: Date,
        required: [true, 'La fechas del Log es necesario']
    }
});
exports.Log = mongoose_1.model('Log', logSchema);
