import { describe, expect, jest } from '@jest/globals';

// Mock del modelo
jest.unstable_mockModule("../src/modelos/productos.js", () => {
    const mockConstructor = jest.fn();
    mockConstructor.find = jest.fn();
    mockConstructor.findById = jest.fn();
    mockConstructor.findByIdAndUpdate = jest.fn();
    mockConstructor.findByIdAndDelete = jest.fn();
    return { default: mockConstructor };
});

const { ProductosController } = await import("../src/controles/productos.js");
const ProductoModel = (await import("../src/modelos/productos.js")).default;

describe("ProductosController tests", () => {
    
    // CREATE
    it("Should create a producto successfully", async () => {
        const mockProducto = { id: "123", nombreProducto: "Test producto" };
        const saveMock = jest.fn().mockResolvedValue(mockProducto);
        ProductoModel.mockImplementation(() => ({ save: saveMock }));

        const req = { body: { nombreProducto: "Test producto" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await ProductosController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            allOK: true,
            message: 'Producto creado satisfactoriamente',
            data: mockProducto,
        });
    });

    it("Should return 500 if create fails", async () => {
        const saveMock = jest.fn().mockRejectedValue(new Error("DB error"));
        ProductoModel.mockImplementation(() => ({ save: saveMock }));

        const req = { body: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await ProductosController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            allOK: false,
            message: 'Error creando producto',
            data: 'DB error',
        });
    });

    // READALL
    it("Should return all productos with a status code 200", async () => {
        const mockProductoList = [];
        ProductoModel.find.mockResolvedValue(mockProductoList);

        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await ProductosController.readAll(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            allOK: true,
            message: 'Todos los productos se encontraron con éxito',
            data: mockProductoList,
        });
    });

    it("Should return 500 if readAll fails", async () => {
        const dbErrorMock = new Error("DB fail");
        ProductoModel.find.mockRejectedValue(dbErrorMock);

        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await ProductosController.readAll(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            allOK: false,
            message: 'Error al encontrar productos',
            data: 'DB fail',
        });
    });

    // READONE
    it("Should return producto if found", async () => {
        const mockProducto = { id: "123" };
        ProductoModel.findById.mockResolvedValue(mockProducto);

        const req = { params: { id: "123" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await ProductosController.readOne(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            allOK: true,
            message: `Producto con ID 123 encontrado exitosamente`,
            data: mockProducto,
        });
    });

    it("Should return 404 if producto not found", async () => {
        ProductoModel.findById.mockResolvedValue(null);

        const req = { params: { id: "999" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await ProductosController.readOne(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it("Should return 500 if readOne fails", async () => {
        ProductoModel.findById.mockRejectedValue(new Error("DB error"));

        const req = { params: { id: "123" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await ProductosController.readOne(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            allOK: false,
            message: 'Error, encontrando el producto ',
            data: 'DB error',
        });
    });

    // UPDATE
    it("Should update producto successfully", async () => {
        const mockProducto = { id: "123" };
        ProductoModel.findByIdAndUpdate.mockResolvedValue(mockProducto);

        const req = { params: { id: "123" }, body: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await ProductosController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("Should return 404 if producto not found to update", async () => {
        ProductoModel.findByIdAndUpdate.mockResolvedValue(null);

        const req = { params: { id: "999" }, body: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await ProductosController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it("Should return 500 if update fails", async () => {
        ProductoModel.findByIdAndUpdate.mockRejectedValue(new Error("DB error"));

        const req = { params: { id: "123" }, body: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await ProductosController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            allOK: false,
            message: 'Error actualizando producto',
            data: 'DB error',
        });
    });

    // DELETE
    it("Should delete producto successfully", async () => {
        const mockProducto = { id: "123" };
        ProductoModel.findByIdAndDelete.mockResolvedValue(mockProducto);

        const req = { params: { id: "123" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await ProductosController.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("Should return 404 if producto not found to delete", async () => {
        ProductoModel.findByIdAndDelete.mockResolvedValue(null);

        const req = { params: { id: "999" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await ProductosController.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it("Should return 500 if delete fails", async () => {
        ProductoModel.findByIdAndDelete.mockRejectedValue(new Error("DB error"));

        const req = { params: { id: "123" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await ProductosController.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            allOK: false,
            message: 'Error eliminando producto',
            data: 'DB error',
        });
    });

});