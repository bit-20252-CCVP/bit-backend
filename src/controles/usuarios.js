import bcrypt from 'bcryptjs';
import UsuarioModel from '../modelos/usuarios.js';
import { getToken } from '../utils/token.js'

const UsuariosController = {
    //CREATE
  create: async (req, res) => {
    try {
      const { nombreUsuario, correo, contrasena, confContrasena } = req.body;
      const encryptedContrasena = await bcrypt.hash(contrasena, 10);
      const encryptedConfContrasena = await bcrypt.hash(confContrasena, 10);
      const newUsuario = new UsuarioModel({
        nombreUsuario,
        correo,
        contrasena: encryptedContrasena,
        confContrasena: encryptedConfContrasena,
      });
      const usuarioCreated = await newUsuario.save();
      res.status(201).json({
        allOK: true,
        message: 'Usuario creado satisfactoriamente',
        data: usuarioCreated,
      });
    } catch (error) {
      res.status(500).json({
        allOK: false,
        message: 'Error creando usuario',
        data: error.message,
      });
    }
  },
  //READALL
  readAll: async (req, res) => {
    try {
      const usuarios = await UsuarioModel.find();
      res.status(200).json({
        allOK: true,
        message: 'Todos los usuarios se encontraron con éxito',
        data: usuarios,
      });
    } catch (error) {
      res.status(500).json({
        allOK: false,
        message: 'Error al encontrar usuarios',
        data: error.message,
      });
    }
  },
  //READONE
  readOne: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await UsuarioModel.findById(id);
      if (!usuario) {
        res.status(404).json({
          allOK: false,
          message: `Usuario con ID ${id} no encontrado`,
          data: null,
        });
      }
      res.status(200).json({
        allOK: true,
        message: `Usuario con ID ${id} encontrado exitosamente`,
        data: usuario,
      });
    } catch (error) {
      res.status(500).json({
        allOK: false,
        message: 'Error, encontrando el usuario ',
        data: error.message,
      });
    }
  },
  //UPDATE
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombreUsuario, correo, contrasena, confContrasena } = req.body;
      const usuarioUpdated = await UsuarioModel.findByIdAndUpdate(id, {
        nombreUsuario,
        correo,
        contrasena,
        confContrasena
      });
      if (!usuarioUpdated) {
        res.status(404).json({
          allOK: false,
          message: `Usuario con ID ${id} no encontrado`,
          data: null,
        });
      }
      res.status(200).json({
        allOK: true,
        message: `Usuario con ID ${id} actualizado exitosamente`,
        data: usuarioUpdated,
      });
    } catch (error) {
      res.status(500).json({
        allOK: false,
        message: 'Error actualizando Usuario',
        data: error.message,
      });
    }
  },
  //DELETE
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const usuarioDeleted = await UsuarioModel.findByIdAndDelete(id);
      if (!usuarioDeleted) {
        res.status(404).json({
          allOK: false,
          message: `Usuario con ID ${id} no encontrado`,
          data: null,
        });
      }
      res.status(200).json({
        allOK: true,
        message: `Usuario con ID ${id} eliminado exitosamente`,
        data: null,
      });
    } catch (error) {
      res.status(500).json({
        allOK: false,
        message: 'Error eliminando usuario',
        data: error.message,
      });
    }
  },


//Loguear al usuario
  login: async (req, res) => {
    try {
      const { username, contrasena } = req.body;
      const usuarioFound = await UsuarioModel.findOne({ correo: username });
      if (!usuarioFound) {
        res.status(401).json({
          allOK: false,
          message: 'Unauthorized.',
          data: null,
        });
      } else {
        const validContrasena = await bcrypt.compare(
          contrasena,
          usuarioFound.contrasena
        );
        if (validContrasena) {
          const token = await getToken({
            id: usuarioFound._id,
            nombreUsuario: usuarioFound.nombreUsuario,
          });
          if (token) {
            res.status(200).json({
              allOK: true,
              message: 'Welcome!',
              data: token,
            });
          } else {
            res.status(200).json({
              allOK: false,
              message: 'An error occurred, please try again.',
              data: null,
            });
          }
        } else {
          res.status(401).json({
            allOK: false,
            message: 'Unauthorized.',
            data: null,
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        allOK: false,
        message: 'Error registering user.',
        data: error.message,
      });
    }
  },
};

export default UsuariosController;