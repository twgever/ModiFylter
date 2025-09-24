const modifylterActions = require('./modifylterActions');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const resolution = process.argv[2];
const extension = process.argv[3];
const rootPath = path.join(__dirname, "testImages")
const downloadPath = process.argv[4];
// /home/tolatale/Desktop/Università/Cloud_computing/Progetto/Downloads
const phaseInstances = JSON.parse(process.argv[5]); //how many instances for each phase?
const phaseDuration = JSON.parse(process.argv[6]); //ttal duration of phase.

//nodejs user.js LD jpg /home/tolatale/Desktop/Università/Cloud_computing/Progetto/testImages /home/tolatale/Desktop/Università/Cloud_computing/Progetto/Downloads 5
//node user.js LD jpg Downloads [2,2] [500,1000]
// "LD","jpg",".","[1,1,6,12,24,48,60]","[60000,60000,60000,60000,60000,60000,60000]"

async function main() {

    //This code manages the creation of a certain number of users
    //started with uniform intervals of time between them
    totalInstanceNumber = phaseInstances.reduce((a, b) => a + b, 0);
    successArray = Array(totalInstanceNumber).fill(0);

    //check if length is equal for the two arrays
    if (phaseInstances.length != phaseDuration.length){
        console.log("phaseInstances and phaseDuration must have the same length");
        return;
    }

    //check if there is at least one phase
        if( (phaseInstances.length == 0 ) || ( phaseDuration.length == 0 )){
        console.log("phaseInstances and phaseDuration must have at least one phase");
        return;
    }

    console.log(totalInstanceNumber)
    try{
        let instancesCreated = 0;
        let phase = 0;
        //create the amount of instances with the relative wait time between them
        while (instancesCreated < totalInstanceNumber) {
            phaseWaitTime = phaseDuration[phase]/phaseInstances[phase];

            for (let j = 0; j < phaseInstances[phase]; j++) {
                successArray[instancesCreated] = user();
                await modifylterActions.delay(phaseWaitTime);
                instancesCreated++;
            }

            phase++;
            await modifylterActions.delay(phaseWaitTime);
        }
    }
    catch(err){
        console.log("test failure:", err);
    }

    //when all instances have finished
    Promise.all(successArray).then((value) => {
        successfullInstances = value.reduce((a, b) => a + b, 0)
        
        if(successfullInstances == totalInstanceNumber) {
            console.log("test scenario completed successfully");
            console.log("All " + successfullInstances + " instances have succesfully downloaded the image!");
        }
        else {
            console.log("test scenario failed");
            console.log("out of " + totalInstanceNumber + " instances, only "
                        + successfullInstances + " have succesfully downloaded the image!" +
                        + (totalInstanceNumber - successfullInstances + " have failed miserably...")
             )
        }
    });
}

async function user() {

    try{

        let socketEstabilished = false;
        let downloadName = false;
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
        
        while(!downloadName){
            await modifylterActions.delay(500)
            downloadName = await page.evaluate("downloadFileName");
            console.log(downloadName)
            }
            try {
        
                downloadFilePath = path.join(downloadPath,downloadName)
                    
                while(!fs.existsSync(downloadFilePath)){
                    await modifylterActions.delay(500)
                    console.log("waiting for file to be downloaded...")
                }
        
                fs.unlinkSync(downloadFilePath);
                    
            } catch (err) {
                console.error("Error removing file:", err);
                }


        await modifylterActions.uploadImage(page, filePath);

        await modifylterActions.randomDelay();

        await modifylterActions.selectRandomFilter(page);

        await modifylterActions.randomDelay();
            
        await page.waitForSelector('#modiFyBtn', {hidden: false, enabled: true});
        await page.click('#modiFyBtn');

        await modifylterActions.randomDelay();

        await modifylterActions.downloadImage(page);

        //delete the dwnloaded image


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