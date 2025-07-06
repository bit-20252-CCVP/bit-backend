import { Router } from "express";
import ProductosController from '../controles/productos.js';

const productosRouter = Router();

productosRouter.post('/', ProductosController.create);
productosRouter.get('/', ProductosController.readAll);
productosRouter.get('/:id', ProductosController.readOne);
productosRouter.put('/:id', ProductosController.update);
productosRouter.delete('/:id', ProductosController.delete);

export default productosRouter; 