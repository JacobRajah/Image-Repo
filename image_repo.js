const MongoClient = require('mongodb').MongoClient;
require('dotenv').config() //set env
uri = process.env.DB
// Status can be Private, For sale

async function addImage(dbo, name, img, descriptors, price, size, owner){
    const struct = {_id: name, url: img, descriptors: descriptors, price: price,
         size: size, owner: owner, status: 'Private'}
    const res = await dbo.collection('Images').insertOne(struct)
     
    return await res.insertedCount
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
// Status can be Private, For sale
async function changeStatusByID(dbo, id, new_status, accessor_id) {
    const updates = {$set: {status: new_status}}
    var res = await dbo.collection('Images').updateOne({_id: id, owner: accessor_id}, updates)
    
    if (res.result.nModified == 0){
        return 0;
        // console.log("Owner does not own any image with specified ID")
    }
    else{
        return 1;
        // console.log("Updated Image Status")
    }
}

//Accessor id refers to the owners phone number
// Changes status to specified for any images owned with descriptor
// Status can be Private, For sale
async function changeStatusByDescriptor(dbo, descriptor, new_status, accessor_id) {
    const updates = {$set: {status: new_status}};
    const search_param = {descriptors: descriptor, owner: accessor_id};
    var res = await dbo.collection('Images').updateMany(search_param, updates);
    
    if (await res.result.nModified == 0){
        return 0;
        // console.log("Owner does not own any images with descriptors")
    }
    else{
        return 1;
        // console.log("Updated Images Status")
    }

}

// Can only change price if owner
async function setPrice(dbo, id, price, accessor_id) {
    const updates = {$set: {price: price}}
    var res = await dbo.collection('Images').updateOne({_id: id, owner: accessor_id}, updates)
    
    if (await res.result.nModified == 0){
        return 0;
        // console.log("Unable to set price. Ensure you are the owner of the image and have the correct id");
    }
    else {
        return 1
        // console.log("Price Updated!")
    }

}

// search for image based on descriptor. Need parsing function for disp
// Assumed that Param is within correct parameters
async function findImagesbyParameter(dbo, param, value) {
    const search_param = {[param]: value};
    
    var found = await dbo.collection('Images').find(search_param).toArray()
        
    if(await found == null){
        console.log('There are no images with this descriptor')
        return []
    }
    else {
        return found;
    }
    
}

// Buy an image, so change status to sold and owner to the acquirer
// acquirer is a list
async function buyImage(dbo, id, acquirer) {
    const changes = {$set: {status: "Private", owner: acquirer}};
    
    var res = await dbo.collection('Images').updateOne({_id: id, status: "For Sale"}, changes)
        
    if (await res.result.nModified == 0){
        return 0
        // console.log("Could not purchase because image was not for sale, or not found")
    }
    else{
        return 1
        // console.log("Purchased! Image Ownership Transferred");
    }

}

//Checks if the users desired id is unique. Returns True if unique
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