import { createTransport } from "nodemailer";

const send_email = ({ getter, title, code }: { getter: string, title: string, code: string }) => {

    const html = `
<html lang="en">
<body>

    <header style="background-color: brown;">
        ${title}
    </header>

    <main style="background-color:blueviolet;">

        code : ${code}

    </main>

</body>
</html>
`;


    var transporter = createTransport({
        service: 'gmail', port: 993,
        auth: {
            user: 'millad1240gumaryan@gmail.com',
            pass: 'millad!@#$313!@#$GumaryaN',
        },
    });

    transporter.sendMail({
        from: 'millad1240gumaryan@gmail.com', // sender address
        to: getter, // list of receivers
        subject: "test email", // Subject line
        html
    })
        .then((result: any) => {
            return { error: null, result }
        })
        .catch((error: any) => {
            return { error, result: null }
        })


}


export default send_email;