export const getWelcomeEmailTemplate = ({ f_name, username, setupUrl }) => {
  const companyName = process.env.COMPANY_NAME || 'P&Y Partners';
  const currentYear = new Date().getFullYear();

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Activate Your PY-HRM Account</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table align="center" cellpadding="0" cellspacing="0" width="600" 
           style="border-collapse: collapse; background-color: #ffffff; border-radius: 8px; 
                  overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      
      <!-- Header with logo -->
      <tr>
        <td align="center" bgcolor="#6FB94B" style="padding: 20px 0;">
          <img src="cid:companyLogo" alt="${companyName} Logo" width="180" style="display: block; height: 95px;">
        </td>
      </tr>

      <!-- Body content -->
      <tr>
        <td style="padding: 40px 30px; color: #333; line-height: 1.6;">
          <h2 style="color: #6FB94B; margin: 0 0 20px;">Welcome to ${companyName}!</h2>
          <p style="margin: 0 0 15px;">Hello ${f_name || ''},</p>
          <p style="margin: 0 0 15px;">
            An account has been created for you on the PY-HRM portal. To get started, you need to activate your account and set up your password.
          </p>
          <p style="margin: 0 0 25px;">Your username for login is: <strong>${username}</strong></p>
          
          <!-- Call-to-action button -->
          <p style="text-align: center; margin: 30px 0;">
            <a href="${setupUrl}" 
               style="background-color: #6FB94B; color: #ffffff; padding: 12px 25px; text-decoration: none; 
                      border-radius: 25px; font-weight: bold; display: inline-block;">
              Set Up Your Account
            </a>
          </p>

          <p style="font-size: 14px;">If the button above doesn’t work, please copy and paste the following link into your browser:</p>
          <p style="font-size: 14px; word-break: break-all;">
            <a href="${setupUrl}" style="color: #6FB94B;">${setupUrl}</a>
          </p>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            If you did not expect to receive this email, please contact your HR department immediately.
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td bgcolor="#f4f4f4" style="padding: 20px; text-align: center; font-size: 12px; color: #888;">
          © ${currentYear} ${companyName}. All Rights Reserved.<br>
          This is an automated message. Please do not reply to this email.
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};
