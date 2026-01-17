// backend/internal/services/email.go
package services

import (
	"bytes"
	"fmt"
	"html/template"
	"net/smtp"

	"github.com/yourusername/portfolio-backend/internal/config"
	"github.com/yourusername/portfolio-backend/internal/models"
)

// EmailService handles sending emails
type EmailService struct {
	host     string
	port     string
	user     string
	password string
	from     string
	to       string
}

// NewEmailService creates a new email service
func NewEmailService(cfg *config.Config) *EmailService {
	return &EmailService{
		host:     cfg.SMTPHost,
		port:     cfg.SMTPPort,
		user:     cfg.SMTPUser,
		password: cfg.SMTPPassword,
		from:     cfg.EmailFrom,
		to:       cfg.EmailTo,
	}
}

// SendContactNotification sends an email when a contact form is submitted
func (s *EmailService) SendContactNotification(msg *models.ContactMessage) error {
	if s.user == "" || s.password == "" {
		// Email not configured, skip silently
		return nil
	}

	subject := fmt.Sprintf("New Contact Form Submission: %s", msg.Subject)

	// Email template
	tmpl := `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0a0a0a; color: #fff; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #666; }
        .value { margin-top: 5px; }
        .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Contact Message</h1>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">From:</div>
                <div class="value">{{.Name}} ({{.Email}})</div>
            </div>
            <div class="field">
                <div class="label">Subject:</div>
                <div class="value">{{.Subject}}</div>
            </div>
            <div class="field">
                <div class="label">Message:</div>
                <div class="value">{{.Message}}</div>
            </div>
            <div class="field">
                <div class="label">Received:</div>
                <div class="value">{{.CreatedAt.Format "Jan 02, 2006 at 3:04 PM"}}</div>
            </div>
        </div>
        <div class="footer">
            <p>This email was sent from your portfolio website contact form.</p>
        </div>
    </div>
</body>
</html>
`

	t, err := template.New("email").Parse(tmpl)
	if err != nil {
		return err
	}

	var body bytes.Buffer
	if err := t.Execute(&body, msg); err != nil {
		return err
	}

	// Build email
	mime := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
	emailBody := fmt.Sprintf("To: %s\r\nFrom: %s\r\nSubject: %s\r\n%s\r\n%s",
		s.to, s.from, subject, mime, body.String())

	// Send via SMTP
	auth := smtp.PlainAuth("", s.user, s.password, s.host)
	addr := fmt.Sprintf("%s:%s", s.host, s.port)

	return smtp.SendMail(addr, auth, s.from, []string{s.to}, []byte(emailBody))
}

// SendAcknowledgmentEmail sends an acknowledgment email to the client who submitted the contact form
func (s *EmailService) SendAcknowledgmentEmail(msg *models.ContactMessage) error {
	if s.user == "" || s.password == "" {
		// Email not configured, skip silently
		return nil
	}

	subject := "Thank you for contacting Anushree Singh"

	// Acknowledgment email template for the client
	tmpl := `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 30px 20px; text-align: center; }
        .content { padding: 30px 20px; background: #fff; }
        .message-box { background: #f8f9fa; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; border-top: 1px solid #eee; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: #fff; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Message Received!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for reaching out</p>
        </div>
        <div class="content">
            <p>Dear {{.Name}},</p>
            
            <p>Thank you for contacting me! I have received your message and will get back to you as soon as possible.</p>
            
            <div class="message-box">
                <p style="margin: 0; font-size: 14px; color: #666;"><strong>Your message:</strong></p>
                <p style="margin: 10px 0 0 0;">{{.Message}}</p>
            </div>
            
            <p>I typically respond within 24-48 hours. If your inquiry is urgent, please feel free to reach out through my social media channels.</p>
            
            <p>In the meantime, feel free to explore my portfolio to see more of my work!</p>
            
            <p style="margin-top: 30px;">Best regards,<br><strong>Anushree Singh</strong><br>Model & Influencer</p>
        </div>
        <div class="footer">
            <p>This is an automated acknowledgment email.</p>
            <p>© 2026 Anushree Singh Portfolio. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`

	t, err := template.New("acknowledgment").Parse(tmpl)
	if err != nil {
		return err
	}

	var body bytes.Buffer
	if err := t.Execute(&body, msg); err != nil {
		return err
	}

	// Build email
	mime := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
	emailBody := fmt.Sprintf("To: %s\r\nFrom: %s\r\nSubject: %s\r\n%s\r\n%s",
		msg.Email, s.from, subject, mime, body.String())

	// Send via SMTP
	auth := smtp.PlainAuth("", s.user, s.password, s.host)
	addr := fmt.Sprintf("%s:%s", s.host, s.port)

	return smtp.SendMail(addr, auth, s.from, []string{msg.Email}, []byte(emailBody))
}

// SendWelcomeEmail sends a welcome email to new users (optional)
func (s *EmailService) SendWelcomeEmail(email, name string) error {
	if s.user == "" || s.password == "" {
		return nil
	}

	subject := "Welcome to Anushree Singh Portfolio"

	body := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Welcome, %s!</h2>
        <p>Thank you for registering with Anushree Singh Portfolio.</p>
        <p>You can now access the admin panel and manage the portfolio content.</p>
        <p>Best regards,<br>Portfolio System</p>
    </div>
</body>
</html>
`, name)

	mime := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
	emailBody := fmt.Sprintf("To: %s\r\nFrom: %s\r\nSubject: %s\r\n%s\r\n%s",
		email, s.from, subject, mime, body)

	auth := smtp.PlainAuth("", s.user, s.password, s.host)
	addr := fmt.Sprintf("%s:%s", s.host, s.port)

	return smtp.SendMail(addr, auth, s.from, []string{email}, []byte(emailBody))
}
