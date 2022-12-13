const {pathname: root} = new URL('../', import.meta.url)
const __dirname=root.substring(1);

let dataPath= __dirname + "/db/ecommerce.sqlite";

export const options = {
    client: 'sqlite3',
    connection: {
        filename: dataPath
    },
    useNullAsDefault: true
}