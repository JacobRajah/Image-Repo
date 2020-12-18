const MongoClient = require('mongodb').MongoClient;
require('dotenv').config() //set env
uri = process.env.DB
// Status can be Private, For sale, Auction

function addImage(name, img, descriptors, price, size, owner){
    const struct = {_id: name, url: img, descriptors: descriptors, price: price,
         size: size, owner: owner, status: 'Private'}
    MongoClient.connect(uri, function(err, db){
        if (err) throw err;
        dbo = db.db('ImageRepo');
        dbo.collection('Images').insertOne(struct, function(err, res){
            if (err) throw err;
            console.log('Insert Successful');
        });
        db.close()
    });
}

// Admin Function
function removeImage(id) {
    const toberemoved = {_id: id};
    MongoClient.connect(uri, function(err, db){
        if (err) throw err;
        dbo = db.db('ImageRepo');
        dbo.collection('Images').deleteOne(toberemoved, function(err, res){
            if (err) throw err;
            console.log('Deletion Successful')
        })
        db.close();
    })
}

function ChangeStatusByID(id, new_status) {
    const updates = {$set: {status: new_status}}
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        dbo = db.db('ImageRepo');
        dbo.collection('Images').updateOne({_id: id}, updates, function(err, res){
            if (err) throw err;
            console.log("Document updated");
        });
        db.close()
    });
}

function ChangeStatusByDescriptor(descriptor, new_status) {
    const updates = {$set: {status: new_status}}
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        dbo = db.db('ImageRepo');
        dbo.collection('Images').updateMany({descriptors: descriptor}, updates, function(err, res){
            if (err) throw err;
            console.log("Documents updated");
        });
        db.close();
    });
}

function setPrice(id, price) {
    const updates = {$set: {price: price}}
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        dbo = db.db('ImageRepo');
        dbo.collection('Images').updateOne({_id: id}, updates, function(err, res){
            if (err) throw err;
            console.log("Price Updated!");
        });
        db.close()
    });
}

// search for image based on id
function findImagebyId(params) {
    
}

// search for image based on descriptor. Need parsing function for disp
function findImagesbyDescriptor(params) {
    
}

// Buy an image, so change status and owner
function buyImage(params) {
    
}
// get the owner of an image
function getOwner(params) {
    
}

// Displays the Images from Search Request
function dispImageData(params) {
    
}

// addImage('Me', 'www.me.com',
//  ['Jacob', 'Self-Portrait', 'Person'], "$11", "60x60",
//   ['Jacob', '4166667777', 'Toronto, Onatrio']);

// addImage('CN-Tower', 'www.bob.com',
//  ['Building', 'Sky Scrapper', 'Toronto'], "$40", "120x120",
//   ['Bob', '444', 'Brampton, Ontario']);

// removeImage("Rick")

// ChangeStatusByID("CN-Tower", "Sold")

// ChangeStatusByDescriptor('Animal', 'Auction')

// setPrice("Me", "$25")