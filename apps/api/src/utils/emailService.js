const sendResolutionNotification = async (userEmail, userName, issueDetails) => {
  return new Promise((resolve) => {
    console.log('\n======================================================');
    console.log('📧 MOCK EMAIL NOTIFICATION TRIGGERED (SendGrid/SMTP)');
    console.log('======================================================');
    console.log(`To: ${userName} <${userEmail}>`);
    console.log(`Subject: ✅ Your CivicFix Issue #${issueDetails.issue_number} has been Resolved!`);
    console.log('------------------------------------------------------');
    console.log(`Hello ${userName},\n`);
    console.log(`Great news! The issue you reported (${issueDetails.title}) has been officially resolved by our field team.`);
    console.log(`\nView the final verified photos and download your official PDF report here:`);
    console.log(`👉 http://localhost:5173/my-issues\n`);
    console.log(`Thank you for being an active citizen and helping us build a smarter, cleaner city!`);
    console.log(`\n- The CivicFix Team`);
    console.log('======================================================\n');
    
    // Simulate network delay
    setTimeout(() => {
      resolve(true);
    }, 1500);
  });
};

module.exports = {
  sendResolutionNotification
};
