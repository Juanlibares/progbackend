class Usuario {
    constructor(nombre, apellido, libros, mascotas) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.libros= libros;
        this.mascotas = mascotas;
    }

    getfullname() {                
        let concatenado = `Nombre: ${this.nombre}\nApellido: ${this.apellido}`
        return console.log(concatenado);
    }

    addMascota(namepet){           
        this.mascotas.push(namepet);
    }

    countMascotas(){
        return console.log(this.mascotas.length);
    }

    addBook(libro, autor) {
        this.libros.push({libro:libro, autor:autor});
    }

    getBookNames(){
        const array2 = this.libros.map((a) =>  a.libro)
        return console.log(array2);
    }
}

const usuario2 = new Usuario("Juan Pablo", "Libares de Lamadrid", [{libro:"Carrie", autor:"Stephen King"}], ["Lila", "Malevo"]);
usuario2.addBook("Cementerio de Animales", "King");
usuario2.addMascota("Chifle");
usuario2.getfullname();
usuario2.countMascotas();
usuario2.getBookNames();
