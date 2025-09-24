//import puppeteer from 'puppeteer'
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const environment = process.env.NODE_ENV
const isProduction = environment === 'production'



async function main() {

    webSocketEstabilished = false;
    const rootPath = '/home/tolatale/Desktop/Università/Cloud computing/Progetto/testImages'
    const extension = 'jpg';
    const resolution = 'LD';
    
    const [browser, page] = await openMF();
    page.setDefaultTimeout(120000);

    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: '/home/tolatale/Desktop/Università/Cloud computing/Progetto/Downloads'
    });

    const filePath = await selectRandomImage(resolution, extension, rootPath);

    while(!webSocketEstabilished){
         await delay(500)
         webSocketEstabilished = await page.evaluate("webSocketEstabilished");
    }
     await uploadImage(page, filePath);

    await selectRandomFilter(page);
    
    await page.waitForSelector('#modiFyBtn', {hidden: false, enabled: true});
    await page.click('#modiFyBtn');

    await downloadImage(page);

    await delay(2000);

    await browser.close();
};

module.exports = { 

    //function that launcehs ModiFylter
    openMF: async function () {
        try{
            //Launch the browser and open a blank page
            const browser = await puppeteer.launch({ 
                headless: false,
                args: [ "--no-sandbox",
                        "--disabel-setuid-sandbox"],
                ...(isProduction && {executablePath: process.env.CHROMIUM_PATH})
             });
            const page = await browser.newPage();

            //visit ModiFylter
            await page.goto('https://main.d36fucso8styeq.amplifyapp.com/');
            return [browser, page];
        }
        catch(err) {
            console.log(err);
            throw err;
        }

    },

    //function to upload an image to ModiFylter
    uploadImage: async function (page, path){
        try {
            //upload image to ModiFylter
            await page.waitForSelector('#uploadButton', {visible: true});
            const [fileChooser] = await Promise.all([
                page.waitForFileChooser(),
                page.click("#uploadButton"),
            ]);
            await fileChooser.accept([path]);
        }
        catch(err) {
            console.log(err);
        }
    },

    //randomly select the image that has to be uploaded
    selectRandomImage: async function (resolution, extension, imageFolder) {
        try{
            targetFolder = path.join(imageFolder,resolution+extension);
            targetFiles = fs.readdirSync(targetFolder);
            randomIndex = Math.floor((Math.random()*targetFiles.length));
            targetFile = path.join(targetFolder, targetFiles[randomIndex]);
            return targetFile;
        }
        catch(err){
            console.log(err);
        }
    },

    //randomly select a filter out of the available filters
    selectRandomFilter: async function (page){
        try{
            await page.click("#dropBtn");

            await page.waitForSelector('.dropdown-content', {visible: true});
            dropContent = await page.$('.dropdown-content');
            selections = await dropContent.$$('selection');
            selection = selections[Math.floor(Math.random()*selections.length)];

            await selection.click();
        }
        catch(err){
            console.log(err);
        }
    },

    downloadImage: async function (page){
        try{
            await page.waitForSelector('#downloadBtn', {visible: true});
            await page.click("#downloadBtn");
        }
        catch(err){
            console.log(err);
        }
    },

    //function to wait for a set amount of time
    delay: function (time) {
        return new Promise(function(resolve) {
            setTimeout(resolve, time) 
        });
    },

    randomDelay: async function (){
        try{
            waitTime = Math.floor(Math.random()*4000);
            await delay(waitTime);
        }
        catch(err){
            console.log(err);
        }
    }
};

function delay(time) {
        return new Promise(function(resolve) {
            setTimeout(resolve, time) 
        });
    }

async function randomDelay(){
        try{
            waitTime = Math.floor(Math.random()*4000);
            await delay(waitTime);
        }
        catch(err){
            console.log(err);
        }
    }

//main();

