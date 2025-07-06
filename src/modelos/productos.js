import { Schema, model } from 'mongoose';

const productoSchema = new Schema(
  {
    nombreProducto: {
      type: String,
    },
    codigoOsku: {
        type: Number,
    },
    descripcion: {
        type: String,
    },
    categoria: {
        type: String,
    },
    precioCompra: {
        type: Number,
    },
    precioVenta: {
        type: Number,
    },
    cantidadStock: {
      type: Number,
    },
    stockMinimo: {
      type: Number,
    },
    disponible: {
      type: Boolean,
    },
  },
  { versionKey: false, timestamps: true }
);

export default model('Producto', productoSchema);