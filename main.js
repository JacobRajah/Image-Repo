const MongoClient = require('mongodb').MongoClient;
require('dotenv').config() //set env
const readline = require('readline');
const prompt = require('prompt-sync')({sigint: true})
const image_repo = require('./image_repo');
//url connecting to mongo database
uri = process.env.DB

//Driver function for interfacing database with client
async function driver() {
    const db = await MongoClient.connect(uri)
    const dbo = await db.db('ImageRepo');
    console.log('Welcome to Image Repo!')
    // Collect user information for attatching to images uploaded,
    // purchases and verification
    var user_info = []
    const name = prompt('What is your name: ');
    user_info.push(name);
    console.log(`Hey there ${name}`);
    const number = prompt('Please enter your phone number: ');
    user_info.push(number);
    const location = prompt('Where do you live? ');
    user_info.push(location);

    var ready = true;
    // Loop ends when ready is false
    while(ready){
        // Prompt users to choose what they would like to do
        console.log(`${name} you can: Add an Image, Buy an Image, Search Images or Modify properties of Image(s)`)
        const opt = prompt('What would you like to do? (add, buy, search, modify, exit): ')
        // Buy an image if the image is for Sale
        if(opt.toLowerCase() == 'buy'){
            const id = prompt("Please specify the name of the image you'd like to buy: ")
            var resp = await image_repo.buyImage(dbo, id, user_info)
            if (await resp == 0){
                console.log("Could not purchase because image was not for sale, or not found")
            }
            else{
                console.log("Purchased! Image Ownership Transferred");
            }
            // End Buy
        }
        // Search for an image or images based on a descriptor of choice
        else if(opt.toLowerCase() == 'search'){
            var search_method = prompt('Enter the type of search (name, description, price, size, location, status): ');
            const search_target = prompt(`What is the ${search_method} you are looking for? `)
            search_method = search_method.toLowerCase().replace("description", "descriptors").replace("name",
             "_id").replace("location", "owner");
            if(search_method == '_id' || search_method == 'descriptors' || search_method == 'price'
                || search_method == 'size' || search_method == 'owner' || search_method == 'status')
                {
                    var results = await image_repo.findImagesbyParameter(dbo, search_method, search_target)
                    image_repo.dispImageData(await results);
                }
            // End Search
        }
        // Modify the properties of images already on the repo and 
        else if(opt.toLowerCase() == 'modify'){
            var toBeMod = prompt('What would you like to modify? (price, status): ')
            // Modify the price of an image
            if (toBeMod.toLowerCase() == 'price'){
                const id = prompt('What is the name of the image? ')
                const new_p = prompt('What would you like to change the price to? ')
                var res = await image_repo.setPrice(dbo, id, new_p, user_info[1]);
                if (await res == 0){
                    console.log("Unable to set price. Ensure you are the owner of the image and have the correct id");
                }
                else {
                    console.log("Price Updated!")
                }
            }
            // Modify the status of an image(s)
            else if(toBeMod.toLowerCase() == 'status'){
                const approach = prompt('Would you like to change status by name or description (name, description) ');
                if(approach.toLowerCase() == "name"){
                    const id = prompt('What is the name of the image? ');
                    const new_status = prompt('What is the new status? (private, forsale) ');
                    if(new_status.toLowerCase() == "private"){
                        var res = await image_repo.changeStatusByID(dbo, id, "Private", user_info[1]);
                        await res ? console.log("Updated Image Status") : console.log("Owner does not own any image with specified ID")
                    }
                    else if(new_status.toLowerCase() == "forsale"){
                        var res = await image_repo.changeStatusByID(dbo, id, "For Sale", user_info[1]);
                        await res ? console.log("Updated Image Status") : console.log("Owner does not own any image with specified ID")
                    }
                }
                else if (approach.toLowerCase() == "description"){
                    const descriptor = prompt('What is the descriptor? ');
                    const new_status = prompt('What is the new status? (private, forsale) ');
                    if(new_status.toLowerCase() == "private"){
                        var res = await image_repo.changeStatusByDescriptor(dbo, descriptor, "Private", user_info[1])
                        await res ? console.log("Updated Image Status") : console.log("Owner does not own any image with specified ID")
                    }
                    else if(new_status.toLowerCase() == "forsale"){
                        var res = await image_repo.changeStatusByDescriptor(dbo, descriptor, "For Sale", user_info[1])
                        await res ? console.log("Updated Images Status") : console.log("Owner does not own any images with descriptors")
                    }
                }
            }
            // End modify
        }
        // If true then prompt user for image properties then add image to the repo
        else if(opt.toLowerCase() == 'add'){
            var id = prompt('What is the name of the image? ');
            var valid = await image_repo.checkID(dbo, id);
            while(!valid){
                id = prompt('Name not unique! Try Again! ');
                valid = image_repo.checkID(dbo, id);
            }
            const url = prompt('What is the url to the image? ');
            const descriptors = prompt('Enter descriptor words for this image spaced. (Ex: Scenic Tropical) ').split(" ")
            const price = prompt('How much is the image? ')
            const size = prompt('What is the size of the image ');
            var resp = await image_repo.addImage(dbo, id, url, descriptors, price, size, user_info);

            console.log(`${await resp} image added to the repository`)

        }
        // Exit the program
        else if(opt.toLowerCase() == 'exit'){ready=false}
    }
    // Close the connection to the database
    db.close();

}

// Run the Program
driver()