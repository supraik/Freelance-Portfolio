import { useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Mail, Phone } from "lucide-react";
import { contactContent, siteConfig } from "@/data/portfolioContent";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (replace with actual backend integration)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message Sent",
      description: "Thank you for your inquiry. I'll get back to you soon.",
    });

    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="editorial-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16 md:mb-24"
          >
            <span className="block font-body text-xs tracking-editorial-wide text-muted-foreground mb-4 uppercase">
              Get in Touch
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-editorial text-foreground">
              CONTACT
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-24 md:pb-32 lg:pb-40">
        <div className="editorial-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl md:text-3xl tracking-editorial text-foreground mb-8">
                LET'S WORK TOGETHER
              </h2>
              
              <p className="font-body text-base md:text-lg text-foreground/80 leading-relaxed mb-12">
                For bookings, collaborations, or any inquiries, please reach out through the form or contact details below.
              </p>

              {/* Contact Details */}
              <div className="space-y-6">
                {contactContent.email && (
                  <a
                    href={`mailto:${contactContent.email}`}
                    className="flex items-center gap-4 text-foreground/70 hover:text-foreground transition-colors group"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="font-body text-sm tracking-wider">
                      {contactContent.email}
                    </span>
                  </a>
                )}

                {contactContent.phone && (
                  <a
                    href={`tel:${contactContent.phone}`}
                    className="flex items-center gap-4 text-foreground/70 hover:text-foreground transition-colors group"
                  >
                    <Phone className="w-5 h-5" />
                    <span className="font-body text-sm tracking-wider">
                      {contactContent.phone}
                    </span>
                  </a>
                )}

                {contactContent.social.instagram && (
                  <a
                    href={contactContent.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 text-foreground/70 hover:text-foreground transition-colors group"
                  >
                    <Instagram className="w-5 h-5" />
                    <span className="font-body text-sm tracking-wider">
                      Instagram
                    </span>
                  </a>
                )}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block font-body text-xs tracking-wider uppercase text-muted-foreground mb-2"
                    >
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-transparent border-border focus:border-foreground rounded-none font-body"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block font-body text-xs tracking-wider uppercase text-muted-foreground mb-2"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-transparent border-border focus:border-foreground rounded-none font-body"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block font-body text-xs tracking-wider uppercase text-muted-foreground mb-2"
                  >
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="bg-transparent border-border focus:border-foreground rounded-none font-body"
                    placeholder="Booking inquiry, collaboration, etc."
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block font-body text-xs tracking-wider uppercase text-muted-foreground mb-2"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="bg-transparent border-border focus:border-foreground rounded-none font-body resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-none bg-foreground text-background hover:bg-foreground/90 font-body text-sm tracking-wider uppercase py-6"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="editorial-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="font-display text-lg tracking-editorial text-foreground">
              {siteConfig.name.toUpperCase()}
            </span>
            <span className="font-body text-xs tracking-wider text-muted-foreground">
              © {new Date().getFullYear()} All Rights Reserved
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
