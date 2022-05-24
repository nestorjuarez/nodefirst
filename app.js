const express = require('express');
const config = require('config');
const morgan = require('morgan');
const logger = require('./logger');
const Joi = require('joi');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(morgan('tiny'));
app.use(logger);

console.log("Aplicacion: "+config.get('nombre'));
console.log("BD server: "+config.get('configDB.host'))
const usuarios = [{"id":1,"first_name":"Rosabel","last_name":"Oakley","email":"roakley0@linkedin.com"},
{"id":2,"first_name":"Trudi","last_name":"Burless","email":"tburless1@sohu.com"},
{"id":3,"first_name":"Auberta","last_name":"Naptine","email":"anaptine2@howstuffworks.com"},
{"id":4,"first_name":"Rinaldo","last_name":"Cord","email":"rcord3@xinhuanet.com"},
{"id":5,"first_name":"Colly","last_name":"Bernocchi","email":"cbernocchi4@shop-pro.jp"},
{"id":6,"first_name":"Julius","last_name":"Ondrasek","email":"jondrasek5@hp.com"},
{"id":7,"first_name":"Rouvin","last_name":"Dunmore","email":"rdunmore6@europa.eu"},
{"id":8,"first_name":"Cornell","last_name":"Hickisson","email":"chickisson7@illinois.edu"},
{"id":9,"first_name":"Estelle","last_name":"Gillyatt","email":"egillyatt8@shareasale.com"},
{"id":10,"first_name":"Lorelei","last_name":"Holston","email":"lholston9@weebly.com"},
{"id":11,"first_name":"Roch","last_name":"Zaniolo","email":"rzanioloa@oaic.gov.au"},
{"id":12,"first_name":"Bartel","last_name":"Wycliff","email":"bwycliffb@china.com.cn"},
{"id":13,"first_name":"Ravi","last_name":"Matchett","email":"rmatchettc@issuu.com"},
{"id":14,"first_name":"Lurleen","last_name":"Harrowing","email":"lharrowingd@51.la"},
{"id":15,"first_name":"Theda","last_name":"Donaghie","email":"tdonaghiee@bloglines.com"}];


app.get('/', (req, res) => {
  res.send('Hola bienvenido al adm usuarios');
});

app.get('/api/usuarios', (req, res)=>{
  res.send(usuarios);
});

app.get('/api/usuarios/:id', (req, res) => {
  let usuario = existeUsuario(req.params.id);
  if(!usuario) res.status(404).send('El usuario no fue encontrado');

  res.send(usuario);
});

app.post('/api/usuarios', (req, res) => {


    const {error, value} = validarUsuario(req.body);
    if(!error){
      let usuario = {
        id: usuarios.length + 1,
        first_name:value.first_name,
        last_name: value.last_name,
        email:value.email
      };

      usuarios.push(usuario);
      res.send(usuario);

    }else{
      const mensaje = error.details[0].message;
      res.status(400).send(mensaje);
    }


});

app.put('/api/usuarios/:id', (req, res) => {
  let usuario = existeUsuario(req.params.id);

  if (!usuario){
    res.status(404).send("El usuario no existe!!!!");
    return;

  }



    const {error, value} = validarUsuario(req.body);

      if(error){
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
      }

      usuario.first_name = value.first_name;
      usuario.last_name = value.last_name;
      usuario.email = value.email;

      res.send(usuario);

});


app.delete('/api/usuarios/:id', (req,res) =>{
  let ususario = existeUsuario(req.params.id);
  if(!usuario){
    res.status(404).send("El usuario no se encontro");
    return;
  }

  const index = usuarios.indexOf(usuario);
  usuarios.scplice(index, 1);
})
const port = process.env.PORT || 3000;

app.listen(port, ()=>{
  console.log(`escuhando en el puerto ${port}`);
});

function existeUsuario(id){
  return(usuarios.find(usu => usu.id === parseInt(id)));
}


function validarUsuario(miobj)
{
  const schema = Joi.object({
      first_name: Joi.string().min(3).required(),
      last_name:Joi.string().min(3).required(),
      email:Joi.string().email().required()
    });

    return(schema.validate(
      {
        first_name: miobj.first_name,
        last_name: miobj.last_name,
        email:miobj.email

      }));
}
