import { Schema, model } from 'mongoose';

const usuarioSchema = new Schema(
  {
    nombreUsuario: {
      type: String,
    },
    correo: {
        type: String,
    },
    contrasena: {
        type: String,
    },
    confContrasena: {
        type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

export default model('Usuario', usuarioSchema);