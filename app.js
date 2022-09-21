const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

const app = express()

//Seteamos motor de plantilla 
app.set('view engine', 'ejs')

//seteamos carpeta public para archivos estaticos
app.use(express.static('public'))

//para procesar datos enviador desde form
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//seteamos variables de entorno
dotenv.config({path: './env/.env'})

//para trabajar con cookies
app.use(cookieParser())

//Llamar ak router
app.use('/', require('./routes/router'))

app.listen(3002, ()=>{
    console.log('ok servidor')
})