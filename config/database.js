const mongoose = require('mongoose')

const conexao = async() => {
    //conexao local
    //var bdlocal = await mongoose.connect('mongodb+srv://userAdmin:qweasdzxc1234@fiaptecnico.5oane.mongodb.net/crud')
    //conexao atlas
    // var atlas = await mongoose.connect('mongodb+srv://userAdmin:qweasdzxc1234@fiaptecnico.5oane.mongodb.net/crud')
    var atlas = await mongoose.connect('mongodb+srv://UserAdmin:0Kv8BNOlx8vXCFJR@fiaptecnico.eftcw.mongodb.net/test')
}

module.exports = conexao

