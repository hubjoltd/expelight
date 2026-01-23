import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PolicyHeader } from "@/components/PolicyHeader";
import { Link } from "wouter";

export default function TermsConditions() {
  return (
    <>
      <Header />
      <PolicyHeader 
        title="Terms and Conditions of Service" 
        breadcrumbs={[{ label: "Policies" }, { label: "Terms & Conditions" }]} 
      />
      <div className="min-h-screen bg-background pb-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 pt-12">
          
          <div className="prose prose-invert max-w-none space-y-8">
            <p className="text-zinc-400 text-sm">Effective Date: January 2025</p>
            
            <p className="text-zinc-300 leading-relaxed">
              Welcome to Expelight! These Terms and Conditions of Service ("Terms") govern your access to and use of the Expelight website, our products, and our services.
            </p>
            
            <p className="text-zinc-300 leading-relaxed">
              Expelight is the official and exclusive authorized distributor of genuine Diode Dynamics LED lighting products in India.
            </p>
            
            <p className="text-zinc-300 leading-relaxed">
              By accessing or using our website, purchasing products, or otherwise interacting with our services, you agree to be bound by these Terms, along with our{" "}
              <Link href="/policies/returns-warranty" className="text-primary hover:underline">Returns & Warranty Policy</Link>,{" "}
              <Link href="/policies/shipping-delivery" className="text-primary hover:underline">Shipping & Delivery Policy</Link>,{" "}
              <Link href="/policies/cancellation" className="text-primary hover:underline">Cancellation Policy</Link>, and{" "}
              <Link href="/policies/pre-order" className="text-primary hover:underline">Pre-Order Policy</Link>, all of which are incorporated herein by reference. If you do not agree to these Terms, you may not access or use our website or services.
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">1. Definitions</h2>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li><strong>"Expelight," "we," "us," "our"</strong>: Refers to Expelight, the official distributor operating the website.</li>
                <li><strong>"Website"</strong>: Refers to the Expelight website.</li>
                <li><strong>"User," "you," "your"</strong>: Refers to any person accessing or using the Website, including visitors, customers, and registered users.</li>
                <li><strong>"Products"</strong>: Refers to the Diode Dynamics LED lighting products and related accessories offered for sale on the Website.</li>
                <li><strong>"Order"</strong>: Refers to a request by you to purchase Products from us.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">2. Eligibility</h2>
              <p className="text-zinc-300 leading-relaxed">
                By using our Website, you affirm that you are at least 18 years of age and are legally competent to enter into this agreement. If you are accessing or using the Website on behalf of a company or other legal entity, you represent that you have the authority to bind such entity to these Terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">3. Account Registration</h2>
              <p className="text-zinc-300 leading-relaxed">
                To access certain features of our Website, such as making a purchase or tracking orders, you may be required to register for an account.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                You are solely responsible for maintaining the confidentiality of your account password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                We reserve the right to suspend or terminate your account and refuse any and all current or future use of the Website if any information provided proves to be inaccurate, false, or incomplete, or if we have reasonable grounds to suspect that such information is inaccurate, false, or incomplete.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">4. Products and Orders</h2>
              <ul className="list-disc list-inside text-zinc-300 space-y-3">
                <li><strong>Product Descriptions</strong>: We strive to provide accurate descriptions, images, and specifications of our Products. However, we do not warrant that product descriptions or other content on the Website are completely accurate, complete, reliable, current, or error-free. Colors and finishes may appear differently depending on your screen settings.</li>
                <li><strong>Pricing</strong>: All prices displayed on the Website are in Indian Rupees (INR) and are inclusive of Goods and Services Tax (GST) where applicable. Prices are subject to change without prior notice. We reserve the right to correct any pricing errors that may occur.</li>
                <li><strong>Availability</strong>: Product availability is subject to change. While we strive to maintain accurate stock information, a product listed as "in stock" may occasionally be unavailable. If a Product you ordered is out of stock before dispatch, we will notify you and offer alternatives or a full refund.</li>
                <li><strong>Order Acceptance</strong>: Your Order constitutes an offer to purchase a Product. All Orders are subject to acceptance by Expelight. We reserve the right to accept or decline your Order for any reason.</li>
                <li><strong>Pre-Orders</strong>: Specific terms regarding pre-ordered items, including payment, delivery timelines, and cancellation policy, are detailed in our Pre-Order Policy.</li>
                <li><strong>Payment</strong>: Payments are processed securely through our payment gateway. We do not store your full card details on our servers. You agree to provide valid and authorized payment information at checkout.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">5. Shipping and Delivery</h2>
              <p className="text-zinc-300 leading-relaxed">
                Shipping and delivery of Products are subject to our <Link href="/policies/shipping-delivery" className="text-primary hover:underline">Shipping & Delivery Policy</Link>.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                You agree to provide accurate and complete shipping details. We are not responsible for delays or non-delivery due to incorrect or incomplete address information provided by you.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">6. Returns, Refunds, and Cancellations</h2>
              <p className="text-zinc-300 leading-relaxed">
                Returns, refunds, and cancellations are governed by our specific policies:
              </p>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li><Link href="/policies/returns-warranty" className="text-primary hover:underline">Returns & Warranty Policy</Link>: Covers product issues after delivery (defects, transit damage) and outlines our warranty terms.</li>
                <li><Link href="/policies/cancellation" className="text-primary hover:underline">Cancellation Policy</Link>: Covers cancellation requests for in-stock orders before dispatch and outlines conditions for cancellation.</li>
                <li><Link href="/policies/pre-order" className="text-primary hover:underline">Pre-Order Policy</Link>: Explicitly states the "no cancellation or refunds after placing order" for pre-ordered items due to their special procurement nature.</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed">
                By making a purchase, you acknowledge and agree to these respective policies.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">7. User Conduct</h2>
              <p className="text-zinc-300 leading-relaxed">
                You agree to use our Website and services only for lawful purposes and in a manner that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the Website. Prohibited conduct includes, but is not limited to:
              </p>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li>Engaging in any illegal activity or promoting any illegal acts.</li>
                <li>Harassing, threatening, defaming, or otherwise violating the legal rights of others.</li>
                <li>Uploading or transmitting viruses, worms, malware, or any other malicious code.</li>
                <li>Attempting to gain unauthorized access to our Website, servers, or networks.</li>
                <li>Collecting or storing personal data about other users without their express consent.</li>
                <li>Misrepresenting your identity or affiliations.</li>
                <li>Using automated means (bots, scrapers) to access, collect data, or interact with our Website without our express written permission.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">8. Intellectual Property Rights</h2>
              <p className="text-zinc-300 leading-relaxed">
                All content on this Website, including but not limited to text, graphics, logos, images, audio clips, video clips, data compilations, software, and the compilation thereof (collectively, "Content"), is the property of Expelight, Diode Dynamics, its licensors, or its content suppliers and is protected by Indian and international copyright laws.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                The trademarks, service marks, and logos used and displayed on this Website ("Trademarks") are registered and unregistered Trademarks of Expelight, Diode Dynamics, and others. Nothing on this Website should be construed as granting, by implication, estoppel, or otherwise, any license or right to use any Trademark displayed on the Website without the prior written permission of the Trademark owner.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                You may not copy, reproduce, distribute, republish, download, display, post, or transmit any Content or Trademarks in any form or by any means without our prior written permission.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">9. Disclaimer of Warranties</h2>
              <p className="text-zinc-300 leading-relaxed">
                The Website and all Products and services provided through it are provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                Expelight does not warrant that the Website will be uninterrupted, secure, or error-free, that defects will be corrected, or that the Website or the server that makes it available are free of viruses or other harmful components.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                Your use of the Website is solely at your own risk. This section does not affect the specific product warranties provided by Diode Dynamics and honored by Expelight, as detailed in our Returns & Warranty Policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">10. Limitation of Liability</h2>
              <p className="text-zinc-300 leading-relaxed">
                To the maximum extent permitted by applicable law, in no event shall Expelight, its proprietors, employees, agents, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li>Your access to or use of or inability to access or use the Website or Products;</li>
                <li>Any conduct or content of any third party on the Website;</li>
                <li>Any content obtained from the Website; and</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed">
                In no event shall our total liability to you for all damages, losses, and causes of action exceed the amount paid by you, if any, for accessing the Website or for the specific Product giving rise to the claim.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">11. Indemnification</h2>
              <p className="text-zinc-300 leading-relaxed">
                You agree to defend, indemnify, and hold harmless Expelight, its proprietors, employees, and agents, from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of:
              </p>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li>Your use of and access to the Website;</li>
                <li>Your breach of any of these Terms;</li>
                <li>Your violation of any third-party right, including without limitation any copyright, property, or privacy right; or</li>
                <li>Any claim that your use of the Website caused damage to a third party.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">12. Governing Law and Jurisdiction</h2>
              <p className="text-zinc-300 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles. Any disputes arising out of or in connection with these Terms, the Website, or Products shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana, India.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">13. Grievance Redressal</h2>
              <p className="text-zinc-300 leading-relaxed">
                For any concerns, complaints, or grievances regarding our products or services, please refer to our dedicated <Link href="/policies/grievance-redressal" className="text-primary hover:underline">Grievance Redressal</Link> page or contact our support team directly.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                We will acknowledge receipt of your complaint within 48 hours and strive to resolve it within one month from the date of receipt, as per applicable regulations.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">14. Severability</h2>
              <p className="text-zinc-300 leading-relaxed">
                If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">15. Changes to These Terms</h2>
              <p className="text-zinc-300 leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Website after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">16. Contact Us</h2>
              <p className="text-zinc-300 leading-relaxed">
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li>By email: connect@expelight.com</li>
                <li>By phone: +91 8897340505</li>
              </ul>
            </section>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
