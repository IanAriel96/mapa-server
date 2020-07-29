"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Metodos {
    constructor() { }
    ;
    static calcularCoordenadas(radio) {
        let puntos = [];
        radio = Math.pow(radio, 2);
        let x = radio / 2;
        let y = Math.sqrt(radio - Math.pow(x, 2));
        x = x / 111.32; // 111.32 equivale a un grado de longitud en kilometros
        y = y / 111.12; // 111.12 equivale a un grado de latitud en kilometros
        radio = Math.sqrt(radio) / 111.32;
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
    static marcadoresRecientes(radiacion) {
        var ubicaciones = []; // guarda las ubicaciones distinct
        var eliminados = []; // almacenara los index de los objetes que deban ser eliminados
        let i; // utilizado para llevar la cuenta del index al recorrer todo el json
        let x = 0; // utilizado para ayudar a la eliminacion de los objetos
        let bandera; // sirve para entrar a un lazo y almacenar por primera vez un objeto como referencia en la comparacion de los obj json
        let reciente; // objeto que almacenara al primer objeto json y actualizado a lo largo del metodo
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
        return radiacion;
    }
    static marcadoresSemanal(radiacion) {
        var ubicaciones = []; // guarda las ubicaciones distinct
        var resumen = 0; // se guarda el resumen del promedio de los uv por fecha
        var temp = 'sin muestras'; // variable para guardar la ubicacion previa para crear el objeto
        var fecha = new Date(); // utilizado como referencia para el condicional y saber el date 
        var i = 0; // entero utilizado para dividir la cantidad de uvs por fecha
        var semanal = new Array(); // almacenamos los objetos con los resumenes
        for (var repetidos of radiacion) { // se separa cada objeto del array de radiacion
            ubicaciones.push(repetidos.ubicacion); // se almacena unicamente las ubicaciones de cada sensor que haya funcionado en ese dia presente
            ubicaciones = ubicaciones.filter(Metodos.distinct); // se llama al metodo distinct para filtrar los repetidos    
        }
        for (var unico of ubicaciones) {
            for (var marcador of radiacion) {
                if (unico === marcador.ubicacion && marcador.hora.getHours() + 5 >= 10 && marcador.hora.getHours() + 5 <= 16) {
                    if (unico !== temp) { // este if existe debido al problema de fechas cruzadas en el arreglo final
                        fecha = new Date(marcador.hora); // se coge la primera fecha del nuevo filtrado, como resultado todas las muestras salen ordenadas por fecha
                        temp = unico;
                    }
                    if (marcador.hora.toLocaleDateString() === fecha.toLocaleDateString()) { // filtramos objs por fecha
                        resumen = resumen + marcador.uv; // si las fechas coinciden sumamos los uv a resumen
                        i++;
                    }
                    else {
                        if (i == 0) { // garantizo que existio una muestra en las condiciones deseadas
                        }
                        else {
                            let obj = {
                                ubicacion: 'ubicacion',
                                uv: 0,
                                hora: new Date(),
                            };
                            resumen = resumen / i; // promedio de /los uvs recolectados
                            resumen = parseFloat(resumen.toFixed(3));
                            // resumen=Math.round(resumen);     // redondeamos el valor resumen
                            obj.ubicacion = temp; // guardamos la ubi de referencia para el obj
                            obj.uv = resumen;
                            obj.hora = new Date(fecha);
                            semanal.push(obj);
                            resumen = marcador.uv; // inicializamos el nuevo obj resumen
                            fecha = new Date(marcador.hora);
                            i = 1;
                        }
                    }
                }
            }
            if (i !== 0) { // garantizo que existio una muestra en las condiciones deseadas
                let obj = {
                    ubicacion: 'ubicacion',
                    uv: 0,
                    hora: new Date(),
                };
                resumen = resumen / i; // como para guardar un obj resumen se hace cada que cambia la fecha el ultimo cambio es guardado en el array
                resumen = parseFloat(resumen.toFixed(3));
                obj.ubicacion = temp;
                obj.uv = resumen;
                obj.hora = new Date(fecha);
                semanal.push(obj);
            }
        }
        if (i !== 0) { // garantizamos que lo que envie es muestras existentes propias de la BD
            return semanal;
        }
        else {
            return semanal = [];
        }
    }
    static marcadoresMes(radiacion) {
        var ubicaciones = []; // guarda las ubicaciones distinct
        var resumen = 0; // se guarda el resumen del promedio de los uv por fecha
        var temp = 'sin muestras'; // variable para guardar la ubicacion previa para crear el objeto
        var fecha = new Date(); // utilizado como referencia para el condicional y saber el date 
        var i = 0; // entero utilizado para dividir la cantidad de uvs por fecha
        var mes = new Array(); // almacenamos los objetos con los resumenes
        for (var repetidos of radiacion) { // se separa cada objeto del array de radiacion
            ubicaciones.push(repetidos.ubicacion); // se almacena unicamente las ubicaciones de cada sensor que haya funcionado en ese dia presente
            ubicaciones = ubicaciones.filter(Metodos.distinct); // se llama al metodo distinct para filtrar los repetidos    
        }
        for (var unico of ubicaciones) {
            for (var marcador of radiacion) {
                if (unico === marcador.ubicacion && marcador.hora.getHours() + 5 >= 10 && marcador.hora.getHours() + 5 <= 16) {
                    // console.log('marcador:', marcador.ubicacion,marcador.hora, unico, marcador.uv)
                    if (unico !== temp) { // este if existe debido al problema de fechas cruzadas en el arreglo final
                        fecha = new Date(marcador.hora); // se coge la primera fecha del nuevo filtrado, como resultado todas las muestras salen ordenadas por fecha
                        temp = unico;
                    }
                    if (marcador.hora.getMonth() === fecha.getMonth()) { // filtramos objs por fecha
                        resumen = resumen + marcador.uv; // si las fechas coinciden sumamos los uv a resumen
                        i++;
                    }
                    else {
                        if (i == 0) { // garantizo que existio una muestra en las condiciones deseadas
                        }
                        else {
                            let obj = {
                                ubicacion: 'ubicacion',
                                uv: 0,
                                hora: new Date(),
                            };
                            resumen = resumen / i; // promedio de /los uvs recolectados
                            // resumen=Math.round(resumen);     // redondeamos el valor resumen
                            resumen = parseFloat(resumen.toFixed(3));
                            obj.ubicacion = temp; // guardamos la ubi de referencia para el obj
                            obj.uv = resumen;
                            obj.hora = new Date(fecha);
                            mes.push(obj);
                            resumen = marcador.uv; // inicializamos el nuevo obj resumen
                            fecha = new Date(marcador.hora);
                            i = 1; // Reseteamos el conteo a 1 para el nuevo promedio
                        }
                    }
                }
            }
            if (i !== 0) { // garantizo que existio una muestra en las condiciones deseadas
                let obj = {
                    ubicacion: 'ubicacion',
                    uv: 0,
                    hora: new Date(),
                };
                resumen = resumen / i; // como para guardar un obj resumen se hace cada que cambia la fecha el ultimo cambio es guardado en el array
                resumen = parseFloat(resumen.toFixed(3));
                obj.ubicacion = temp;
                obj.uv = resumen;
                obj.hora = new Date(fecha);
                mes.push(obj);
            }
        }
        if (i !== 0) { // garantizamos que lo que envie es muestras existentes propias de la BD
            return mes;
        }
        else {
            return mes = [];
        }
    }
    static maximoMes(radiacion) {
        // la diferencia con semanal es que aqui comparamos todas las muestras para escoger el max
        var ubicaciones = []; // guarda las ubicaciones distinct
        var resumen = 0; // se guarda el max de los uv por fecha
        var temp = 'gg'; // variable para guardar la ubicacion previa para crear el objeto
        var fecha = new Date(); // utilizado como referencia para el condicional y saber el date 
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
        resumen = radiacion[0].uv;
        for (var unico of ubicaciones) {
            for (var marcador of radiacion) {
                // console.log("el mes es:",marcador.hora.getMonth()," fecha es:",fecha.getMonth())
                if (unico === marcador.ubicacion) {
                    if (marcador.hora.getMonth() === fecha.getMonth()) { // filtramos objs por mes
                        if (marcador.uv >= resumen) { // no ponemos en el lazo anterior porque la mayor parte del tiempo sera false este lazo
                            resumen = marcador.uv; // si las fechas coinciden sumamos los uv a resumen
                            temp = unico;
                            // fecha= new Date(marcador.hora);
                        }
                    }
                    else {
                        let obj = {
                            ubicacion: temp,
                            uv: resumen,
                            hora: new Date(fecha),
                        };
                        mes.push(obj);
                        resumen = marcador.uv; // inicializamos el nuevo obj resumen
                        fecha = new Date(marcador.hora);
                        temp = unico; // nos aseguramos del cambio de ubicacion por si acaso despues del lazo de unico
                    }
                }
            }
        }
        obj.ubicacion = temp; // estas ultimas lineas de codigo es para guardar la ultima muestra maxima del mes
        obj.uv = resumen;
        obj.hora = new Date(fecha);
        mes.push(obj);
        return mes;
    }
    static maximoSemana(radiacion) {
        // la diferencia con semanal es que aqui comparamos todas las muestras para escoger el max
        var ubicaciones = []; // guarda las ubicaciones distinct
        var resumen = 0; // se guarda el max de los uv por fecha
        var temp = 'sin muestras'; // variable para guardar la ubicacion previa para crear el objeto
        var fecha = new Date(); // utilizado como referencia para el condicional y saber el date 
        var semana = new Array(); // almacenamos los objetos con los resumenes
        for (var repetidos of radiacion) { // se separa cada objeto del array de radiacion
            ubicaciones.push(repetidos.ubicacion); // se almacena unicamente las ubicaciones de cada sensor que haya funcionado en ese dia presente
            ubicaciones = ubicaciones.filter(Metodos.distinct); // se llama al metodo distinct para filtrar los repetidos    
        }
        for (var unico of ubicaciones) {
            for (var marcador of radiacion) {
                if (unico === marcador.ubicacion) {
                    if (unico !== temp) { // este if existe debido al problema de fechas cruzadas en el arreglo final
                        fecha = new Date(marcador.hora); // se coge la primera fecha del nuevo filtrado, como resultado todas las muestras salen ordenadas por fecha
                        temp = unico;
                    }
                    if (marcador.hora.toLocaleDateString() === fecha.toLocaleDateString()) { // el toLocaleDateString es para tratar los dias de la semana si cambia
                        if (marcador.uv >= resumen) { // filtramos objs por semana
                            resumen = marcador.uv; // si las fechas coinciden sumamos los uv a resumen
                            fecha = new Date(marcador.hora); // guarda la fecha y hora de la max muestra
                        }
                    }
                    else {
                        let obj = {
                            ubicacion: temp,
                            uv: resumen,
                            hora: new Date(fecha)
                        };
                        semana.push(obj);
                        resumen = marcador.uv; // inicializamos el nuevo obj resumen
                        fecha = new Date(marcador.hora);
                    }
                }
            }
            if (temp !== 'sin muestras') { // garantizo que existio una muestra en las condiciones deseadas
                let obj = {
                    ubicacion: 'ubicacion',
                    uv: 0,
                    hora: new Date(),
                };
                obj.ubicacion = temp; // estas ultimas lineas de codigo es para guardar la ultima muestra maxima del mes
                obj.uv = resumen;
                obj.hora = new Date(fecha);
                semana.push(obj);
            }
        }
        if (temp !== 'sin muestras') { // garantizamos que lo que envie es muestras existentes propias de la BD
            return semana;
        }
        else {
            return semana = [];
        }
    }
}
exports.default = Metodos;
