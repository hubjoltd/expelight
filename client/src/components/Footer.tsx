import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiInstagram, SiYoutube, SiFacebook } from "react-icons/si";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import expelightLogoDesktop from "@assets/10241024_1769145107961.png";

export function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-border/20" data-testid="footer">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Main footer content */}
        <div className="py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-6" data-testid="footer-logo">
              <img 
                src={expelightLogoDesktop} 
                alt="Expelight" 
                className="h-32 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              Official India Partner for Diode Dynamics USA. Engineering-grade lighting systems for the modern Indian explorer.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-md border-border/30 hover:border-primary/50 hover:text-primary"
                data-testid="social-instagram"
              >
                <SiInstagram className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-md border-border/30 hover:border-primary/50 hover:text-primary"
                data-testid="social-youtube"
              >
                <SiYoutube className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-md border-border/30 hover:border-primary/50 hover:text-primary"
                data-testid="social-facebook"
              >
                <SiFacebook className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { label: "All Products", href: "/products" },
                { label: "Science of Light", href: "/science" },
                { label: "Fit Your Vehicle", href: "/vehicle-fit" },
                { label: "Contact Us", href: "/contact" },
                { label: "Installation Guides", href: "/guides" },
                { label: "Warranty Claims", href: "/warranty" },
                { label: "Blog", href: "/blog" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-4">
              {[
                { label: "FAQs", href: "/science#faq" },
                { label: "Shipping & Returns", href: "/shipping" },
                { label: "Track Order", href: "/track" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-semibold mb-4 mt-8 text-sm uppercase tracking-wider">Policies</h4>
            <ul className="space-y-3">
              {[
                { label: "Returns & Warranty", href: "/policies/returns-warranty" },
                { label: "Shipping & Delivery", href: "/policies/shipping-delivery" },
                { label: "Cancellation Policy", href: "/policies/cancellation" },
                { label: "Pre Order Policy", href: "/policies/pre-order" },
                { label: "Grievance Redressal", href: "/policies/grievance-redressal" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span>support@expelight.in</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider">Stay Updated</h4>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Get exclusive offers and early access to new products.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-background border-border/30 h-11"
                data-testid="newsletter-email"
              />
              <Button
                className="bg-primary text-primary-foreground h-11"
                size="icon"
                data-testid="newsletter-submit"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-8 border-t border-border/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2025 Expelight. All rights reserved. Official India Partner for Diode Dynamics USA.
          </p>
          <div className="flex gap-8">
            <Link href="/policies/privacy-policy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/policies/terms-conditions" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
