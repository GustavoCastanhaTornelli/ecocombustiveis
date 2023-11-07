//instalando programas
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

//configurando o roteamento para teste no postman
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const port = 3000;

//configurando o acesso ao mongodb
mongoose.connect('mongodb://127.0.0.1:27017/ecocombustiveis',
{   useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS : 20000
});

//criando a model do seu projeto
const usuarioSchema = new mongoose.Schema({
    email : {type : String, required : true},
    senha : {type : String}
});
const Usuario = mongoose.model("Usuario",  combustivelSchema);

//criando a segunda model
const combustivelSchema = new mongoose.Schema({
    id_combustivel : {type : String, required : true},
    descricao : {type : String},
    tipo : {type : String},
    dataRecebimento : {type : Date},
    litrosEmEstoque : {type : Number}
});
const combustivel = mongoose.model("combustivel", combustivelSchema);

//configurando os roteamentos
app.post("/cadastrousuario", async(req, res)=>{
    const email = req.body.email;
    const senha = req.body.senha;

    //mandando para banco
    const usuario = new Usuario({
        email : email,
        senha : senha,
    })

    try{
        const newUsuario = await usuario.save();
        res.json({error : null, msg : "Cadastro ok", usuarioId : newUsuario._id});
    } catch(error){
        res.status(400).json({error});
    }
});

app.post("/cadastrocombustivel", async(req, res)=>{
    const id_combustivel = req.body.id_combustivel;
    const descricao = req.body.descricao;
    const tipo = req.body.tipo;
    const dataRecebimento = req.body.dataRecebimento;
    const litrosEmEstoque = req.body.litrosEmEstoque

    //mandando para banco
    const combustivel = new combustivel({
        id_combustivel : id_combustivel,
        descricao : descricao,
        tipo : tipo,
        dataRecebimento : dataRecebimento,
        litrosEmEstoque : litrosEmEstoque
    })

    try{
        const combustivel = await combustivel.save();
        res.json({error : null, msg : "Cadastro ok", combustivellId : newcombustivel._id});
    } catch(error){
        res.status(400).json({error});
    }
});

//rota para o get de cadastro
app.get("/cadastrousuario", async(req, res)=>{
    res.sendFile(__dirname +"/cadastrousuario.html");
})

//rota para o get de cadastro
app.get("/cadastrocombustivel", async(req, res)=>{
    res.sendFile(__dirname +"/cadastrocombustivel.html");
})

//rota raiz - inw
app.get("/", async(req, res)=>{
    res.sendFile(__dirname +"/index.html");
})

//configurando a porta
app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`);
})