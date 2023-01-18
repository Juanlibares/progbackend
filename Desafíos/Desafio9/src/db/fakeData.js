import { faker } from '@faker-js/faker'
faker.locale = 'es'

export const fakeProds = () => ({
    title: faker.commerce.product(),
    price: faker.commerce.price(),
    thumbnail: faker.image.avatar()
});