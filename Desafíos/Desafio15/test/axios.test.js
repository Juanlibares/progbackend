import { deepStrictEqual } from 'assert';
import { describe, it } from "mocha";
import axios from 'axios';
import { expect } from "chai";
import { fakeProds } from '../src/utils/application/fakeData.js'

const uri = "http://localhost:8080/products";

describe("CHECKING SERVER ONLINE ASSERT TEST", function () {
    before(function () {
        console.log("---------- ASSERT TEST STARTS  --------");
    })
    after(function () {
        console.log("---------- ASSERT TEST ENDS --------");
    })

    it("Read products", async function () {
        const { data } = await axios(uri);
        deepStrictEqual(true, Array.isArray(data))
    })
    it("Create Product", async function () {
        const newProduct = fakeProds();
        const { data } = await axios.post(uri, newProduct);
        const newData = await axios.get(`${uri}/${data.id}`);
        deepStrictEqual(data, newData.data)
        await axios.delete(`${uri}/${data.id}`);
    })
    it("Update Product", async function () {
        const newProduct = fakeProds();
        let response = await axios.post(uri, newProduct);
        let insertedProduct = response.data;
        insertedProduct.price = 2500;
        response = await axios.put(`${uri}/${insertedProduct.id}`, insertedProduct);
        deepStrictEqual(response.data, insertedProduct)
        await axios.delete(`${uri}/${response.data.id}`);
    })
    it("Remove product", async function () {
        const newProduct = fakeProds();
        let response = await axios.post(uri, newProduct);
        let insertedProduct = response.data;
        response = await axios.delete(`${uri}/${insertedProduct.id}`);
        deepStrictEqual(response.data.error, 0)
    })

})

describe("CHECKING SERVER ONLINE CHAI TEST", async function () {

    before(function () {
        console.log("---------- CHAI TEST STARTS  --------");
    })
    after(function () {
        console.log("---------- CHAI TEST ENDS --------");
    })

    it("Get all products", async function () {
        const { data } = await axios(uri);
        expect(Array.isArray(data)).to.eql(true)
    })

    it("Create product", async function () {
        const newProduct = fakeProds();
        const response = await axios.post(uri, newProduct);
        expect(response.data).to.deep.equal({ id: response.data.id, ...newProduct })
        await axios.delete(`${uri}/${response.data.id}`);
    })
    it("Update Product", async function () {
        const newProduct = fakeProds();
        let response = await axios.post(uri, newProduct);
        let insertedProduct = response.data;
        insertedProduct.price = 2500;
        response = await axios.put(`${uri}/${insertedProduct.id}`, insertedProduct);
        expect(response.data).to.deep.equal(insertedProduct)
        await axios.delete(`${uri}/${response.data.id}`);
    })
    it("Remove product", async function () {
        const newProduct = fakeProds();
        let response = await axios.post(uri, newProduct);
        let insertedProduct = response.data;
        response = await axios.delete(`${uri}/${insertedProduct.id}`);
        expect(response.data.error).to.deep.equal(0)

    })
})