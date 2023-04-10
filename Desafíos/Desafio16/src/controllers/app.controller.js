import appService from "../services/app.service.js"
import { fork } from 'child_process';
import path from "path";
import { logger } from "../utils/loggers/logger.js";
import ip from 'ip'

const renderSystemInfo = async (ctx) => {
    const { url, method } = ctx.request;
    logger.info(`Access to route: ${url} method: ${method}`);
    logger.warn(`Access to system info from ${ip.address()}`);
    await ctx.render("system_info", {
        title: "System Info",
        info: appService.getSystemInformation()
    });
};


const renderRandomNumbers = async (ctx) => {
    const { url, method } = ctx.request;
    logger.info(`Access to route: ${url} method: ${method}`);

    const cant = ctx.query.cant ? Number(ctx.query.cant) : 10;
    const child = fork(path.resolve(process.cwd(), './src/utils/application/getNumbersCount.js'));

    child.on('message', (numbers) => {
        ctx.body = JSON.stringify(numbers);
    });

    child.send({ cant });
};


const renderRoot = async (ctx) => {
    const user = ctx.state.user[0].username;
    const { url, method } = ctx.request;
    logger.info(`User ${user} has logged in, route: ${url} method: ${method}`);
    await ctx.render("index", { script: "main", user });
};


export default {
    renderSystemInfo,
    renderRandomNumbers,
    renderRoot
}
