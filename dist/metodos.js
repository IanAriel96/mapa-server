"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Metodos {
    constructor() { }
    ;
    static calcularCoordenadas(radio) {
        let puntos = [];
        radio = Math.pow(radio, 2);
        let x = Math.sqrt(radio / 4);
        let y = Math.sqrt(radio - Math.pow(x, 2));
        x = x / 111.32; // 111.32 equivale a un grado de longitud en kilometros
        y = y / 111.70; // 111.70 equivale a un grado de latitud en kilometros
        radio = Math.sqrt(radio) / 111.7;
        puntos = [x, y, radio];
        return puntos;
    }
    static escogerColor(uv) {
        if (uv <= 2) {
            return '#43FF33'; //color verde
        }
        else if (uv <= 5 && uv > 2) {
            return '#F9F80D'; // color amarillo
        }
        else if (uv <= 7 && uv > 5) {
            return '#F98204'; // color naranja
        }
        else if (uv <= 10 && uv > 7) {
            return '#FF0000'; // color rojo
        }
        else {
            return '#BB04F9'; // color violeta
        }
    }
    static distinct(value, index, self) {
        return self.indexOf(value) === index;
    }
    ;
    static FijarHora(radiacion) {
        // metodo pendiente en caso de que un sensor no mande los datos poner una referencia y hacerla saber en front end
        for (var objeto of radiacion) {
            switch (objeto) {
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                case 16:
            }
        }
        return radiacion;
    }
    static marcadoresRecientes(radiacion) {
        var ubicaciones = []; // guarda las ubicaciones distinct
        var eliminados = []; // almacenara los index de los objetes que deban ser eliminados
        let i; // utilizado para llevar la cuenta del index al recorrer todo el json
        let x = 0; // utilizado para ayudar a la eliminacion de los objetos
        let bandera; // sirve para entrar a un lazo y almacenar por primera vez un objeto como referencia en la comparacion de los obj json
        let reciente; // objeto que almacenara al primer objeto json y actualizado a lo largo del metodo
        let radio = 1; // radio de los hexagonos
        var coordenadas = Metodos.calcularCoordenadas(radio);
        for (var repetidos of radiacion) { // se separa cada objeto del array de radiacion
            ubicaciones.push(repetidos.ubicacion); // se almacena unicamente las ubicaciones de cada sensor que haya funcionado en ese dia presente
            ubicaciones = ubicaciones.filter(Metodos.distinct); // se llama al metodo distinct para filtrar los repetidos    
        }
        for (var unicos of ubicaciones) { // itera 3 veces por las 3 ubicaciones (itera tantos sensores funcionen en ese dia presente)
            bandera = true; // entraremos solo una vez a guardar el valor de reciente con el primer marcador de radiacion caso contrario hay un error
            i = 0; // inicializamos el index para cada iteracion, la misma que sera usada para saber que index de radiacion eliminar
            reciente = { date: new Date(), index: 0 }; // inicializamos reciente para cada iteracion
            for (var marcador of radiacion) { // itera todo lo que hay en radiacion
                if (bandera === true && unicos === marcador.ubicacion) { // solo en la primera iteracion guardamos en reciente al marcador con la ubicacion de unicos 
                    // la segunda condicion siempre va a cumplir 
                    reciente.date = marcador.hora;
                    reciente.index = i; // guardamos el index debido a que si queremos eliminar el menor despues de encontrarnos con una hora mayor no sabemos cual es el index del marcador menor
                    bandera = false; // una vez actualizado reciente ya no debemos acceder aqui
                }
                else {
                    if (unicos === marcador.ubicacion) { // solo buscamos los marcadores con la misma ubicacion que unicos
                        if (reciente.date >= marcador.hora) { // si la hora de reciente es mayor o igual eliminamos el marcador.hora
                            eliminados.push(i);
                        }
                        else { // si la hora de reciente es menor eliminamos reciente y seteamos el valor al nuevo objeto que es marcador 
                            eliminados.push(reciente.index);
                            reciente.date = marcador.hora;
                            reciente.index = i;
                        }
                    }
                }
                i++; // lleva el conteo del index en el arreglo de objetos json
            }
            ;
        }
        eliminados.sort(function (a, b) {
            return a - b;
        });
        // debido a que si eliminamos un objeto todos los index del arreglo json se descuadran por lo tanto ordenamos y restamos una iteracion a los index ordenados
        for (var num of eliminados) { // eliminados se vuelve en los ordenados   
            radiacion.splice(num - x, 1);
            x++;
        }
        for (var marcador of radiacion) { // añadimos las coordenadas y el color para los poligonos de los marcadores mas recientes por cada sensor que haya funcionado ese dia presente
            marcador.coordenadas = coordenadas;
            marcador.color = Metodos.escogerColor(marcador.uv);
        }
        return radiacion;
    }
    static marcadoresSemanal(radiacion) {
        var ubicaciones = []; // guarda las ubicaciones distinct
        var resumen = 0; // se guarda el resumen del promedio de los uv por fecha
        var temp = 'gg'; // variable para guardar la ubicacion previa para crear el objeto
        var fecha = new Date(); // utilizado como referencia para el condicional y saber el date 
        //console.log("radiacion:",radiacion);
        var i = 0; // entero utilizado para dividir la cantidad de uvs por fecha
        var semanal = new Array(); // almacenamos los objetos con los resumenes
        let obj = {
            ubicacion: 'ubicacion',
            uv: 0,
            hora: 'fecha',
        };
        for (var repetidos of radiacion) { // se separa cada objeto del array de radiacion
            ubicaciones.push(repetidos.ubicacion); // se almacena unicamente las ubicaciones de cada sensor que haya funcionado en ese dia presente
            ubicaciones = ubicaciones.filter(Metodos.distinct); // se llama al metodo distinct para filtrar los repetidos    
        }
        fecha = new Date(radiacion[0].hora); // tomamos el primer date de radiacion para empezar el condicional
        for (var unico of ubicaciones) {
            for (var marcador of radiacion) {
                if (unico === marcador.ubicacion && marcador.hora.getHours() + 5 >= 11 && marcador.hora.getHours() + 5 <= 13) {
                    if (marcador.hora.toLocaleDateString() === fecha.toLocaleDateString()) { // filtramos objs por fecha
                        console.log("ian:", marcador.hora.getHours() + 5, " y fecha debe ser igual ", fecha.toLocaleDateString(), marcador.hora.toLocaleDateString());
                        console.log("entro");
                        resumen = resumen + marcador.uv; // si las fechas coinciden sumamos los uv a resumen
                        i++;
                        temp = unico; // guardamos la ubi en caso de que cambie de fecha y se pierda este dato
                        // console.log("la suma de", unico, " : ",resumen,' la fecha es:', marcador.hora);
                    }
                    else {
                        console.log("ian:", marcador.hora.getHours() + 5, " de ", marcador.hora, " de ", temp);
                        console.log("entro 2", fecha.toLocaleDateString(), marcador.hora.toLocaleDateString());
                        let obj = {
                            ubicacion: 'ubicacion',
                            uv: 0,
                            hora: 'fecha',
                        };
                        resumen = resumen / i; // promedio de /los uvs recolectados
                        //   console.log("el total de ", unico, " : ",resumen,' la fecha es:', marcador.hora);
                        resumen = Math.round(resumen); // redondeamos el valor resumen
                        obj.ubicacion = temp; // guardamos la ubi de referencia para el obj
                        obj.uv = resumen;
                        obj.hora = fecha.toLocaleDateString();
                        semanal.push(obj);
                        resumen = marcador.uv; // inicializamos el nuevo obj resumen
                        fecha = new Date(marcador.hora);
                        i = 1;
                        temp = unico;
                    }
                }
            }
        }
        resumen = resumen / i; // como para guardar un obj resumen se hace cada que cambia la fecha el ultimo cambio es guardado en el array
        // console.log("el total de ", temp, " : ",resumen,' la fecha es:', fecha);
        obj.ubicacion = temp;
        obj.uv = resumen;
        obj.hora = fecha.toLocaleDateString();
        semanal.push(obj);
        return semanal;
    }
    static marcadoresMes(radiacion) {
        var ubicaciones = []; // guarda las ubicaciones distinct
        var resumen = 0; // se guarda el resumen del promedio de los uv por fecha
        var temp = 'gg'; // variable para guardar la ubicacion previa para crear el objeto
        var fecha = new Date(); // utilizado como referencia para el condicional y saber el date 
        var i = 0; // entero utilizado para dividir la cantidad de uvs por fecha
        var mes = new Array(); // almacenamos los objetos con los resumenes
        let obj = {
            ubicacion: 'ubicacion',
            uv: 0,
            hora: new Date(fecha)
        };
        for (var repetidos of radiacion) { // se separa cada objeto del array de radiacion
            ubicaciones.push(repetidos.ubicacion); // se almacena unicamente las ubicaciones de cada sensor que haya funcionado en ese dia presente
            ubicaciones = ubicaciones.filter(Metodos.distinct); // se llama al metodo distinct para filtrar los repetidos    
        }
        temp = radiacion[0].ubicacion;
        fecha = new Date(radiacion[0].hora); // tomamos el primer date de radiacion para empezar el condicional
        for (var unico of ubicaciones) {
            for (var marcador of radiacion) {
                if (unico === marcador.ubicacion && marcador.hora.getHours() + 5 >= 11 && marcador.hora.getHours() + 5 <= 13) {
                    if (marcador.hora.getMonth() === fecha.getMonth() && unico === temp) { // filtramos objs por mes
                        resumen = resumen + marcador.uv; // si las fechas coinciden sumamos los uv a resumen
                        i++;
                        temp = unico;
                        //  console.log("conteoo ",i )                 // guardamos la ubi en caso de que cambie de fecha y se pierda este dato
                    }
                    else {
                        let obj = {
                            ubicacion: 'ubicacion',
                            uv: 0,
                            hora: new Date(),
                        };
                        resumen = resumen / i; // promedio de los uvs recolectados
                        // resumen=Math.round(resumen);     // redondeamos el valor resumen
                        obj.ubicacion = temp; // guardamos la ubi de referencia para el obj
                        obj.uv = resumen;
                        obj.hora = new Date(fecha);
                        mes.push(obj);
                        resumen = marcador.uv; // inicializamos el nuevo obj resumen
                        fecha = new Date(marcador.hora);
                        i = 1;
                        temp = unico;
                    }
                }
            }
        }
        resumen = resumen / i; // como para guardar un obj resumen se hace cada que cambia la fecha el ultimo cambio es guardado en el array
        //  resumen=Math.round(resumen);
        obj.ubicacion = temp;
        obj.uv = resumen;
        obj.hora = new Date(fecha);
        mes.push(obj);
        return mes;
    }
}
exports.default = Metodos;
