const fs = require('fs')

class Contenedor {
    constructor(file) {
        this.file = file;
    }

    save = async (file, obj) => {        // Funcionando
        await fs.readFile(this.file, 'utf-8', async (err) => {
            if (err) {
                console.log('error al leer el archivo ' + err);
                throw new Error('ERROR AL LEER');
            }
            console.log('Se puede leer bien');
            let productos = JSON.parse(fs.readFileSync(this.file, 'utf-8'));
            obj.id = productos.length + 1;
            productos.push(obj);
            await fs.writeFileSync(file, JSON.stringify(productos, null, 2));
            console.log(obj.id);
        })
    }

    getById = (id2) => {        // Funcionando
        try {
            const arch = JSON.parse(fs.readFileSync(this.file, 'utf-8'));
            const obj = arch.find(({id}) => id === id2);
            obj ? console.log(obj) : console.log('No existe un elemento con ese ID.');
        } catch {
            console.log(`ERROR: ${err}`);
            throw new Error(err);
        }
    }

    getAll = async () => {      // Funcionando
        try {
            const productos = JSON.parse(await fs.promises.readFile(this.file, 'utf-8'));
            return console.log(productos);
        } catch (er) {
            console.log(`Error al leer el archivo: ${er}`);
        }
    }

    deleteById = async (id3) => {       // Funcionando
        try {
            let arch = JSON.parse(fs.readFileSync(this.file, 'utf-8'));
            arch = arch.filter(obj => obj.id != id3);
            await fs.promises.writeFile(this.file, JSON.stringify(arch, null, 2))
            console.log(arch);
        } catch (err) {
            console.log(`ERROR: ${err}`);
            throw new Error(err);
        }
    }
    
    deleteAll = async () => {     // Funcionando
        await fs.writeFile(this.file, '[]', (err) => {
            if (err) throw err;
            console.log('products.txt/.json was deleted');
        });
    }
}

let prueba = new Contenedor('./products.txt');
// prueba.save('./products.txt', {                                                                                                                                                    
//     title: 'Play Station 5',                                                                                                                          
//     price: 350000,                                                                                                                                     
//     thumbnail: 'https://www.mercadolibre.com.ar/sony-playstation-5-825gb-standard-color-blanco-y-negro/p/MLA16171888?pdp_filters=category:MLA438566#searchVariation=MLA16171888&position=1&search_layout=stack&type=product&tracking_id=3b709319-3800-4a1d-a316-2d3a914b6938',                                                                                                                                                                                 
//   });
//prueba.deleteAll();
//prueba.getAll();
//prueba.getById(2);
prueba.deleteById(5);