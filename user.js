const modifylterActions = require('./modifylterActions');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const resolution = process.argv[2];
const extension = process.argv[3];
const rootPath = path.join(__dirname, "testImages")
const downloadPath = process.argv[4];
// /home/tolatale/Desktop/Università/Cloud_computing/Progetto/Downloads
const instancesNumber = process.argv[5];
const waitTime = process.argv[6];

//nodejs user.js LD jpg /home/tolatale/Desktop/Università/Cloud_computing/Progetto/testImages /home/tolatale/Desktop/Università/Cloud_computing/Progetto/Downloads 5

async function main() {
    successArray = Array(instancesNumber).fill(0);
    try{
        for (let i = 0; i < instancesNumber; i++) {
            successArray[i] = user();
            await modifylterActions.delay(waitTime);
        }
    }
    catch(err){
        console.log("test failure:", err);
    }

    Promise.all(successArray).then(() => {
        console.log("test scenario completed successfully");
    });
}

async function user() {

    try{

        let socketEstabilished = false;
        const [browser, page] = await modifylterActions.openMF();
        page.setDefaultTimeout(120000);
        await modifylterActions.randomDelay();

        const client = await page.target().createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: downloadPath
        });

        const filePath = await modifylterActions.selectRandomImage(resolution, extension, rootPath);

        while(!socketEstabilished){
            await modifylterActions.delay(500)
            socketEstabilished = await page.evaluate("webSocketEstabilished");
        }
        await modifylterActions.uploadImage(page, filePath);

        await modifylterActions.randomDelay();

        await modifylterActions.selectRandomFilter(page);

        await modifylterActions.randomDelay();
            
        await page.waitForSelector('#modiFyBtn', {hidden: false, enabled: true});
        await page.click('#modiFyBtn');

        await modifylterActions.randomDelay();

        await modifylterActions.downloadImage(page);

        await modifylterActions.delay(2000);
        console.log("test completed succesfully");

        await browser.close();

        return 1;

    }
    catch(err){
        console.log("test failure:", err);
        return 0;
    }
}

main();