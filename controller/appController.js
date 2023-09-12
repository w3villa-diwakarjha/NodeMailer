const nodemailer = require('nodemailer')
const Mailgen= require('mailgen')
const {EMAIL, PASSWORD}= require('../env')
const signup = async (req, res) => {
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    let message = {
        from: '"Fred Foo"<foo@example.com>',
        to: "bar@example.com, baz@example.com",
        subject: "Hello",
        text: "I am a Developer",
        html: "<b>Hello World?</b>",
    }
    transporter.sendMail(message).then((info) => {
        return res.status(201).json({
            msg: 'You should recieve an Email',
            info: info.messageId,
            preview: nodemailer.getTestMessageUrl(info)
        })
    }).catch(error => {
        return res.status(500).json({ error })
    })
    // res.status(201).json("Signup Succesfully...")
}
/* Send Mail using Real Mail Account */

const getbill = (req, res) => {
    const {userEmail}= req.body
    let config={
        service: 'gmail',
        auth:{
            user: EMAIL,
            pass: PASSWORD
        }
    }
    let transporter=nodemailer.createTransport(config)
    let MailGenerator=new Mailgen({
        theme: "default",
        product: {
            name: "Mailgen",
            link: "https://mailgen.js/"
        }
    });
    let response={
        body: {
            name: "Hello Everyone",
            intro: 'Your Bill has Arrived',
            table: {
                data:[
                    {
                    item: "Nodemailer Stack Book",
                    description: "A Backend Application",
                    price: "$100"
                }]
            },
            outro: "Looking Forward to do More business"
        }
    }
    let mail= MailGenerator.generate(response)
    let message={
        from: EMAIL,
        to: userEmail,
        subject: "Place Order",
        html: mail
    }
    transporter.sendMail(message).then(()=>{
        return res.status(201).json({
            msg: "You should Recieve an email"
        }).catch(error => {
            return res.status(500).json({ error })
        })
    })
    // res.status(201).json("GetBill Succesfully...")

}
module.exports = { signup, getbill }