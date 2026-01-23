import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PolicyHeader } from "@/components/PolicyHeader";
import { Mail, Phone, MapPin } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <PolicyHeader 
        title="Privacy Policy" 
        breadcrumbs={[{ label: "Policies" }, { label: "Privacy Policy" }]} 
      />
      <div className="min-h-screen bg-background pb-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 pt-12">
          
          <div className="prose prose-invert max-w-none space-y-8">
            <p className="text-zinc-400 text-sm">Effective Date: January 2025</p>
            
            <p className="text-zinc-300 leading-relaxed">
              Welcome to Expelight! We respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy describes how Expelight, the official and exclusive authorized distributor of Diode Dynamics LED lighting products in India, collects, uses, and safeguards your personal information when you visit our website, contact us, or purchase our products.
            </p>
            
            <p className="text-zinc-300 leading-relaxed">
              This Privacy Policy has been formulated in accordance with the <strong>Information Technology Act, 2000</strong>, and the rules made thereunder, including the <strong>Digital Personal Data Protection Act (DPDPA), 2023</strong>, and other applicable Indian laws. By accessing or using our website and services, you consent to the practices described in this Policy.
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">1. About Expelight</h2>
              <p className="text-zinc-300 leading-relaxed">
                Expelight is the <strong>official and exclusive authorized distributor of Diode Dynamics LED products</strong> in India. Our website serves as our primary sales and support channel for Indian customers. The privacy of our customers, users, and dealers is of paramount importance to us, and we operate in full compliance with Indian data protection regulations.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">2. Information We Collect</h2>
              <p className="text-zinc-300 leading-relaxed">
                We collect various types of information to provide, maintain, and improve our services. The information may be collected directly from you or automatically through your interactions with our website.
              </p>
              
              <h3 className="text-lg font-medium text-white">A. Information You Provide Directly</h3>
              <p className="text-zinc-300 leading-relaxed">We collect the following personal information when you:</p>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li><strong>Create an Account or Place an Order</strong>: Your full name, email address, phone number, billing address, shipping address, and other contact details. This also includes GST number if applicable.</li>
                <li><strong>Make a Payment</strong>: Although we do not store your full card details, your transaction details are securely processed by our PCI-DSS-compliant payment gateway.</li>
                <li><strong>Communicate with Us</strong>: Any personal information you provide via email, WhatsApp, phone calls, or our website contact form, including your name, email address, mobile number, and your queries or feedback.</li>
              </ul>
              
              <h3 className="text-lg font-medium text-white">B. Information Collected Automatically</h3>
              <p className="text-zinc-300 leading-relaxed">When you use our website, we automatically collect:</p>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li><strong>Device Information</strong>: Such as IP address, browser type, operating system, screen resolution, language, device identifiers.</li>
                <li><strong>Usage Information</strong>: Such as pages visited, products viewed, time spent on pages, click patterns, referring and exit pages, date and time of access.</li>
                <li><strong>Cookies and Tracking Technologies</strong>: We use cookies, pixel tags, and similar technologies for session tracking, personalization, cart management, analytics, and marketing.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">3. Purpose of Data Collection and Use</h2>
              <p className="text-zinc-300 leading-relaxed">
                We collect, store, and process your personal information for the following legitimate business purposes:
              </p>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li>To register your account and authenticate your identity</li>
                <li>To process your orders and deliver the products to your address via third-party logistics services</li>
                <li>To manage payments and ensure transactional security</li>
                <li>To provide post-purchase services including warranty support, order tracking, cancellation, or refund support</li>
                <li>To communicate with you for customer support, feedback, inquiries, and technical assistance</li>
                <li>To share necessary information with Diode Dynamics USA for warranty validation and product-related technical support</li>
                <li>To conduct internal research and analytics to enhance product offerings and user experience</li>
                <li>To comply with legal and regulatory obligations, including income tax, GST, and the DPDPA 2023</li>
                <li>To send marketing messages and promotional communications, only with your consent</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">4. Sharing and Disclosure of Your Information</h2>
              <p className="text-zinc-300 leading-relaxed">
                We do <strong>not sell or rent your personal data</strong> to any third party. However, we may share your data with trusted third parties under strict confidentiality and only for the purposes outlined in this policy:
              </p>
              
              <h3 className="text-lg font-medium text-white">A. With Service Providers:</h3>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li><strong>Payment Gateway</strong>: For securely managing online payments and ensuring transaction integrity.</li>
                <li><strong>Shipping Partners</strong>: For order fulfillment, shipment tracking, and delivery support.</li>
                <li><strong>Website Maintenance and Hosting</strong>: For technical support, hosting, and security.</li>
                <li><strong>Marketing Tools</strong>: For measuring site performance and campaign optimization.</li>
              </ul>
              
              <h3 className="text-lg font-medium text-white">B. With Diode Dynamics (U.S.)</h3>
              <p className="text-zinc-300 leading-relaxed">
                We may share your order details, product information, and contact data with Diode Dynamics USA solely for the purpose of warranty verification, product support, and inventory planning. Your data will not be used for marketing by Diode Dynamics unless you opt in.
              </p>
              
              <h3 className="text-lg font-medium text-white">C. With Government Authorities:</h3>
              <p className="text-zinc-300 leading-relaxed">
                We may disclose your personal information when required to comply with legal obligations, respond to government requests, or protect our legal rights.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">5. Data Retention Policy</h2>
              <p className="text-zinc-300 leading-relaxed">
                We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected and to comply with legal, accounting, or reporting obligations. For example:
              </p>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li>Transactional data and invoices are retained for a minimum of <strong>8 years</strong> as per GST and Income Tax laws.</li>
                <li>Marketing opt-in data is retained until consent is withdrawn.</li>
                <li>Account information is retained until you request deletion, except for data required to be retained by law.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">6. Your Rights Under Indian Law</h2>
              <p className="text-zinc-300 leading-relaxed">
                As a data principal under the <strong>Digital Personal Data Protection Act, 2023</strong>, you have the following rights:
              </p>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li><strong>Right to Access</strong>: You can request access to the personal data we hold about you.</li>
                <li><strong>Right to Correction</strong>: You can correct any inaccurate or incomplete data.</li>
                <li><strong>Right to Erasure</strong>: You can request deletion of data under lawful grounds.</li>
                <li><strong>Right to Consent Management</strong>: You can withdraw marketing consent or opt out of promotional communications.</li>
                <li><strong>Right to Grievance Redressal</strong>: You can file a complaint with our Grievance Officer if your rights are violated.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">7. Cookies and Tracking Policy</h2>
              <p className="text-zinc-300 leading-relaxed">Our website uses cookies and similar tracking technologies to:</p>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li>Maintain user sessions</li>
                <li>Save your preferences and cart data</li>
                <li>Understand site usage and improve navigation</li>
                <li>Run ad campaigns through Google Ads and Meta Ads</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed">
                By using our website, you consent to our use of cookies. You may modify cookie preferences through your browser settings, but disabling essential cookies may impact site functionality.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">8. Data Security Measures</h2>
              <p className="text-zinc-300 leading-relaxed">We implement the following security controls to protect your data:</p>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li>SSL encryption (HTTPS) for all data transmission</li>
                <li>Secure hosting with frequent patch updates</li>
                <li>Internal access controls and employee confidentiality agreements</li>
                <li>Firewalls and intrusion detection systems</li>
                <li>Regular security audits and vulnerability assessments</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed">
                Although we follow strict security protocols, no system is completely secure. We recommend you take appropriate steps to safeguard your own devices and login credentials.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">9. Grievance Officer & Contact Details</h2>
              <p className="text-zinc-300 leading-relaxed">
                As required under the DPDPA 2023, we have appointed a Grievance Officer who will address your concerns regarding data protection and privacy.
              </p>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-3 text-zinc-300">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>connect@expelight.com</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>+91 8897340505</span>
                </div>
                <div className="flex items-start gap-3 text-zinc-300">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <span>Hyderabad, Telangana, India</span>
                </div>
              </div>
              <p className="text-zinc-300 leading-relaxed">
                You can reach out with any queries, complaints, or requests related to your personal data or this Privacy Policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">10. Third-Party Links and Services</h2>
              <p className="text-zinc-300 leading-relaxed">
                Our website may contain links to third-party websites, plugins, or apps. Clicking on those links may allow third parties to collect your data. We do not control and are not responsible for the privacy practices of such external platforms. We encourage you to read their privacy policies before submitting any data.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">11. Policy Changes</h2>
              <p className="text-zinc-300 leading-relaxed">
                We reserve the right to revise this Privacy Policy at any time to reflect changes in law, business operations, or technology. All updates will be posted on this page with the new effective date. Your continued use of our services after such changes constitutes acceptance of the updated terms.
              </p>
              <p className="text-zinc-400 text-sm mt-6 italic">
                This Privacy Policy is published in compliance with Rule 4 of the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 and the Digital Personal Data Protection Act (DPDPA) 2023.
              </p>
            </section>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
