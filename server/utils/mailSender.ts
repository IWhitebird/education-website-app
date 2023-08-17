import * as nodemailer from 'nodemailer';

const mailSender = async (email: any, title: any, body: any) => {
    try{
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        });

        let info = await transporter.sendMail({
            from:`Study Notion < Learning Platform <`,
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        });
        console.log(info);
        return info;
}
    catch(error){
        console.log(error)
    }
};

export default mailSender;