export default class ProductDTO {
    constructor({ title, price, thumbnail, id }) {
        this.title = title
        this.price = parseInt(price)
        this.thumbnail = thumbnail
        this.id = id
    }
}

export function transformToDTO(products) {
    if (Array.isArray(products)) {
        return products.map(p => new ProductDTO(p))
    } else {
        return new ProductDTO(products)
    }
}