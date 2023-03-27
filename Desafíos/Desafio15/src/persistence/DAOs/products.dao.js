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

    getAll = async () => {
        try {
            let products = await this.knex.select('*').from(this.table);
            return transformToDTO(products);
        } catch (error) {
            logger.error(`Error getting products: ${error}`)
        }
    }

    save = async (object) => {
        try {
            const [itemID] = await this.knex(this.table).insert(object);
            return await this.getProductById(itemID)

        } catch (error) {
            const response = {
                error: 1,
                message: `Error saving product`
            }
            logger.error(`Error saving product: ${error}`)
            return response;
        }
    }

    getProductById = async (id) => {
        const errorResponse = [{
            error: 1,
            message: `Product not found`
        }]
        try {
            let product = await this.knex.select("*").from(this.table).where("id", id);
            if (!product.length) {
                return errorResponse;
            }
            return transformToDTO(product);

        } catch (error) {
            logger.error(`Product not found: ${error}`)
            return errorResponse;
        }
    }

    updateProduct = async (id, data) => {
        const errorResponse = {
            error: 1,
            message: `Product not found`
        }
        try {
            await this.knex(this.table).where("id", id).update(data);
            return await this.getProductById(id);
        } catch (error) {
            return errorResponse;
        }
    }

    deleteProduct = async (id) => {
        let response = {};
        let del = await this.knex(this.table).where("id", id).del();
        if (del == 1) {
            response.error = 0,
            response.message = `The product with id: ${id} has been deleted`;
        } else {
            response.error = 1;
            response.message = "Task could not be completed, product not found";
        }
        return response;
    }
}
