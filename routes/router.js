//Archivo de rutas
const { render } = require('ejs')
const express = require('express')
const router = express.Router()
const authController =  require('../controllers/authController')

//Rutas de vistas
router.get('/',authController.isAuthentucated,(req, res)=>{
    res.render('index',{user:req.user})
})

router.get('/login',(req, res)=>{
    res.render('login', {alert:false})
})

router.get('/register',(req, res)=>{
    res.render('register')
})

//Rutas de metodos
router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)


module.exports = router

