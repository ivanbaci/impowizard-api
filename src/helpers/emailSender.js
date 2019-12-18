const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const sendWelcomeEmail = user => {
  const oauth2Client = new OAuth2(
    '923245037062-9630m79b0a48ii2623h85no5qs5cru3u.apps.googleusercontent.com', // ClientID
    '3g_y4qc9R5tcYpPMtedsWC_Z', // Client Secret
    'https://developers.google.com/oauthplayground' // Redirect URL
  );

  oauth2Client.setCredentials({
    refresh_token:
      '1//04OB9PWjLogI0CgYIARAAGAQSNwF-L9IrJ7OZY_9bM5PPTS8d1gBLNWApqX34z8hpjPAhbcru-XyTK80KxRqzbITZaEVVwvHk79c',
  });
  const accessToken = oauth2Client.getAccessToken();

  const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'impowizard@gmail.com',
      clientId:
        '923245037062-9630m79b0a48ii2623h85no5qs5cru3u.apps.googleusercontent.com',
      clientSecret: '3g_y4qc9R5tcYpPMtedsWC_Z',
      refreshToken:
        '1//04OB9PWjLogI0CgYIARAAGAQSNwF-L9IrJ7OZY_9bM5PPTS8d1gBLNWApqX34z8hpjPAhbcru-XyTK80KxRqzbITZaEVVwvHk79c',
      accessToken: accessToken,
    },
  });

  const to = user.email;
  const mailOptions = {
    from: 'impowizard@gmail.com',
    to: to,
    subject: 'Bienvenido a ImpoWizard',
    text: `${user.username} te damos la bienvenida a ImpoWizard! \n \n \n A partir de ahora, viví siempre positivo, nunca impositivo`,
  };
  smtpTransport.sendMail(mailOptions, function(error, info) {
    error ? console.log(error) : console.log(response);
    smtpTransport.close();
  });
  return;
};

module.exports = { sendWelcomeEmail };
