# Image Repository

The image repository program uses MongoDb for storing images and Node.js for interfacing with the database. The node built interface allows users to buy, search, add and even modify the status'/prices of images in the repository.

## Getting Started

### Prerequisites

The first step in using this software is to download a local copy of the code. The source code can be downloaded directly through GitHub or can be cloned out using git as follows:

```
$ git clone https://github.com/JacobRajah/Image-Repo.git
```

Once you have a copy of the source code, ensure you have **npm** installed and run the following command in the package.json direectory to install all necessary node modules locally:

```
$ npm install
```

### Running the Program

You are now ready to run the software! Simply execute the following in the directory containing **main.js**:

```
$ node main.js
```

## Working with the Image Repo

Once the program is started, you will be prompted to enter contact information. It is important that if you have already uploaded images to the repo to use the same contact info as when you uploaded images before, otherwise you will not be able to modify properties of those previous images. 

### Walk Through

#### User information

The program will prompt the user to enter contact information prior to being able to access the image repo commands.

#### Access to the Repo

Once the contact information is processed, the user is prompted:

```
What would you like to do? (add, buy, search, modify, exit): <enter input here>
```

The input **must** be: *buy, add, search, modify or exit* or the system will not register the command and prompt the user again. 

## Features

### Buying Images

When you enter the *buy* command the program will prompt you to enter the name of the image you would like to purchase. If the image name is invalid or the image has a status of **Private** then the purchase transaction will be revoked.

### Adding Images

When you enter the *add* command the program will ask a series of questions about the image to be added, then the image will be added to the repository. It is important to note that the image name must be unique, so the program will keep asking for the name of the image until it is unique.

### Searching Images

When the *search* command is invoked, the user is prompted to enter the type of search they would like to perform. The program allows a large range of searching forms such as: searching by description, status, name, price, size and even geographic location. 

### Modifying Image Properties

When the *modify* command is executed the user is prompted to choose what they want to modify; either the price or status of an image(s). 

Modifying the price requires the user to enter the name of the image. If the image is not owned by the user then they will be prohibited from modifying the price. 

Modifying the status of an image or images means changing its status to either **Private** or **For Sale**. Users have the ability to change the status of a specific image, or a group of images which have the same descriptor key word. **Note**: only images which are owned will have their status' modified

### Exiting the Program

User's can exit the program by executing the command *exit* 

## Built With

* node v12.16.2
* npm v6.14.8
* MongoDB v3.6.3

## Authors

* **Jacob Rajah** developed and tested the program

## Goals

This project was built as part of the application process for the Backend Developer Intern position at Shopify for Summer 2021. Shopify asked applicants to build an image repository using any tools necessary. Furthermore, it was built to develop more persoinal experience working with Node.js and MongoDB together



