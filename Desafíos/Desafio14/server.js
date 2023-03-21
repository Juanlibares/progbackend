import * as dotenv from 'dotenv';
import parseArgs from 'yargs/yargs';
import { startServer } from './app.js';
import { executeServerCluster } from './src/utils/application/execute_on_cluster.js';
import { logger } from './src/utils/loggers/logger.js';
import { MongoConnection } from './src/utils/application/connectMongo.js';

dotenv.config();
const yargs = parseArgs(process.argv.slice(2))

const { port, mode, _ } = yargs
    .alias({
        p: 'port',
        m: 'mode'
    })
    .default({
        port: 8080,
        mode: 'FORK'
    }).argv

const mongoConnection = new MongoConnection();
mongoConnection.connect();

switch (mode.toLowerCase()) {
    case "cluster":
        executeServerCluster(port)
        break;

    default:
        logger.info("Executing app in fork mode");
        startServer(port);
        break;
}

