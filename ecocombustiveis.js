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
const Usuario = mongoose.model("Usuario",  usuarioSchema);

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
app.post("/cadastroUsuario", async(req, res)=>{
    const email = req.body.email;
    const senha = req.body.senha;

    //mandando para banco
    const usuario = new Usuario({
        email : email,
        senha : senha,
    })

    const emailExiste = await Usuario.findOne({email:email})

    if(emailExiste) {
        return res.status(400).json({error : "Email Já Existe!"})
    }
    
    if(!email) {
        return res.status(400).json({error : "Email não preenchido!"})
    }
    if(!senha) {
        return  res.status(400).json({error : "Senha não preenchida!"})
    }

    try{
        const newUsuario = await usuario.save();
        res.json({error : null, msg : "Cadastro ok", usuarioId : newUsuario._id});
    } catch(error){
        res.status(400).json({error});
    }
});

app.post("/cadastroEcoCombustiveis", async(req, res)=>{
    const id_combustivel = req.body.id_combustivel;
    const descricao = req.body.descricao;
    const tipo = req.body.tipo;
    const dataRecebimento = req.body.dataRecebimento;
    const litrosEmEstoque = req.body.litrosEmEstoque

    //mandando para banco
    const Comb = new combustivel({
        id_combustivel : id_combustivel,
        descricao : descricao,
        tipo : tipo,
        dataRecebimento : dataRecebimento,
        litrosEmEstoque : litrosEmEstoque
    })

    const idexiste = await combustivel.findOne({id_combustivel:id_combustivel})

    if(idexiste) {
        return res.status(400).json({error : "Id Já Existe!"})
    }

    if(!id_combustivel) {
        return res.status(400).json({error : "Id não preenchida!"})
    }
    if(!descricao) {
        return  res.status(400).json({error : "Descrição não preenchida!"})
    }
    if(!litrosEmEstoque) {
        return res.status(400).json({error : "Litros em estoque não preenchido!"})
    }
    if(!dataRecebimento) {
        return  res.status(400).json({error : "Data não preenchida!"})
    }
    if(!tipo) {
        return  res.status(400).json({error : "Senha não preenchida!"})
    }

    if(litrosEmEstoque > 63) {
        return res.status(400).json({error : "Limite de litros atingido!"})
    }
    if(litrosEmEstoque < 0) {
        return res.status(400).json({error : "Quantidade de litros deve ser entre 0 e 63."})
    }

    try{
        const newComb = await Comb.save();
        res.json({error : null, msg : "Cadastro ok", combustivellId : newComb._id});
    } catch(error){
        res.status(400).json({error});
    }
});

//rota para o get de cadastro
app.get("/cadastroUsuario", async(req, res)=>{
    res.sendFile(__dirname +"/cadastrousuario.html");
})

//rota para o get de cadastro
app.get("/cadastroEcoCombustiveis", async(req, res)=>{
    res.sendFile(__dirname +"/cadastroEcoCombustiveis.html");
})

//rota raiz - inw
app.get("/", async(req, res)=>{
    res.sendFile(__dirname +"/index.html");
})

//configurando a porta
app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`);
})