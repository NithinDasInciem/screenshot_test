export const getForgotPasswordOtpTemplate = ({ f_name, otp }) => {
  const companyName = process.env.COMPANY_NAME || 'P&Y Partners';
  const currentYear = new Date().getFullYear();

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Password Reset OTP</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table align="center" cellpadding="0" cellspacing="0" width="600" 
           style="border-collapse: collapse; background-color: #ffffff; border-radius: 8px; 
                  overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      
      <!-- Header with logo -->
      <tr>
        <td align="center" bgcolor="#6FB94B" style="padding: 20px 0;">
          <img src="cid:companyLogo" alt="${companyName} Logo" width="180" height="50" style="display: block; height: 95px;">
        </td>
      </tr>

      <!-- Body content -->
      <tr>
        <td style="padding: 40px 30px; color: #333; line-height: 1.6;">
          <h2 style="color: #6FB94B; margin: 0 0 20px;">Password Reset Request</h2>
          <p style="margin: 0 0 15px;">Hello <strong>${f_name}</strong>,</p>
          <p style="margin: 0 0 15px;">
            We received a request to reset your password. Use the One-Time Password (OTP) below to complete the process.
          </p>
          
          <!-- OTP Display -->
          <div style="text-align: center; margin: 30px 0;">
            <p style="font-size: 16px; margin-bottom: 10px;">Your OTP is:</p>
            <p style="background-color: #f0f0f0; border: 1px dashed #ccc; padding: 10px 20px; font-size: 24px; 
                      font-weight: bold; letter-spacing: 5px; display: inline-block; border-radius: 8px;">
              ${otp}
            </p>
          </div>

          <p style="text-align: center; font-size: 14px; color: #888; margin-top: 20px;">This OTP is valid for <strong>2 minutes</strong>.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">If you did not request a password reset, please ignore this email. No changes have been made to your account.</p>
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
