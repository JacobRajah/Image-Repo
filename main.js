const MongoClient = require('mongodb').MongoClient;
require('dotenv').config() //set env
uri = process.env.DB
// Status can be Private, For sale

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

// Accessor id refers to the owners phone number
function ChangeStatusByID(id, new_status, accessor_id) {
    const updates = {$set: {status: new_status}}
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        dbo = db.db('ImageRepo');
        dbo.collection('Images').updateOne({_id: id, owner: accessor_id}, updates, function(err, res){
            if (err) throw err;
            if (res.result.nModified == 0){
                console.log("Owner does not own any image with specified ID")
            }
            else{
                console.log("Updated Image Status")
            }
        });
        db.close();
    });
}

//Accessor id refers to the owners phone number
function ChangeStatusByDescriptor(descriptor, new_status, accessor_id) {
    const updates = {$set: {status: new_status}};
    const search_param = {descriptors: descriptor, owner: accessor_id};
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        dbo = db.db('ImageRepo');
        dbo.collection('Images').updateMany(search_param, updates, function(err, res){
            if (err) throw err;
            if (res.result.nModified == 0){
                console.log("Owner does not own any images with descriptors")
            }
            else{
                console.log("Updated Images Status")
            }
        });
        db.close();
    });
}

// Can only change price if owner
function setPrice(id, price, accessor_id) {
    const updates = {$set: {price: price}}
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        dbo = db.db('ImageRepo');
        dbo.collection('Images').updateOne({_id: id, owner: accessor_id}, updates, function(err, res){
            if (err) throw err;
            if (res.result.nModified == 0){
                console.log("Unable to set price. Ensure you are the owner of the image and have the correct id");
            }
            else {
                console.log("Price Updated!")
            }
        });
        db.close()
    });
}

// search for image based on id
function findImagebyId(id) {
    MongoClient.connect(uri, function(err, db){
        if (err) throw err;
        dbo = db.db('ImageRepo');
        dbo.collection('Images').findOne({_id: id}, function(err, res){
            if(err) throw err;
            if(res == null){
                console.log('There is no image with this name')
            }
            else {
                console.log(res);
            }
        });
        db.close();
    });
}

// search for image based on descriptor. Need parsing function for disp
// Assumed that Param is within correct parameters
function findImagesbyParameter(param, value) {
    const search_param = {[param]: value};
    MongoClient.connect(uri, function(err, db){
        if (err) throw err;
        dbo = db.db('ImageRepo');
        dbo.collection('Images').find(search_param).toArray(function(err, res){
            if(err) throw err;
            if(res == null){
                console.log('There are no images with this descriptor')
            }
            else {
                console.log(res);
            }
        });
        db.close();
    });

}

// Buy an image, so change status to sold and owner to the acquirer
// acquirer is a list
function buyImage(id, acquirer) {
    const changes = {$set: {status: "Private", owner: acquirer}};
    MongoClient.connect(uri, function(err, db){
        if (err) throw err;
        dbo = db.db("ImageRepo");
        dbo.collection('Images').updateOne({_id: id, status: "For Sale"}, changes, function(err, res){
            if (err) throw err;
            if (res.result.nModified == 0){
                console.log("Could not purchase because image was not for sale, or not found")
            }
            else{
                console.log("Purchased! Image Ownership Transferred");
            }
        });
        db.close();
    })
}

// Displays the Images from Search Request
function dispImageData(params) {
    
}

// addImage('House on the Lake', 'https://wallpaperstock.net/wallpapers/thumbs1/44902wide.jpg',
//  ['Scenic', 'waterfall', 'Forest', 'House'], "$50", "120x60",
//   ['Jacob', '4166667777', 'Toronto, Ontario']);

// addImage('CN-Tower', 'www.bob.com',
//  ['Building', 'Sky Scrapper', 'Toronto'], "$40", "120x120",
//   ['Bob', '444', 'Brampton, Ontario']);

// removeImage("Me")

// ChangeStatusByID("Rick", "Private", '333')

// ChangeStatusByDescriptor('Scenic', 'For Sale', '4166667777')

// setPrice("CN-Tower", "$75", "444")

// findImagebyId("CN-Tower");

// findImagesbyParameter("status", "For Sale")

// buyImage("House on the Lake", ["Ericka", "4166667771", "Missisauga"]) 