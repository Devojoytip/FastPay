const nodemailer = require('nodemailer');

let mailTransporter = nodemailer.createTransport({
    service : "gmail",
    auth:{
        user:"dark033770@gmail.com",
        pass:"skhkkanwwmaufhbt",
    }
})

let details ={
    from:"dark033770@gmail.com",
    to:"nextygenerationmaharaj@gmail.com",
    subject:"ShopQ order - Regarding",
    text:"Your shopQ order at store ABC is ready for collection!",
}

