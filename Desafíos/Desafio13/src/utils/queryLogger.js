import winston from 'winston'
import moment from 'moment'

function buildProdLogger() {
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
            new winston.transports.File({ filename: './logs/queries.log', level: 'debug' })
        ]
    })
}

let queryLogger = buildProdLogger()

export default queryLogger