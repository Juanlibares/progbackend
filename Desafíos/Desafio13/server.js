import * as dotenv from 'dotenv';
import parseArgs from 'yargs/yargs';
import { connectDB } from './src/utils/connectMongo.js';
import { startServer } from './app.js';
import { executeServerCluster } from './src/utils/execute_on_cluster.js';
import { logger } from './src/utils/logger.js';

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

connectDB();

switch (mode.toLowerCase()) {
    case "cluster":
        executeServerCluster(port)
        break;

    default:
        logger.info("Executing app in fork mode");
        startServer(port);
        break;
}
