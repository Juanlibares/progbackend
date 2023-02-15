import winston from 'winston'
import moment from 'moment'

const LEVEL = Symbol.for('level');

function filerLevel(level){
    return winston.format(function(info){
        if (info[LEVEL] == level) return info
    })();
}

function defaultLogger(){
    return winston.createLogger({
        format: winston.format.combine(
            winston.format.timestamp({
                format: () => {
                    return moment().format('YYYY-MM-DD HH:mm:ss');
                }
            }),
            winston.format.json()
        ),
        transports: [
            new winston.transports.Console({ level: 'debug' }),
            new winston.transports.File({ filename: './logs/warn.log', level: 'warn' , format: filerLevel('warn')}),
            new winston.transports.File({ filename: './logs/error.log', level: 'error' })
        ]
    })
}

let logger = defaultLogger()

export {
    logger
}