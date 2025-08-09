import { afterAll, afterEach, beforeAll, describe, jest } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import ProductoModel from '../src/modelos/productos.js';

let mongoServer;

beforeAll( async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
});

afterEach( async () => {
    await ProductoModel.deleteMany();
})

afterAll( async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("Producto model test", () => {
    it("Should save a Producto", async () => {
        //Arrange
        const mockProductoObject = {
            nombreProducto: "camisa",
            codigoOsku: "123",
            descripcion: "camisa tipo polo",
            categoria: "Camisas",
            precioCompra: "12000", 
            precioVenta: "30000",
            cantidadStock: "85",
            stockMinimo: "10",
            disponible: "true"
        };
        const mockProducto = new ProductoModel(mockProductoObject);

        //Act
        const savedProducto = await mockProducto.save();

        //Assert
        expect(savedProducto._id).toBeDefined();
        expect(savedProducto.nombreProducto).toBe(mockProductoObject.nombreProducto);
    });
});
