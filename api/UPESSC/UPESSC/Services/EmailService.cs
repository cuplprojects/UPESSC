using System.Net.Mail;
using System.Net;
using System;
using UPESSC.Data;

namespace UPESSC.Services
{
    public class EmailService
    {
        private readonly UPESSCDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly string _smtpServer;
        private readonly int _smtpPort;
        private readonly string _senderEmail;
        private readonly string _senderPassword;
        private readonly string _recipientEmail;

        public EmailService(UPESSCDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;

            _smtpServer = _configuration["EmailSettings:Host"];
            _smtpPort = int.Parse(_configuration["EmailSettings:Port"]);
            _senderEmail = _configuration["EmailSettings:Email"];
            _senderPassword = _configuration["EmailSettings:Password"];
            _recipientEmail = _configuration["ErrorEmailRecipient:RecipientEmail"];
        }

        public string SendEmail(string to, string subject, string body)
        {
            var smtpClient = new SmtpClient(_smtpServer)
            {
                Port = _smtpPort,
                Credentials = new NetworkCredential(_senderEmail, _senderPassword),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_senderEmail),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };

            mailMessage.To.Add(to);
            try
            {
                smtpClient.Send(mailMessage);
                return "Email sent";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
}
