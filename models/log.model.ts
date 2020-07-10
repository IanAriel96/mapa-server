import {Schema, model, Document} from 'mongoose';
const logSchema = new Schema({
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
interface ILog extends Document{
    nombre: string;
    mensaje: string;
    fecha: Date;
}
export const Log = model<ILog>('Log',logSchema);
