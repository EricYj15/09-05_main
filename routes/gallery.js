const { request } = require('express')
const multer = require('multer')
// fs File System
var fs = require('fs')

module.exports = (app)=>{

    //importar o config database
    var database = require('../config/database')
    //importar o model gallery
    var gallery = require('../models/gallery')
    
    //exibir o formulario gallery.ejs
    app.get('/gallery', async(req,res)=>{
        //conectar com o database
        database()
        //executar a busca de documentos da coleção gallery
        var documentos = await gallery.find()
        res.render('gallery.ejs',{dados:documentos})
    })

    //importar a config do molter
    var upload = require('../config/multer')
    //upload do arquivo
    app.post('/gallery',(req,res)=>
    {
        //upload das imagens
        upload(req,res,async (err)=>{
            if(err instanceof multer.MulterError){
                res.send('O arquivo é maior que 10Mb')
            }else if(err){
                res.send('Tipo de arquivo inválido')
            }else{
                //conectar o database
                database()
                //gravar o nome do arquivo na coleção gallery
                var documento = await new gallery({
                arquivo:req.file.filename
                }).save()
                res.redirect('/gallery')
            }
        })
    })

    //visualizar a imagem selecionada
    app.get('/alterar_gallery',async(req, res) => {
        //recuperar o parâmetro id da barra de endereço
        var id = req.query.id
        //procurar por um documento com o id
        var busca = await gallery.findOne({_id:id})
        //abrir p arquivo gallery_alterar
        res.render('gallery_alterar.ejs',{dados:busca})
    })

    //alterar a imagem gravada no documento
    app.post('/alterar_gallery',(req,res) => {
        //upload das imagens
        upload(req,res,async (err)=>{
            if(err instanceof multer.MulterError){
                res.send('O arquivo é maior que 10Mb')
            }else if(err){
                res.send('Tipo de arquivo inválido')
            }else{
                // excluir com o arquivo anterior 
                fs.unlinkSync('uploads/'+req.body.anterior)
                //conectar o database
                database()
                //alterar o nome do arquivo na coleção gallery
                var documento = await gallery.findOneAndUpdate(
                    {_id:req.query.id},
                    {arquivo:req.file.filename}
                    )
                res.redirect('/gallery')
            }
        })
    })

     //visualizar a imagem que sera excluida
     app.get('/excluir_gallery',async(req, res) => {
        //recuperar o parâmetro id da barra de endereço
        var id = req.query.id
        //procurar por um documento com o id
        var busca = await gallery.findOne({_id:id})
        //abrir p arquivo gallery_alterar
        res.render('gallery_excluir.ejs',{dados:busca})
    })

    //excluir a imagem selecionada 
    app.post('/excluir_galery',async(req,res)=>{
        //excluir o arquivo da pasta uploads
        fs.unlinkSync('uploads/'+req.body.anterior)
        //excluir o documento da coleçao gallery
        var excluir = await gallery.findOneAndRemove({_id:req.query.id})
        //voltar para a pagina gallery
        res.reedirect('/gallery')
    })
}