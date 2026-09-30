const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

async function sendNewTenderEmail(users, tender) {
    if (!users || users.length === 0) return;

    const emailList = users.map(u => u.email).join(', ');

    const mailOptions = {
        from: `"TenderVision AI" <${process.env.EMAIL_USER}>`,
        to: emailList,
        subject: `New Tender Alert: ${tender.title}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f7f6; color: #333;">
                <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <h2 style="color: #007bff;">New Tender Opportunity Match!</h2>
                    <p>A new tender has been added to the database that matches your company profile.</p>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #00ffaa; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #2c3e50;">${tender.title}</h3>
                        <p><strong>Organization:</strong> ${tender.org}</p>
                        <p><strong>Category:</strong> ${tender.catLabel}</p>
                        <p><strong>Estimated Value:</strong> $${(tender.value / 1000000).toFixed(1)}M</p>
                        <p><strong>Deadline:</strong> ${new Date(tender.deadline).toLocaleDateString()}</p>
                    </div>
                    
                    <p>Log in to your TenderVision dashboard to view full details and generate an AI proposal draft.</p>
                    
                    <a href="http://localhost:3000" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Dashboard</a>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Notification email sent to ${users.length} users.`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}
async function sendWebsiteScrapeEmail(userEmail, websiteUrl, tenders) {
    if (!userEmail || !tenders || tenders.length === 0) return;

    let tendersHtml = tenders.map(t => `
        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #00ccff; margin: 15px 0;">
            <h3 style="margin-top: 0; color: #2c3e50;">${t.title}</h3>
            <p style="margin: 5px 0;"><strong>Description:</strong> ${t.description}</p>
            <p style="margin: 5px 0; color: #e74c3c;"><strong>Deadline:</strong> ${t.deadline}</p>
        </div>
    `).join('');

    // Force Gmail to put it in the Inbox instead of Sent by using a plus-alias
    const toEmail = userEmail.replace('@gmail.com', '+alert@gmail.com');

    const mailOptions = {
        from: `"TenderVision AI Scraper" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `New Tenders Found on ${new URL(websiteUrl).hostname}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f7f6; color: #333;">
                <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <h2 style="color: #00ccff;">AI Web Scanner Results</h2>
                    <p>We successfully scanned <a href="${websiteUrl}">${websiteUrl}</a> and found the following opportunities:</p>
                    
                    ${tendersHtml}
                    
                    <p>Log in to your TenderVision dashboard to run detailed analysis on these opportunities.</p>
                    
                    <a href="http://localhost:3000" style="display: inline-block; background-color: #00ccff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Go to Dashboard</a>
                </div>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Scrape results sent to ${userEmail}. SMTP Response: ${info.response}`);
    } catch (error) {
        console.error("Error sending scrape email:", error);
    }
}

module.exports = { sendNewTenderEmail, sendWebsiteScrapeEmail };
