import appService from "../services/app.service.js"
import { fork } from 'child_process';
import path from "path";
import { logger } from "../utils/loggers/logger.js";
import ip from 'ip'

const renderSystemInfo = (req, res) => {
    const { url, method } = req
    logger.info(`Access to route: ${url} method: ${method}`)
    logger.warn(`Access to system info from ${ip.address()}`);
    res.render("system_info", { title: "System Info", info: appService.getSystemInformation() });
}

const renderRandomNumbers = (req, res) => {
    const { url, method } = req
    logger.info(`Access to route: ${url} method: ${method}`)
    const cant = req.query.cant ? Number(req.query.cant) : 100;
    const forked = fork(path.resolve(process.cwd(), "./src/utils/getNumbersCount.js"));
    forked.on("message", (numbers) => res.json(numbers));
    forked.send({ cant });
}

const renderRoot = (req, res) => {
    const user = req.user[0].username;
    const { url, method } = req
    logger.info(`User ${user} has logged in, route: ${url} method: ${method}`)
    res.render('index', { script: 'main', user })
}

export default {
    renderSystemInfo,
    renderRandomNumbers,
    renderRoot
}
