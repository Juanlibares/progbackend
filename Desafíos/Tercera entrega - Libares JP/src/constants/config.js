import * as dotenv from 'dotenv'
dotenv.config()

const selectedDatabase = 1;

const config = {
    admin: true,
    timeFormat: "DD-MM-YYYY HH:mm:ss",

    productsCollection: "product",
    cartCollection: "cart",

    mySql: {
        client: "mysql",
        connection: {
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PWD,
            database: process.env.MYSQL_DB,
        },
        useNullAsDefault: true,
    },

    sqlite: {
        client: "sqlite3",
        connection: {
        },
        useNullAsDefault: true,
    },

    mongoUri:process.env.MONGO_REMOTE
};


const Error = {
    notFound: (res) =>
        res.status(404).json({ error: -10, description: "Item not found" }),

    unauthorized: (req, res) =>
        res.status(401).json({
            error: -1,
            description: `Unauthorized execution of ${req.method} on ${req.hostname}${req.originalUrl}`,
        }),

    notComplete: (res) =>
        res.status(400).json({
            error: -20,
            description: "Task could not be completed"
        }),

    notImplemented: (req, res) =>
        res.status(401).json({
            error: -2,
            description: `Route ${req.hostname}${req.originalUrl} method ${req.method} not implemented `,
        }),

    cartNotFound: (res) =>
        res.status(404).json({ error: -10, description: "Cart not found" }),

};

export { config, Error, selectedDatabase };