

export default class Metodos{
     constructor() {};
     static calcularCoordenadas(radio: number ) {
        let puntos: number [] = [];
        radio = Math.pow(radio, 2);
        let x = Math.sqrt(radio / 4);
        let y = Math.sqrt(radio - Math.pow(x, 2));
        x = x / 111.32; // 111.32 equivale a un grado de longitud en kilometros
        y = y / 111.70; // 111.70 equivale a un grado de latitud en kilometros
        radio = Math.sqrt(radio) / 111.7;
        puntos = [x, y, radio];
        return puntos;
    }
    
     static escogerColor(uv: number) { // metodo para seleccionar el color del poligono segun el indice uv
        if (uv <= 2) {
          return '#43FF33';
        } else if (uv <= 5 && uv > 2  ) {
          return '#F9F80D';
         } else if (uv <= 7 && uv  > 5 ) {
              return '#F98204';
         } else if (uv <= 10 && uv > 7  ) {
              return '#FF0000';
         } else {
              return '#BB04F9';
         }
          } 
     static distinct(value:any, index:any, self:any) {
          return self.indexOf(value) === index;
      };
     static ubicacionesUnicas(radiacion:any){
          let ubicaciones: string[] = [];
          for(var marcador of radiacion){
               ubicaciones.push(marcador.ubicacion);
           }
     }
     static marcadoresRecientes(radiacion:any){
     var ubicaciones: string[] = []; // guarda las ubicaciones distinct
     let i:number;
     let bandera: boolean;
     let reciente;
     let radio = 1 ;
     var coordenadas: number[] = Metodos.calcularCoordenadas(radio);
          for(var repetidos of radiacion){
               ubicaciones.push(repetidos.ubicacion);
               ubicaciones = ubicaciones.filter(Metodos.distinct);     
          }
          for(var unicos of ubicaciones){ // itera 3 veces por las 3 ubicaciones
               bandera = true; // nos permite entrar solo una vez al marcador de ubi: unicos 
               i=0; // inicializamos el index para cada iteracion 
               reciente = {date:new Date(),index:0}; // inicializamos reciente para cada iteracion
          for(var marcador of radiacion){ // itera todo lo que hay en radiacion
               if( bandera === true && unicos === marcador.ubicacion){ // en la primera iteracion guardamos el marcador mas reciente
                    reciente.date = marcador.hora;
                    reciente.index = i; // guardamos el index debido a que si queremos eliminar el menor despues de encontrarnos con una hora mayor no sabemos cual es el index del marcador menor
                    bandera = false;     // una vez actualizado reciente ya no debemos acceder aqui
               }else{
                   if(unicos === marcador.ubicacion){
                       if(reciente.date>=marcador.hora){ // si la hora es mayor o igual eliminamos el marcador.hora
                           radiacion.splice(i,1);
                       }
                       else{    // si la hora es menor al marcador.hora eliminamos a reciente y actualizamos reciente
                           radiacion.splice(reciente.index,1);
                           reciente.date = marcador.hora;
                           reciente.index = i;
                       }
                   }
               }
                   i++;
          };
          }
          for(var marcador of radiacion){
               marcador.coordenadas = coordenadas;
               marcador.color=Metodos.escogerColor(marcador.uv);
          }
          return radiacion;
     }
}