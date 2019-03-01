const express = require('express');
const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const db = require('./db/index')
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/user', async (req, res) => {
    const query = 'select * from account'
    const response = await db.query(query)
    await db.end()
    if (response.rows['0'] == null) {
        res.send({
            menssage: 'no se encontraron usuarios'
        })
    } else {
        res.send(response.rows['0'])
    }
    // pool.query(query,(err,resp)=>{
    //     if(err){
    //         const response = {data:null, messageL: err.message}
    //         res.send(response)
    //     }
    //     const users = {...resp.rows['0']}
    //     const response = {
    //         data: users,
    //         massage: 'All user successfully retrieved.'
    //     }
    //     res.send(response)
    // })
});
app.get('/user/:id', async (req, res) => {
    const id = req.params.id
    const response = await db.query('select * from account where id = $1', [id])
    await db.end()
    if (response.rows['0'] == null) {
        res.send({
            menssage: 'El usuario no existe'
        })
    } else {
        res.send(response.rows['0'])
    }
});

app.post('/user', async (req, res) => {
    const {
        username,
        password,
        email
    } = req.body
    try {
        const response = await db.query('insert into account (username,password,email) values ($1,$2,$3)', [username, password, email])
        await db.end()
        res.send(response.rows['0'])
    } catch (e) {
        res.send({
            error: e.detail
        })
    }
});

app.put('/user/:id', async (req, res) => {
    const id = req.params.id
    const {
        username,
        password,
        email } = req.body
    try{
        let response = await db.query('select * from account where id = $1',[id])
        if(response.rowCount !== 0){
            await db.query('update account set username = $1, password = $2, email = $3 where id = $4', [username,password,email,id])
            res.send({id,username,password,email})
        }else if (response){
            res.send({error:'usuario no encontrado'})
        }
    }catch(e){
        res.send({
            error
        })
    }
});

app.delete('/user/:id', async (req, res) => {
    const id = req.params.id
    try {
        const response = await db.query('delete from account where id = $1', [id])
        await db.end()
        if (response.rowCount === 0) {
            res.send({
                error: 'no se encontro ningun usuario con este id'
            })
        } else {
            res.send({
                message: "usuario eliminado satisfactoriamente"
            })
        }
    } catch (e) {
        res.send({
            error: e.detail
        })
    }
});
app.all('*', (req, res) => {
    const response = {
        data: null,
        message: 'Route not found!!'
    }
    res.status(400).send(response)
});

module.exports.handler = serverless(app)