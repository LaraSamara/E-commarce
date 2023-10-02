import nodemailer from 'nodemailer';
export async function sendEmail (to,subject,html,attachment){
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.EMAIL,
            pass:process.env.EMAIL_PASSWORD
        }
    });
    let info = await transporter.sendMail({
        from:`LARA SAMARA <${process.env.EMAIL}>`,
        to,
        subject,
        html,
        attachments:attachment
    });
}