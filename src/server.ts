import express from "express";
import colors from 'colors';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express';
import swaggerSpec, {swaggerUiOptions} from "./config/swagger";
import productsRouter from "./router";
import db from "./config/db";

// Conectando a bdd
export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        // console.log(colors.blue('Successfully connection to db'))
    } catch (error) {
        // console.log(error)
        console.log(colors.red.bold('Error db Connection'))
    }
}

connectDB()

// instancia de express
const app = express()

// Permitir conexiones
const corsOptions : CorsOptions = {
    origin : function(origin, callback){
        if( origin === process.env.FRONTEND_URL ) {
            callback(null, true)
        }else{
            callback(new Error('Error de cors'))
        }
    }
}
app.use(cors(corsOptions))

// Leer datos de formularios
app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use(morgan('dev'))

// Routing
app.use('/api/products', productsRouter)

// Docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))

export default app