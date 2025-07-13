import 'dotenv/config';
import connectDB from './configuracion/db.js';
import express from 'express';
import morgan  from 'morgan';
import cors from 'cors';
import usuariosRouter from './rutas/usuarios.js';
import productosRouter from './rutas/productos.js';


const server = express();
const host = process.env.HOST;
const port = process.env.PORT;

connectDB();

server.use(cors());
server.use(express.json());
server.use(morgan('dev'));
server.use('/usuarios', usuariosRouter);
server.use('/productos', productosRouter);

server.get("/", (request, response)=>{
    response.status(204).send()
});

server.listen(port, ()=>{
    console.log(`Server is runnig at ${host} on port ${port}`);
});