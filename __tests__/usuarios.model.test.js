import { afterAll, afterEach, beforeAll, describe, jest } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import UsuarioModel from '../src/modelos/usuarios.js';

let mongoServer;



beforeAll( async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
});

afterEach( async () => {
    await UsuarioModel.deleteMany();
})

afterAll( async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("Usuario model test", () => {
    it("Should save a usuario", async () => {
        //Arrange
        const mockUsuarioObject = {
            nombreUsuario: "paula parra",
            correo: "paula@gmail.com",
            contrasena: "123123",
            confContrasena: "123123"
        };
        const mockUsuario = new UsuarioModel(mockUsuarioObject);

        //Act
        const savedUsuario = await mockUsuario.save();

        //Assert
        expect(savedUsuario._id).toBeDefined();
        expect(savedUsuario.nombreUsuario).toBe(mockUsuarioObject.nombreUsuario);
    });
});



