import { Resend } from 'resend';
import { z } from 'zod';

// Vercel serverless functions environment variables are available via process.env
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_123');

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  serviceRequired: z.array(z.string()).optional(),
  projectDetails: z.string().min(10),
  honeypot: z.string().optional(),
  token: z.string().optional(), // Cloudflare Turnstile token
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const rawData = req.body;
    
    // Zod Validation
    const validationResult = contactSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationResult.error.errors 
      });
    }
    
    const data = validationResult.data;

    // Honeypot check
    if (data.honeypot) {
      // Silently discard
      return res.status(200).json({ success: true, message: 'Message received.' });
    }

    // Turnstile mock verification
    if (data.token === 'fail-token') {
      return res.status(400).json({ error: 'Bot verification failed' });
    }

    // Send Internal Notification
    const { data: responseData, error } = await resend.emails.send({
      from: 'Taksha Website <website@taksha.studio>',
      to: process.env.INTERNAL_NOTIFICATION_EMAIL || 'hello@taksha.studio',
      subject: `New Lead: ${data.name} - ${data.budget || 'Unspecified'}`,
      html: `
        <h2>New Project Inquiry</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p><strong>Company:</strong> ${data.company || 'N/A'}</p>
        <p><strong>Budget:</strong> ${data.budget || 'N/A'}</p>
        <p><strong>Timeline:</strong> ${data.timeline || 'N/A'}</p>
        <p><strong>Services:</strong> ${data.serviceRequired ? data.serviceRequired.join(', ') : 'None'}</p>
        <h3>Project Details:</h3>
        <p>${data.projectDetails.replace(/\n/g, '<br/>')}</p>
      `,
    });

    if (error) {
      console.error('Resend API Error:', error);
      // Fallback for local testing without valid keys
      if (error.message.includes('API key')) {
         console.log('Simulating successful submission due to missing/invalid API key.');
         return res.status(200).json({ success: true, simulated: true });
      }
      return res.status(500).json({ error: 'Failed to send email' });
    }

    // Send Auto-Responder to User
    await resend.emails.send({
      from: 'Taksha <hello@taksha.studio>',
      to: data.email,
      subject: "We've received your inquiry. Let's talk.",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #0F172A; max-width: 600px; line-height: 1.6;">
          <p>Hello ${data.name},</p>
          <p>Thank you for reaching out to Taksha. We've received your project details and our team is currently reviewing them.</p>
          <p>Because we take craftsmanship seriously, we review every inquiry personally to ensure we are the right technical and creative fit for your vision. You can expect a direct response from one of our partners within the next 24 hours to schedule a scoping call.</p>
          <p>In the meantime, feel free to explore our latest work at <a href="https://taksha.studio/work" style="color: #F59E0B; text-decoration: none;">taksha.studio/work</a>.</p>
          <br/>
          <p>Best,</p>
          <p><strong>The Taksha Team</strong></p>
        </div>
      `,
    });

    return res.status(200).json({ success: true, data: responseData });

  } catch (err) {
    console.error('Serverless Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
