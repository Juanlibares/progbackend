import { getSystemInfo } from "../utils/getSysteminfo.js";
import {fork} from 'child_process';
import path from "path";

function renderSystemInfo(__, res) {
    res.render("system_info", { title: "System Info", info: getSystemInfo() });
}

function renderRandomNumbers(req, res) {
    const cant = req.query.cant ? Number(req.query.cant) : 100000000;
    const forked = fork(path.resolve(process.cwd(), "./src/utils/getNumbersCount.js"));
    forked.on("message", (numbers) => res.json(numbers));
    forked.send({ cant });
}

export {
    renderSystemInfo,
    renderRandomNumbers
}