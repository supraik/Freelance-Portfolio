# Email System - Contact Form Flow

## Overview

The backend implements a **dual email notification system** for the contact form:

1. **Acknowledgment Email** → Sent to the client who submitted the form
2. **Notification Email** → Sent to Anushree Singh (portfolio owner)

## Email Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CONTACT FORM SUBMISSION                          │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │  Client Submits Form    │
                    │  POST /api/contact      │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  Save to Database       │
                    │  (contact_messages)     │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  Return Success         │
                    │  Response to Client     │
                    └────────────┬────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
        ┌──────────────────────┐  ┌──────────────────────┐
        │  Send Acknowledgment │  │  Send Notification   │
        │  Email to Client     │  │  Email to Model      │
        └──────────────────────┘  └──────────────────────┘
                    │                         │
                    ▼                         ▼
        ┌──────────────────────┐  ┌──────────────────────┐
        │  Client Receives:    │  │  Model Receives:     │
        │  "Thank you for      │  │  "New contact from   │
        │   contacting me!"    │  │   [Client Name]"     │
        └──────────────────────┘  └──────────────────────┘
```

## Email Templates

### 1. Acknowledgment Email (to Client)

**Recipient:** Client's email address  
**Subject:** "Thank you for contacting Anushree Singh"  
**Purpose:** Confirm receipt and set expectations

**Template Features:**
- Professional branded header
- Personal greeting with client's name
- Echo of their submitted message
- Expected response time (24-48 hours)
- Professional signature
- Branded footer

**Example:**
```
Dear [Client Name],

Thank you for contacting me! I have received your message and will 
get back to you as soon as possible.

Your message:
[Client's submitted message]

I typically respond within 24-48 hours. If your inquiry is urgent, 
please feel free to reach out through my social media channels.

Best regards,
Anushree Singh
Model & Influencer
```

### 2. Notification Email (to Portfolio Owner)

**Recipient:** Anushree Singh (EMAIL_TO in .env)  
**Subject:** "New Contact Form Submission: [Subject]"  
**Purpose:** Notify about new inquiry with full details

**Template Features:**
- Dark branded header
- Complete client information
- Full message content
- Timestamp of submission
- Professional formatting

**Example:**
```
New Contact Message

From: [Client Name] ([Client Email])
Subject: [Message Subject]
Message: [Full message content]
Received: Jan 17, 2026 at 3:45 PM

This email was sent from your portfolio website contact form.
```

## Configuration

### Environment Variables

Update your `.env` file with SMTP settings:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@anushreesingh.com
EMAIL_TO=contact@anushreesingh.com
```

### Gmail Setup

1. **Enable 2-Step Verification**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

2. **Create App Password**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and generate password
   - Use this password in `SMTP_PASSWORD`

3. **Update Configuration**
   ```env
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=xxxx xxxx xxxx xxxx  # 16-character app password
   EMAIL_TO=your-email@gmail.com      # Where notifications go
   ```

## Code Implementation

### Email Service Methods

Located in `internal/services/email.go`:

```go
// SendAcknowledgmentEmail - Sends thank you email to client
func (s *EmailService) SendAcknowledgmentEmail(msg *models.ContactMessage) error

// SendContactNotification - Sends notification to portfolio owner
func (s *EmailService) SendContactNotification(msg *models.ContactMessage) error
```

### Contact Handler

Located in `internal/handlers/contact.go`:

```go
// Both emails sent asynchronously (non-blocking)
go func() {
    // 1. Acknowledgment to client
    h.email.SendAcknowledgmentEmail(msg)
    
    // 2. Notification to portfolio owner
    h.email.SendContactNotification(msg)
}()
```

## Email Workflow

### Step 1: Client Submits Form

```bash
curl -X POST http://localhost:8080/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Inquiry",
    "message": "I would like to discuss a modeling project..."
  }'
```

### Step 2: Server Processes Request

1. ✅ Validates input (email format, required fields, length)
2. ✅ Saves message to database
3. ✅ Returns success response to client
4. ✅ Sends both emails asynchronously

### Step 3: Emails Sent

**Client receives** (john@example.com):
```
Subject: Thank you for contacting Anushree Singh
Body: Beautiful HTML template with acknowledgment
```

**Model receives** (contact@anushreesingh.com):
```
Subject: New Contact Form Submission: Project Inquiry
Body: Full details including client info and message
```

## Error Handling

### Email Sending Failures

Emails are sent **asynchronously** and **non-blocking**:
- If email fails, it logs the error but doesn't affect the API response
- Client still gets success response
- Message is saved to database regardless

### Silent Fallback

```go
if s.user == "" || s.password == "" {
    // Email not configured, skip silently
    return nil
}
```

This allows the contact form to work even without email configuration during development.

## Testing Emails

### Test Acknowledgment Email

```bash
# Submit a test contact form
curl -X POST http://localhost:8080/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "your-test-email@gmail.com",
    "subject": "Test Message",
    "message": "This is a test to check if acknowledgment emails work."
  }'

# Check your-test-email@gmail.com inbox
# You should receive: "Thank you for contacting Anushree Singh"
```

### Test Notification Email

After submitting the above, check the email configured in `EMAIL_TO`.  
You should receive: "New Contact Form Submission: Test Message"

### Troubleshooting

**No emails received?**

1. Check SMTP credentials in `.env`
2. Verify Gmail App Password (not regular password)
3. Check server logs:
   ```
   Failed to send acknowledgment email to client: <error>
   Failed to send notification email to portfolio owner: <error>
   ```
4. Test SMTP connection manually
5. Check spam/junk folder

**Only one email received?**

- Check if both functions are being called in handler
- Review logs for specific error on one email type
- Verify both email addresses are valid

## Customization

### Modify Email Templates

Edit templates in `internal/services/email.go`:

**Acknowledgment Email:**
```go
// Line ~40 in email.go
tmpl := `
<!DOCTYPE html>
<html>
  <!-- Customize HTML template here -->
</html>
`
```

**Notification Email:**
```go
// Line ~50 in email.go  
tmpl := `
<!DOCTYPE html>
<html>
  <!-- Customize HTML template here -->
</html>
`
```

### Change Response Time

Update the acknowledgment template:
```html
<p>I typically respond within 24-48 hours.</p>
<!-- Change to your preferred response time -->
```

### Add Company Logo

Add to email templates:
```html
<img src="https://your-domain.com/logo.png" alt="Logo" style="max-width: 200px;">
```

### Custom From Name

Update SMTP configuration:
```go
emailBody := fmt.Sprintf("To: %s\r\nFrom: Anushree Singh <%s>\r\nSubject: %s\r\n%s\r\n%s",
    msg.Email, s.from, subject, mime, body.String())
```

## Production Recommendations

1. **Use Professional Email Service**
   - Consider SendGrid, Mailgun, or AWS SES
   - Better deliverability and analytics
   - Higher sending limits

2. **Email Templates**
   - Store templates in separate files
   - Use template engine for customization
   - Add brand colors and styling

3. **Monitoring**
   - Log all email sends
   - Track delivery rates
   - Monitor bounce rates

4. **Rate Limiting**
   - Prevent email spam
   - Limit submissions per IP
   - Add CAPTCHA for public forms

5. **Queue System**
   - Use message queue for high volume
   - Retry failed sends
   - Better error handling

## Benefits of Dual Email System

✅ **For Clients:**
- Immediate confirmation their message was received
- Peace of mind
- Sets expectations for response time
- Professional image

✅ **For Portfolio Owner:**
- Instant notification of new inquiries
- All client details in one email
- Can respond quickly from email
- Better client relationship management

## Summary

The backend now provides a **complete email notification system**:

1. **Client submits form** → Validated and saved
2. **Client gets acknowledgment** → Professional "thank you" email
3. **Model gets notification** → Full inquiry details
4. **Both happen automatically** → No manual intervention needed

This creates a professional, responsive experience for potential clients while keeping the portfolio owner informed of all inquiries in real-time.
