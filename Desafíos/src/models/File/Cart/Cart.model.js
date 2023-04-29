import moment from 'moment';
import { config } from '../../../constants/config.js';

export class CartBody {
    constructor() {
        this.timestamp = moment().format(config.timeFormat);
        this.products = [];
    }
}

