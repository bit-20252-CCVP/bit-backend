import { Router } from "express";
import UsuariosController from '../controles/usuarios.js';

const usuariosRouter = Router();

//usuariosRouter.post('/', UsuariosController.create);
usuariosRouter.get('/', UsuariosController.readAll);
usuariosRouter.get('/:id', UsuariosController.readOne);
usuariosRouter.put('/:id', UsuariosController.update);
usuariosRouter.delete('/:id', UsuariosController.delete);

usuariosRouter.post('/sign-up', UsuariosController.create);
usuariosRouter.post('/sign-in', UsuariosController.login);

export default usuariosRouter; 