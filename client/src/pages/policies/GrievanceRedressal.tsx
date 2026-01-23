import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PolicyHeader } from "@/components/PolicyHeader";
import { Mail, Phone, MapPin } from "lucide-react";

export default function GrievanceRedressal() {
  return (
    <>
      <Header />
      <PolicyHeader 
        title="Grievance Redressal Policy" 
        breadcrumbs={[{ label: "Policies" }, { label: "Grievance Redressal" }]} 
      />
      <div className="min-h-screen bg-background pb-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 pt-12">
          
          <div className="prose prose-invert max-w-none space-y-8">
            <p className="text-zinc-300 leading-relaxed">
              At Expelight, we are committed to providing a seamless and transparent shopping experience. As the official and exclusive distributor of Diode Dynamics LED products in India, we hold ourselves to the highest standards of customer service and compliance. This Grievance Redressal Policy outlines our structured approach for addressing customer grievances in a prompt, fair, and legally compliant manner.
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">1. Scope of the Policy</h2>
              <p className="text-zinc-300 leading-relaxed">
                This policy applies to all grievances or complaints raised by users, customers, or visitors of our website concerning our products, services, website experience, data handling practices, delivery, warranty, returns, cancellations, or any aspect of our operations. It also covers concerns related to data privacy or the misuse of personal information under applicable data protection laws.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">2. Lodging a Grievance</h2>
              <p className="text-zinc-300 leading-relaxed">
                Customers may submit their grievances through any of the following channels:
              </p>
              
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-zinc-400">support@expelight.in</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-white font-medium">Phone</p>
                    <p className="text-zinc-400">+91 98765 43210 (Mon-Sat, 10 AM - 6 PM IST)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-white font-medium">Postal Mail</p>
                    <p className="text-zinc-400">Address your written complaint to our office in Mumbai, Maharashtra, India</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">3. Acknowledgment of Complaint</h2>
              <p className="text-zinc-300 leading-relaxed">
                Upon receipt of a complaint or grievance, we will acknowledge the same <strong className="text-white">within 48 (forty-eight) working hours</strong>, either through email or phone. The acknowledgment will include a grievance tracking ID (if applicable) and an expected timeline for resolution.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">4. Resolution Timelines</h2>
              <p className="text-zinc-300 leading-relaxed">
                We are committed to resolving grievances <strong className="text-white">within a period of 30 (thirty) days</strong> from the date of receipt. The resolution may involve a direct response, escalation to the concerned department, issuance of refund/replacement, clarification of our policies, or corrective action, depending on the nature of the grievance.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                If additional time is required for investigation or action, the complainant will be informed of the delay and provided with an updated expected date of resolution.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">5. Escalation Mechanism</h2>
              <p className="text-zinc-300 leading-relaxed">
                If a customer is dissatisfied with the resolution provided by our support team or Grievance Officer, they may request an escalation. Escalations will be reviewed by a senior member of our management team, and a further response will be provided within 7 working days of the escalation request.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">6. Privacy & Confidentiality</h2>
              <p className="text-zinc-300 leading-relaxed">
                All complaints and user information shared in the grievance process will be handled in accordance with our Privacy Policy and applicable data protection laws. We assure complete confidentiality of your personal data, and any use or disclosure will strictly adhere to lawful and permitted purposes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">7. Withdrawal of Complaint</h2>
              <p className="text-zinc-300 leading-relaxed">
                If the complainant wishes to withdraw the grievance during the investigation or resolution process, they may inform the Grievance Officer in writing or via email. Upon confirmation, the grievance will be closed, and a formal communication will be sent confirming the same.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">8. Maintenance of Records</h2>
              <p className="text-zinc-300 leading-relaxed">
                All grievances received and actions taken shall be logged and maintained for a minimum period of 3 (three) years, or as may be required under applicable laws. This includes date of receipt, nature of grievance, communication records, and resolution details.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">9. Governing Law and Jurisdiction</h2>
              <p className="text-zinc-300 leading-relaxed">
                This policy shall be governed in accordance with the laws of India. Any disputes arising out of or relating to this Grievance Redressal Policy shall be subject to the exclusive jurisdiction of the competent courts in India.
              </p>
            </section>

            <div className="mt-12 p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Contact for Grievance Redressal</h3>
              <div className="space-y-2 text-zinc-300">
                <p><strong className="text-white">Email:</strong> support@expelight.in</p>
                <p><strong className="text-white">Phone:</strong> +91 98765 43210</p>
                <p><strong className="text-white">Address:</strong> Mumbai, Maharashtra, India</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
