// Initializing Mongo client
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config() //set env
// URL to access Mongo database. Ensure if using your own mongoDB to 
// setup a database named 'ImageRepo' with a sub collection named 'Images'
uri = process.env.DB

// Takes user parameters for an image object and creates an entry in the
// database with the image. Images pre-set to Private initially.
async function addImage(dbo, name, img, descriptors, price, size, owner){
    const struct = {_id: name, url: img, descriptors: descriptors, price: price,
         size: size, owner: owner, status: 'Private'}
    const res = await dbo.collection('Images').insertOne(struct)
     
    return await res.insertedCount
}

// Admin Function for removing an image if necessary
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

// id: Name of the image. new_status: Either Private or For Sale.
// accessor_id refers to the owners phone number. 
// changes the status of an image only if it is owned by the user
async function changeStatusByID(dbo, id, new_status, accessor_id) {
    const updates = {$set: {status: new_status}};
    var res = await dbo.collection('Images').updateOne({_id: id, owner: accessor_id}, updates);
    // Return 0: means that the status was not changed because the id did not exist or the user
    // does not own the image.
    // Return 1: means that the status was successfully updated for specified image
    return await res.result.nModified;
}

// descriptor: key word description of images wished to have there status changed.
// new_status: Either Private or For Sale. accessor_id refers to the owners phone number. 
// changes the status of any images matching descriptor only if it is owned by the user.
async function changeStatusByDescriptor(dbo, descriptor, new_status, accessor_id) {
    const updates = {$set: {status: new_status}};
    const search_param = {descriptors: descriptor, owner: accessor_id};
    var res = await dbo.collection('Images').updateMany(search_param, updates);
    // Returns 0: means that no updates occured because no images matched the descriptor
    // or because the current user is not the owner of any of the images found
    // Returns 1: means that the updates occured successfully
    return await res.result.nModified;
}

// id: name of the image. price: price to set. accessor_id: current user's phone number
// Changes the price of an image owned by the current user.
async function setPrice(dbo, id, price, accessor_id) {
    const updates = {$set: {price: price}};
    var res = await dbo.collection('Images').updateOne({_id: id, owner: accessor_id}, updates);
    // Returns 0: means that the price could not be changed because the image does not
    // exist or the current user isnt the owner.
    // Returns 1: means the price successfully changed
    return await res.result.nModified;
}

// search for image based on descriptor (value).
// Assumed that Param is within correct parameters
async function findImagesbyParameter(dbo, param, value) {
    const search_param = {[param]: value};
    
    var found = await dbo.collection('Images').find(search_param).toArray()
        
    if(await found == null){
        console.log('There are no images with this descriptor')
        return []
    }
    else {
        // returns list of elements that much param: value
        return found;
    }
    
}

// Buy an image, so change status to sold and owner to the acquirer
// acquirer is a list of user information
async function buyImage(dbo, id, acquirer) {
    const changes = {$set: {status: "Private", owner: acquirer}};
    var res = await dbo.collection('Images').updateOne({_id: id, status: "For Sale"}, changes);
    // Returns 0: if could not purchase because image was not for sale, or not found   
    // Return 1: if purchase and transaction successful
    return await res.result.nModified;
}

//Checks if the users desired image name is unique. Returns True if unique
async function checkID(dbo, id) {
    var res = await dbo.collection('Images').find({_id: id}).toArray();
    return await res.length == 0
}

// Displays the Images from Search Request
function dispImageData(results) {
    console.log(`Your search returned ${results.length} images:`);
    console.log()
    for(var i = 0; i < results.length; i++){
        console.log(`Name: ${results[i]._id}    Price: ${results[i].price}    Size: ${results[i].size}`);
        console.log(`Owner: ${results[i].owner[0]}    Location: ${results[i].owner[2]}`);
        console.log(`Status: ${results[i].status}`);
        console.log()
    }
}

// Exporting functions for use in Main.js
module.exports = {
    addImage: addImage,
    removeImage: removeImage,
    changeStatusByID: changeStatusByID,
    changeStatusByDescriptor: changeStatusByDescriptor,
    setPrice: setPrice,
    findImagesbyParameter: findImagesbyParameter,
    buyImage: buyImage,
    dispImageData: dispImageData,
    checkID: checkID
}