import { useState, memo, useCallback, useMemo, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, MapPin, Mail, Phone, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ContactSection = memo(function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData as any).toString(),
    })
      .then(() => {
        setSubmitted(true);
        toast({
          title: "Message sent successfully!",
          description: `Thank you ${name}, we'll contact you soon.`,
        });
        setName("");
        setEmail("");
        setMessage("");
      })
      .catch((error) => {
        console.error("Form submission error:", error);
        toast({
          title: "Something went wrong!",
          description: "Please try again later or contact us directly.",
          variant: "destructive",
        });
      })
      .finally(() => setIsSubmitting(false));
  }, [name, toast]);

  // Google Ads conversion tracking
  const gtagReportConversion = useCallback((url?: string, targetWindow?: Window | null) => {
    const callback = () => {
      if (typeof url !== "undefined") {
        if (targetWindow && !targetWindow.closed) {
          try {
            targetWindow.location.href = url;
            return;
          } catch (err) {
            // fallback
          }
        }
        try {
          window.open(url, "_blank");
        } catch (err) {
          (window as any).location = url;
        }
      }
    };

    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "conversion", {
        send_to: "AW-16463357836/n6RiCOKH_I0bEIzPq6o9",
        event_callback: callback,
      });
    } else {
      callback();
    }
    return false;
  }, []);

  const contactMethods = useMemo(() => [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "+974 5551 2858",
      href: "https://wa.me/+97455512858",
      external: true,
      hasConversion: true,
    },
    {
      icon: Mail,
      label: "Email",
      value: "info@alarabiacarpets.com",
      href: "mailto:info@alarabiacarpets.com",
      external: false,
      hasConversion: false,
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Al Mansoura St, Doha, Qatar",
      href: "https://maps.google.com/?q=Al+Mansoura+St,+Doha,+Qatar",
      external: true,
      hasConversion: false,
    },
  ], []);

  return (
    <section 
      ref={sectionRef}
      id="contact" 
      className="relative py-24 lg:py-32 bg-forest-900 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl" />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-5 lg:px-8">
        {/* CTA Header */}
        <div 
          className={`text-center mb-16 transition-all duration-1000 ease-out-expo ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-headline-1 font-display text-white mb-6">
            Ready to Transform
            <br />
            <span className="text-gradient">Your Space?</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
            Get in touch with our team for personalized recommendations and a free quote.
            We're here to bring your vision to life.
          </p>
          
          {/* Primary CTA */}
          <a
            href="https://wa.me/+97455512858"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              const newWin = window.open("about:blank", "_blank");
              gtagReportConversion("https://wa.me/+97455512858", newWin);
            }}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gold-500 text-forest-900 text-lg font-semibold rounded-full transition-all duration-300 hover:bg-gold-400 hover:shadow-float hover:scale-[1.02]"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-6xl mx-auto">
          {/* Contact Methods */}
          <div 
            className={`transition-all duration-1000 ease-out-expo ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <h3 className="text-2xl font-display font-semibold text-white mb-8">
              Get in Touch
            </h3>
            
            <div className="space-y-4">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <a
                    key={method.label}
                    href={method.href}
                    {...(method.external && { target: "_blank", rel: "noopener noreferrer" })}
                    onClick={(e) => {
                      if (method.hasConversion) {
                        e.preventDefault();
                        const newWin = window.open("about:blank", "_blank");
                        gtagReportConversion(method.href, newWin);
                      }
                    }}
                    className="group flex items-center gap-5 p-5 rounded-2xl bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <Icon className="w-6 h-6 text-gold-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white/60 mb-1">{method.label}</p>
                      <p className="text-white font-medium">{method.value}</p>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Quick Links */}
            <div className="mt-10 pt-10 border-t border-white/10">
              <p className="text-sm text-white/60 mb-4">Quick Links</p>
              <div className="flex flex-wrap gap-3">
                <Link 
                  to="/products"
                  className="px-4 py-2 text-sm text-white/80 bg-white/5 rounded-full border border-white/10 transition-all duration-300 hover:bg-white/10 hover:text-white"
                >
                  View Products
                </Link>
                <Link 
                  to="/about"
                  className="px-4 py-2 text-sm text-white/80 bg-white/5 rounded-full border border-white/10 transition-all duration-300 hover:bg-white/10 hover:text-white"
                >
                  About Us
                </Link>
                <a 
                  href="tel:+97455512858"
                  className="px-4 py-2 text-sm text-white/80 bg-white/5 rounded-full border border-white/10 transition-all duration-300 hover:bg-white/10 hover:text-white"
                >
                  Call Now
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div 
            className={`transition-all duration-1000 ease-out-expo ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <h3 className="text-2xl font-display font-semibold text-white mb-6">
                Send a Message
              </h3>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">Thank You!</h4>
                  <p className="text-white/70">We'll get back to you shortly.</p>
                </div>
              ) : (
                <form 
                  onSubmit={handleSubmit} 
                  name="contact" 
                  method="POST" 
                  data-netlify="true" 
                  data-netlify-honeypot="bot-field"
                  className="space-y-5"
                >
                  <input type="hidden" name="form-name" value="contact" />
                  <input type="hidden" name="bot-field" />
                  
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Name</label>
                    <Input
                      type="text"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-gold-500 focus:ring-gold-500/20 rounded-xl h-12"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Email</label>
                    <Input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-gold-500 focus:ring-gold-500/20 rounded-xl h-12"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Message</label>
                    <Textarea
                      name="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={4}
                      className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-gold-500 focus:ring-gold-500/20 rounded-xl resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-white text-forest-900 font-semibold rounded-xl transition-all duration-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default ContactSection;
