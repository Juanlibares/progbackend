import { startServer } from "../../app.js";
import { getSystemInfo } from "./getSysteminfo.js";
import cluster from 'cluster';
import { logger } from "./logger.js";

export function executeServerCluster(port) {
    if (cluster.isPrimary) {
        logger.info("Executing app in cluster mode");
        const cpus = getSystemInfo().processors;

        // Forking to workers
        for (let i = 0; i < cpus; i++) cluster.fork();

        cluster.on("exit", (worker) => {
            logger.warn(`Worker ${worker.process.pid} died`);
            cluster.fork();
        });

        cluster.on("listening", (worker) => {
            logger.info(`New Worker ${worker.process.pid} is alive and listening`)
        });
    } else {
        startServer(port)
    }
}