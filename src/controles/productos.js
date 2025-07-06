import ProductoModel from '../modelos/productos.js';

const ProductosController = {
    //CREATE
  create: async (req, res) => {
    try {
      const { nombreProducto, codigoOsku, descripcion, categoria, precioCompra, precioVenta, cantidadStock, stockMinimo, disponible } = req.body;
      const newProducto = new ProductoModel({
        nombreProducto,
        codigoOsku,
        descripcion,
        categoria,
        precioCompra, 
        precioVenta,
        cantidadStock,
        stockMinimo,
        disponible
      });
      const productoCreated = await newProducto.save();
      res.status(201).json({
        allOK: true,
        message: 'Producto creado satisfactoriamente',
        data: productoCreated,
      });
    } catch (error) {
      res.status(500).json({
        allOK: false,
        message: 'Error creando producto',
        data: error.message,
      });
    }
  },
  //READALL
  readAll: async (req, res) => {
    try {
      const productos = await ProductoModel.find();
      res.status(200).json({
        allOK: true,
        message: 'Todos los productos se encontraron con éxito',
        data: productos,
      });
    } catch (error) {
      res.status(500).json({
        allOK: false,
        message: 'Error al encontrar productos',
        data: error.message,
      });
    }
  },
  //READONE
  readOne: async (req, res) => {
    try {
      const { id } = req.params;
      const producto = await ProductoModel.findById(id);
      if (!producto) {
        res.status(404).json({
          allOK: false,
          message: `Producto con ID ${id} no encontrado`,
          data: null,
        });
      }
      res.status(200).json({
        allOK: true,
        message: `Producto con ID ${id} encontrado exitosamente`,
        data: producto,
      });
    } catch (error) {
      res.status(500).json({
        allOK: false,
        message: 'Error, encontrando el producto ',
        data: error.message,
      });
    }
  },
  //UPDATE
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombreProducto, codigoOsku, descripcion, categoria, precioCompra, precioVenta, cantidadStock, stockMinimo, disponible} = req.body;
      const productoUpdated = await ProductoModel.findByIdAndUpdate(id, {
        nombreProducto,
        codigoOsku,
        descripcion,
        categoria,
        precioCompra, 
        precioVenta,
        cantidadStock,
        stockMinimo,
        disponible
      });
      if (!productoUpdated) {
        res.status(404).json({
          allOK: false,
          message: `Producto con ID ${id} no encontrado`,
          data: null,
        });
      }
      res.status(200).json({
        allOK: true,
        message: `Producto con ID ${id} actualizado exitosamente`,
        data: productoUpdated,
      });
    } catch (error) {
      res.status(500).json({
        allOK: false,
        message: 'Error actualizando producto',
        data: error.message,
      });
    }
  },
  //DELETE
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const productoDeleted = await ProductoModel.findByIdAndDelete(id);
      if (!productoDeleted) {
        res.status(404).json({
          allOK: false,
          message: `Producto con ID ${id} no encontrado`,
          data: null,
        });
      }
      res.status(200).json({
        allOK: true,
        message: `Producto con ID ${id} eliminado exitosamente`,
        data: null,
      });
    } catch (error) {
      res.status(500).json({
        allOK: false,
        message: 'Error eliminando producto',
        data: error.message,
      });
    }
  },
};

export default ProductosController;