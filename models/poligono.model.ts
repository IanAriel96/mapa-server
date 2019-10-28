import {Schema, model, Document} from 'mongoose';
// el model define el modelo o lo recupera, me ayuda a la interaccion con la BD
// el model me permite guardar el schema en una variable como en el ejemplo const Poligono
const poligonoSchema = new Schema({
    path: {
        type: Array,
        required: [true, 'La ruta es necesaria']
    },
    color: {
        type: String,
        required: [true, 'El color es necesaria']
    }
});

interface IPoligono extends Document{
    path: any[];
    color: string;

}

export const Poligono = model<IPoligono>('Poligono',poligonoSchema);