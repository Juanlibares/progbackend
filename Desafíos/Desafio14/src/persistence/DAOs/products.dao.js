import knex from 'knex'
import { transformToDTO } from '../DTOs/product.dto.js';
import { logger } from "../../utils/loggers/logger.js";

export class ProductsDao {

    constructor(options, table) {
        this.knex = knex(options)
        this.table = table;
    }

    createTable = async () => {
        let exist = await this.knex.schema.hasTable(this.table);
        if (!exist) {
            return await this.knex.schema.createTable(this.table, table => {
                switch (this.table) {
                    case 'products':
                        table.increments('id').primary();
                        table.string('title').notNullable();
                        table.integer('price').notNullable();
                        table.string('thumbnail').notNullable();
                        break;
                    default:
                        break;
                }
            })
        }
        return false;
    }

    /**
     * Async Method to get all
     * @returns Array of items
     */
    getAll = async () => {
        try {
            let products = await this.knex.select('*').from(this.table);
            return transformToDTO(products);
        } catch (error) {
            logger.error(`Error getting products: ${error}`)
        }
    }

    /**
     * Async Method to save item
     * @param {object} object
     * @returns object
     */
    save = async (object) => {
        try {
            await this.knex(this.table).insert(object)
            return true;
        } catch (error) {
            logger.error(`Error saving product: ${error}`)
            return false;
        }
    }
}
