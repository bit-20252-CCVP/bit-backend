import { describe, expect, jest } from '@jest/globals';

// Mock del modelo de usuario
jest.unstable_mockModule("../src/modelos/usuarios.js", () => {
    const mockConstructor = jest.fn();
    mockConstructor.find = jest.fn();
    mockConstructor.findById = jest.fn();
    mockConstructor.findByIdAndUpdate = jest.fn();
    mockConstructor.findByIdAndDelete = jest.fn();
    mockConstructor.findOne = jest.fn();
    return { default: mockConstructor };
});

// Mock de bcrypt
jest.unstable_mockModule("bcryptjs", () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

// Mock de getToken
jest.unstable_mockModule("../src/utils/token.js", () => ({
    getToken: jest.fn(),
}));

const { UsuariosController } = await import("../src/controles/usuarios.js");
const UsuarioModel = (await import("../src/modelos/usuarios.js")).default;
const bcrypt = await import("bcryptjs");
const { getToken } = await import("../src/utils/token.js");

describe("UsuariosController tests", () => {

    // CREATE
    it("Should create usuario successfully", async () => {
        const mockUsuario = { id: "1", nombreUsuario: "Test user" };
        bcrypt.hash.mockResolvedValue("hashedPass");
        const saveMock = jest.fn().mockResolvedValue(mockUsuario);
        UsuarioModel.mockImplementation(() => ({ save: saveMock }));

        const req = { body: { nombreUsuario: "Test user", correo: "test@test.com", contrasena: "123", confContrasena: "123" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await UsuariosController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            allOK: true,
            message: 'Usuario creado satisfactoriamente',
            data: mockUsuario,
        });
    });

    it("Should return 500 if create fails", async () => {
        bcrypt.hash.mockResolvedValue("hashedPass");
        const saveMock = jest.fn().mockRejectedValue(new Error("DB error"));
        UsuarioModel.mockImplementation(() => ({ save: saveMock }));

        const req = { body: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await UsuariosController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            allOK: false,
            message: 'Error creando usuario',
            data: 'DB error',
        });
    });

    // READALL
    it("Should return all usuarios", async () => {
        const mockUsuarios = [{ id: 1 }];
        UsuarioModel.find.mockResolvedValue(mockUsuarios);

        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await UsuariosController.readAll(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("Should return 500 if readAll fails", async () => {
        UsuarioModel.find.mockRejectedValue(new Error("DB fail"));

        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await UsuariosController.readAll(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // READONE
    it("Should return usuario if found", async () => {
        UsuarioModel.findById.mockResolvedValue({ id: "1" });

        const req = { params: { id: "1" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await UsuariosController.readOne(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("Should return 404 if usuario not found", async () => {
        UsuarioModel.findById.mockResolvedValue(null);

        const req = { params: { id: "2" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await UsuariosController.readOne(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it("Should return 500 if readOne fails", async () => {
        UsuarioModel.findById.mockRejectedValue(new Error("DB error"));

        const req = { params: { id: "1" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await UsuariosController.readOne(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // UPDATE
    it("Should update usuario successfully", async () => {
        UsuarioModel.findByIdAndUpdate.mockResolvedValue({ id: "1" });

        const req = { params: { id: "1" }, body: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await UsuariosController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("Should return 404 if usuario not found to update", async () => {
        UsuarioModel.findByIdAndUpdate.mockResolvedValue(null);

        const req = { params: { id: "2" }, body: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await UsuariosController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it("Should return 500 if update fails", async () => {
        UsuarioModel.findByIdAndUpdate.mockRejectedValue(new Error("DB error"));

        const req = { params: { id: "1" }, body: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await UsuariosController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // DELETE
    it("Should delete usuario successfully", async () => {
        UsuarioModel.findByIdAndDelete.mockResolvedValue({ id: "1" });

        const req = { params: { id: "1" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await UsuariosController.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("Should return 404 if usuario not found to delete", async () => {
        UsuarioModel.findByIdAndDelete.mockResolvedValue(null);

        const req = { params: { id: "2" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await UsuariosController.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it("Should return 500 if delete fails", async () => {
        UsuarioModel.findByIdAndDelete.mockRejectedValue(new Error("DB error"));

        const req = { params: { id: "1" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await UsuariosController.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // LOGIN
    it("Should login successfully and return token", async () => {
        UsuarioModel.findOne.mockResolvedValue({ _id: "1", nombreUsuario: "Test", contrasena: "hashed" });
        bcrypt.compare.mockResolvedValue(true);
        getToken.mockResolvedValue("mockToken");

        const req = { body: { username: "test@test.com", contrasena: "123" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await UsuariosController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("Should return 401 if usuario not found", async () => {
        UsuarioModel.findOne.mockResolvedValue(null);

        const req = { body: { username: "wrong@test.com", contrasena: "123" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await UsuariosController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
    });

    it("Should return 401 if password invalid", async () => {
        UsuarioModel.findOne.mockResolvedValue({ contrasena: "hashed" });
        bcrypt.compare.mockResolvedValue(false);

        const req = { body: { username: "test@test.com", contrasena: "wrong" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await UsuariosController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
    });

    it("Should return 200 but fail if token not generated", async () => {
        UsuarioModel.findOne.mockResolvedValue({ _id: "1", nombreUsuario: "Test", contrasena: "hashed" });
        bcrypt.compare.mockResolvedValue(true);
        getToken.mockResolvedValue(null);

        const req = { body: { username: "test@test.com", contrasena: "123" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await UsuariosController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            allOK: false,
            message: 'An error occurred, please try again.',
            data: null,
        });
    });

    it("Should return 500 if login throws error", async () => {
        UsuarioModel.findOne.mockRejectedValue(new Error("DB error"));

        const req = { body: { username: "test@test.com", contrasena: "123" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await UsuariosController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

});