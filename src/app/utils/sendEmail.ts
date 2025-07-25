/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import nodemailer from "nodemailer";

import HttpStatus from "http-status";

import AppError from "../errors/AppError";
import { appConfig } from "../config";
import logger from "./serverTool/logger";

export async function sendEmail(email: string, subject: string, text: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: appConfig.email.nodeMailer.host,
      port: Number(appConfig.email.nodeMailer.port),
      secure: false,
      auth: {
        user: appConfig.email.nodeMailer.user,
        pass: appConfig.email.nodeMailer.pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"DMR-Technologies" ${appConfig.email.nodeMailer.from}`, // Sender address
      to: email, // Recipient's email
      subject: `${subject}`,
      text: text,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Promotional Email</title>
          <style>
            /* Reset styles */
            body, html {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
            }
    
            /* Container styles */
            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 10px;
              background-color: #fff;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
    
            /* Header styles */
            .header {
              background-color:  #5988ffff; /* New blue background */
              padding: 20px;
              border-radius: 10px 10px 0 0;
              color: #000000;
              text-align: center;
            }
            .header h1 {
              margin: 0;
            }
    
            /* Content styles */
            .content {
              padding: 20px;
              text-align: left;
              font-size: 16px;
              line-height: 1.6;
              color: #333;
            }
    
            /* Footer styles */
            .footer {
              background-color: #5988ffff; /* New green background */
              padding: 15px;
              border-radius: 0 0 10px 10px;
              text-align: center;
              color: #000000;
              font-size: 12px;
            }
    
            /* Button styles */
            .btn {
              display: inline-block;
              padding: 10px 20px;
              margin-top: 10px;
              background-color: #FF6600;
              color: #fff;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
            }
    
            /* Responsive styles */
            @media (max-width: 600px) {
              .container {
                padding: 10px;
              }
              .content {
                font-size: 14px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${subject}</h1>
            </div>
            <div class="content">
              <p>${text}</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} DMR-Technologies. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return info;
  } catch (error: any) {
    logger.error("Error sending email", error);
    throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, "Error sending email");
  }
}

//------------RESEND SERVICE------------//

import { Resend } from "resend";

const resend = new Resend(appConfig.email.resend.re_send_api_key);

export const sendEmailByResend = async (
  email: string,
  subject: string,
  text: string
) => {
  resend.emails.send({
    from: appConfig.email.nodeMailer.from as string,
    to: email,
    subject: "Verification Code",
    html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Promotional Email</title>
          <style>
            /* Reset styles */
            body, html {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
            }
    
            /* Container styles */
            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 10px;
              background-color: #fff;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
    
            /* Header styles */
            .header {
              background-color:  #5988ffff; /* New blue background */
              padding: 20px;
              border-radius: 10px 10px 0 0;
              color: #000000;
              text-align: center;
            }
            .header h1 {
              margin: 0;
            }
    
            /* Content styles */
            .content {
              padding: 20px;
              text-align: left;
              font-size: 16px;
              line-height: 1.6;
              color: #333;
            }
    
            /* Footer styles */
            .footer {
              background-color: #5988ffff; /* New green background */
              padding: 15px;
              border-radius: 0 0 10px 10px;
              text-align: center;
              color: #000000;
              font-size: 12px;
            }
    
            /* Button styles */
            .btn {
              display: inline-block;
              padding: 10px 20px;
              margin-top: 10px;
              background-color: #FF6600;
              color: #fff;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
            }
    
            /* Responsive styles */
            @media (max-width: 600px) {
              .container {
                padding: 10px;
              }
              .content {
                font-size: 14px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${subject}</h1>
            </div>
            <div class="content">
              <p>${text}</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} DMR-Technologies. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
  });
};

//-------------------------------------------------------------

import sgMail from "@sendgrid/mail";

sgMail.setApiKey(appConfig.email.sand_grid.api_key as string); // Store in .env file

export async function sendEmailBySandGrid(
  email: string,
  subject: string,
  text: string
) {
  console.log(email, appConfig.email.nodeMailer.from, subject, text);
  try {
    const msg = {
      to: email as string,
      from: appConfig.email.nodeMailer.from as string, // Must be a verified sender
      subject: subject as string,
      text: text,
      html: `
        <html>
        <body>
          <h1>${subject}</h1>
          <p>${text}</p>
          <footer style="margin-top: 20px; color: gray;">
            &copy; ${new Date().getFullYear()} DMR-Technologies. All rights reserved.
          </footer>
        </body>
        </html>
      `,
    };

    await sgMail.send(msg);
  } catch (error: any) {
    console.error("SendGrid Error:", error);
    throw new Error("Error sending email");
  }
}
