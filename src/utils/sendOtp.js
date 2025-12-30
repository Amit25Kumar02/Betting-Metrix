import nodemailer from "nodemailer";

export const sendOtpEmail = async (email, otp) => {
    try {
        // console.log("Email User:", process.env.EMAIL_USER);
        // console.log("Email Pass:", process.env.EMAIL_PASS);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }

        });

        const htmlTemplate = `
      <div style="width:100%;background:#000;padding:40px 0;font-family:'Segoe UI',sans-serif;">
        <div style="max-width:520px;margin:auto;background:#0c0c0c;border-radius:14px;padding:35px;box-shadow:0px 0px 20px rgba(0,255,150,0.15);border:1px solid rgba(0,255,150,0.2);">
          
          <!-- Logo -->
          <h2 style="color:#00ff9d;text-align:center;font-size:26px;font-weight:600;margin-bottom:6px;">
            Betting Matrix
          </h2>
          <p style="text-align:center;color:#aaa;font-size:13px;margin-top:0;">
            Secure Password Recovery
          </p>

          <!-- Divider -->
          <div style="margin:28px auto;width:70px;height:2px;background:#00ff9d;border-radius:4px;"></div>

          <!-- OTP Heading -->
          <p style="color:#cfcfcf;font-size:15px;line-height:22px;margin-bottom:18px;">
            Dear User, <br>To complete your password reset process, please use the verification code below.
          </p>

          <!-- OTP Box -->
          <div style="text-align:center;margin:28px 0;">
            <span style="display:inline-block;font-size:36px;font-weight:700;color:#000;background:#00ff9d;padding:14px 30px;border-radius:10px;letter-spacing:12px;">
              ${otp}
            </span>
          </div>

          <!-- Message -->
          <p style="color:#9f9f9f;font-size:13px;text-align:center;margin-top:0;">
            This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone including Betting Matrix team.
          </p>


          <!-- Footer -->
          <p style="color:#7d7d7d;font-size:11px;text-align:center;margin-top:25px;">
            If you did not request this, simply ignore this email.
          </p>
        </div>
      </div>
    `;

        await transporter.sendMail({
            from: `"Betting Matrix" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify Your OTP - Betting Matrix",
            html: htmlTemplate
        });

        console.log("OTP Email Sent Successfully");
        return true;

    } catch (error) {
        console.log("OTP Email Failed:", error);
        return false;
    }
};
