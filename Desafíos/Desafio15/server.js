import * as dotenv from 'dotenv';
import parseArgs from 'yargs/yargs';
import { startServer } from './app.js';
import { executeServerCluster } from './src/utils/application/execute_on_cluster.js';
import { logger } from './src/utils/loggers/logger.js';
import { MongoConnection } from './src/utils/application/connectMongo.js';

dotenv.config();
const { port, mode } = parseArgs(process.argv.slice(2))
    .option('port', {
        alias: 'p',
        describe: 'Puerto de escucha del servidor',
        default: 8080
    })
    .option('mode', {
        alias: 'm',
        describe: 'Modo de ejecución del servidor',
        choices: ['FORK', 'CLUSTER'],
        default: 'FORK'
    })
    .help()
    .argv;

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

process.on('beforeExit', () => mongoConnection.disconnect());