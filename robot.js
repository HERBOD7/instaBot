const puppeteer = require('puppeteer');
const chromeOptions = {
    headless:false,
    args: ["--no-sandbox"]
};

async function createAccount($fullName, userDetail, bio, gender) {
    try {
        const browser = await puppeteer.launch(chromeOptions);
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36');
        await page.goto('https://www.instagram.com/accounts/emailsignup/', {waitUntil: 'domcontentloaded'});
        let domain = String.fromCharCode(Math.floor(Math.random() * 26 + 97));
        await page.waitForSelector('input[name="emailOrPhone"]');
        await page.type('input[name="emailOrPhone"]', `${$fullName}@${domain}mail.com`);
        await page.type('input[name="fullName"]', $fullName);
        let userNumber = Math.random().toString().slice(-3);
        let chanceName = Math.floor(Math.random() * 2);
        if(chanceName > 1){
            await page.type('input[name="username"]', $fullName + userNumber);
        } else {
            await page.type('input[name="username"]', $fullName + '_' +userNumber);
        }
        let pass = Math.random().toString(36).slice(-8);
        await page.type('input[name="password"]', pass);
    
        try {
            await Promise.all([
                page.click("button[type=submit]"),
                page.waitForNavigation({ waitUntil: 'networkidle0' }),
            ]);

            const challengeUrl = await page.url();
            if(challengeUrl.includes('https://www.instagram.com/challenge/')){
                await page.close();
                await browser.close();
            }
            
        } catch {
            await page.close();
            await browser.close();
        }

        try {
            if(await (await page.$$('#ssfErrorAlert')).length > 0){
                await page.close();
                await browser.close();
            }
        } catch {

        }

        try {
            await page.waitForSelector('#ageBucketSection');
            let chance = Math.floor(Math.random() * 2);

            if(chance > 0){
                await page.click("input[type='radio'][id='igCoreRadioButtonageRadioabove_18']");
            } else {
                await page.click("input[type='radio'][id='igCoreRadioButtonageRadiounder_18']");
            }

            await page.click("button[type=submit]")
            const approveAge = await page.$x("//button[contains(text(), 'Next')]");
            await Promise.all([
                approveAge[1].click(),
                page.waitForNavigation({ waitUntil: 'networkidle0' }),
            ]);

            const challenge_url = await page.url();  
            if(challenge_url.includes('https://www.instagram.com/challenge/')){
                await page.close();
                await browser.close();
            }
            
        } catch {

        }

        try {
            if(await (await page.$$('#ssfErrorAlert')).length > 0){
                await page.close();
                await browser.close();
            }
        } catch {

        }

        try{
            let randomMonth = Math.floor(Math.random() * 12);
            let randomDay = Math.floor(Math.random() * 29);
            let randomYear = Math.floor(Math.random() * 90) + 12;
            await page.waitForSelector('select[title]');
            const approveDate = await page.$x("//button[contains(text(), 'Next')]");
            await page.select('select[title="Month:"]', `${randomMonth}`);
            await page.select('select[title="Day:"]', `${randomDay}`);
            await page.select('select[title="Year:"]', `19${randomYear}`);
            await Promise.all([
                approveDate[1].click(),
                page.waitForNavigation({ waitUntil: 'networkidle0' }),
            ]);
        } catch {
            
        }

        try {
            if(await (await page.$$('#ssfErrorAlert')).length > 0){
                await page.close();
                await browser.close();
            }
        } catch {

        }

        try {
            await page.waitForSelector('span[aria-label="Birthday cupcake"]');
            if((await page.$$('svg[aria-label="Close"]')).length > 0){
                await page.click('svg[aria-label="Close"]');
            }

            let randomMonth = Math.floor(Math.random() * 12);
            let randomDay = Math.floor(Math.random() * 29);
            let randomYear = Math.floor(Math.random() * 90) + 12;
            const approveDateForm = await page.$x("//button[contains(text(), 'Next')]");
            await page.select('select[title="Month:"]', `${randomMonth}`);
            await page.select('select[title="Day:"]', `${randomDay}`);
            await page.select('select[title="Year:"]', `19${randomYear}`);
            await approveDateForm[0].click();
        } catch {
        
        }

        const URL = await page.url();
        if(URL === 'https://www.instagram.com/'){
            console.log('ok');
            userDetail.username = $fullName + userNumber;
            userDetail.password = pass;

            try {
                const cancelNotification = await page.$x("//button[contains(text(), 'Not Now')]");
                await cancelNotification[0].click();
            } catch{

            }

            await page.goto('https://www.instagram.com/accounts/edit/', {waitUntil: 'domcontentloaded'});

            try {
                await page.waitForSelector('#pepBio');
                await page.type('#pepBio', bio);
            } catch {

            }

            try {
                await page.waitForSelector('input[type="file"]');
                const input = await page.$('article div div div:nth-child(2) form input[type="file"]');
                let randomImgFemale = Math.floor(Math.random() * 490);
                let randomImgmale = Math.floor(Math.random() * 237);
                if(gender === 'male'){
                    await input.uploadFile(`/ubuntu/image/male/0${randomImgmale}.jpg`);
                } else {
                    await input.uploadFile(`/ubuntu/image/female/0${randomImgFemale}.jpg`);
                }
            } catch {
                
            }
        
            const submitBtn = await page.$x("//button[contains(text(), 'Submit')]");
            await submitBtn[0].click();
        }
        await page.close();
        await browser.close();
    } catch(e) {
        console.log(e);
    }
}


async function follow($following, $user, $pass) {
    try {
        const browser = await puppeteer.launch(chromeOptions);
        const page = await browser.newPage();
        await page.goto('https://www.instagram.com/accounts/login/', {waitUntil: 'domcontentloaded'});
        await page.waitForSelector('input[name="username"]');
        await page.type('input[name="username"]', $user);
        await page.type('input[name="password"]', $pass);
        try {
            await Promise.all([
                page.click('button[type=submit]'),
                page.waitForNavigation({ waitUntil: 'networkidle0' }),
            ]);
        } catch {
            await page.close();
            await browser.close();
        }
        
        const currentUrl = await page.url();
        if(currentUrl === 'https://www.instagram.com/'){
            await page.goto(`https://www.instagram.com/${$following}/`);
            const followBtn = await page.$x("//button[contains(text(), 'Follow')]");
            await followBtn[0].click();
        }
        await page.close();
        await browser.close();
    } catch {

    }
}

async function uploadImageProfil($user, $pass) {
    try {
        const browser = await puppeteer.launch(chromeOptions);
        const page = await browser.newPage();
        await page.goto('https://www.instagram.com/accounts/login/', {waitUntil: 'domcontentloaded'});
        await page.waitForSelector('input[name="username"]');
        await page.type('input[name="username"]', $user);
        await page.type('input[name="password"]', $pass);
        try {
            await Promise.all([
                page.click('button[type=submit]'),
                page.waitForNavigation({ waitUntil: 'networkidle0' }),
            ]);
        } catch {
            // await page.close();
            // await browser.close();
        }
        
        const currentUrl = await page.url();
        if(currentUrl === 'https://www.instagram.com/'){
            await page.goto('https://www.instagram.com/accounts/edit/', {waitUntil: 'domcontentloaded'});

            try {
                console.log('uploading');
                await page.waitForSelector('input[type="file"]');
                const input = await page.$('article div div div:nth-child(2) form input[type="file"]');
                await input.uploadFile(`/Users/mohammadreza/Downloads/12.png`);
            } catch {
                
            }
        }
        // await page.close();
    } catch {

    }
}

module.exports.createAccount = createAccount
module.exports.follow = follow
module.exports.uploadImageProfil = uploadImageProfil