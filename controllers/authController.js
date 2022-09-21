const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const {promisify} = require('util')

//procedimiento para registrarnos
exports.register = async (req,res)=>{
    try {
        const user = req.body.user
        const pass = req.body.pass
        let passHash = await bcryptjs.hash(pass, 8)
        let sql = 'INSERT INTO users SET ?';

        conexion.query(sql,{user:user,pass:passHash}, (error, result)=>{
            if (error){console.log(error)}
            res.redirect('/')
        })
    } catch (error) {
        console.log(error)
    }    
}

exports.login = async (req,res)=>{
    try {
        const user = req.body.user
        const pass = req.body.pass
        if (!user || !pass) {
            
            res.render('login',{
                alert:true,
                alertTitle: "Advertencia",
                alertMessage:"Ingrese Usuario y Contraseña",
                alertIcon:'info',
                showConfirmButton:true,
                timer: false,
                ruta:'login'
            })
            
        }else{
            conexion.query('SELECT * FROM users WHERE user = ?' , [user] , async (error,results)=>{
                if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
                    //Credenciales incorrectas
                    res.render('login',{
                        alert:true,
                        alertTitle: "Error",
                        alertMessage:"Usuario y/o contraseña incorrectas",
                        alertIcon:'error',
                        showConfirmButton:true,
                        timer: false,
                        ruta:'login'
                    })
                }else{
                    //Inicio de session ok
                    const id = results[0].id
                    const token = jwt.sign({id:id}, process.env.JWT_SECRETO,{
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })

                    const cookiesOptions = {
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRA * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie('jwt',token,cookiesOptions)
                    res.render('login',{
                        alert:true,
                        alertTitle: "Conexion exitosa",
                        alertMessage:"Login correcto",
                        alertIcon:'success',
                        showConfirmButton: false,
                        timer: 800,
                        ruta:''
                    })
                }
            })
        }

    } catch (error) {
        console.log(error)
    }    
}

//Sistema de autenticacion, Definir este metodo a aquella pagina q necesite estar logeado para ingresar
exports.isAuthentucated = async (req,res,next)=>{
    
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            conexion.query('SELECT * FROM users WHERE id= ?', [decodificada.id], (error,results)=>{
                if (!results){return next()}
                req.user = results[0]
                return next()
            })   
        } catch (error) {
            console.log(error)
        }    
    }else{
        res.redirect('/login')
    }        
}

exports.logout = (req,res)=>{
    res.clearCookie('jwt')
    return res.redirect('/')
}
    