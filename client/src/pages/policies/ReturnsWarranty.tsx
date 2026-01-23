import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ReturnsWarranty() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Returns & Warranty Policy</h1>
          
          <div className="prose prose-invert max-w-none space-y-8">
            <p className="text-zinc-300 leading-relaxed">
              At Expelight, we are committed to providing the highest quality, genuine US-made LED lighting products. Our products undergo rigorous testing and are backed by Diode Dynamics' industry-leading warranty. Your satisfaction with the performance and quality of our products is our priority.
            </p>
            <p className="text-zinc-400">Please read our policy carefully before making a purchase.</p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">1. No Returns / No Exchanges (Change of Mind Policy)</h2>
              <p className="text-zinc-300 leading-relaxed">
                All sales are final. Due to the specialized nature of our high-performance automotive lighting products, and to prevent misuse and ensure fair pricing for all customers, we do not accept returns or offer exchanges for products purchased due to a change of mind, incorrect ordering by the customer, or subjective dissatisfaction.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                We strongly advise customers to thoroughly research the product specifications, compatibility, and application before making a purchase. Our website provides detailed information, images, and technical specifications to assist you. Our customer support team is also available to help with pre-purchase inquiries.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">2. Damaged or Defective Products (Covered by Warranty)</h2>
              <p className="text-zinc-300 leading-relaxed">
                In the unlikely event that you receive a product that is damaged during transit or is found to be defective in material or workmanship upon delivery, please notify us immediately within 24 hours of receiving the product. Please provide clear photographs or videos of the damage/defect along with your order details.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                For any genuine manufacturing defects or performance issues that arise during the warranty period, your product is covered by the Diode Dynamics India Warranty. A "no return" policy does NOT apply to defective or faulty products.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">3. Warranty Policy</h2>
              <p className="text-zinc-300 leading-relaxed">
                As the authorized distributor for Diode Dynamics in India, all products purchased from Expelight or our authorized dealers are covered by the official Diode Dynamics warranty.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                The warranty period and terms are specific to each product, as detailed on our website product pages and in the official Diode Dynamics warranty documentation.
              </p>
              
              <h3 className="text-lg font-medium text-white mt-6">Warranty Exclusions:</h3>
              <p className="text-zinc-300">The warranty does NOT cover damage resulting from:</p>
              <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                <li>Improper installation, negligence, or misuse of the product</li>
                <li>Modification, tampering, or unauthorized repair attempts</li>
                <li>Accidents, impact, water damage (beyond IP rating), or environmental factors</li>
                <li>Normal wear and tear</li>
                <li>Purchase from unauthorized sellers</li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6">Warranty Claim Process:</h3>
              <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                <li>Contact our customer support team with your order number, product details, and a clear description/evidence (photos/videos) of the issue</li>
                <li>Before sending the product, please request a Return Merchandise Authorization (RMA)</li>
                <li>Our technical team will review your claim and may require further diagnostic information</li>
                <li>If the product is determined to be defective under warranty, we will provide instructions for return</li>
                <li>Upon receipt and inspection of the defective product, we will, at our discretion, repair or replace the product</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">4. Cancellations</h2>
              <p className="text-zinc-300 leading-relaxed">
                Orders can only be cancelled if they have not yet been processed for shipping. Once an order is marked as "Processed" or "Shipped," it cannot be cancelled.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                To request a cancellation, please contact us immediately during business hours.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Warranty Coverage Periods</h2>
              
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-primary">Limited Lifetime Warranty</h4>
                  <p className="text-zinc-300 text-sm">Applies to select off-road products including SSC1, SSC2, SS3, SS5 LED Pods, Stage Series Rock Lights, and HitchMount LED Pod Reverse Kit.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary">8-Year Limited Warranty</h4>
                  <p className="text-zinc-300 text-sm">Applies to all Stage Series (SS) products and Elite Series Headlights/Fog Lights.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary">3-Year Replacement Limited Warranty</h4>
                  <p className="text-zinc-300 text-sm">Applies to all other Diode Dynamics products (LED bulbs, accents, D-Switches, wiring harnesses, etc.).</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Important Notes</h2>
              <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                <li>All products returned for warranty claims must be in their original packaging (if possible) with all accessories</li>
                <li>It is the customer's responsibility to ensure the correct product is ordered for their vehicle application</li>
                <li>Warranty coverage is extended only to the original purchaser and is not transferable</li>
                <li>Proof of original purchase (invoice, order confirmation) is required for any warranty request</li>
              </ul>
            </section>

            <div className="mt-12 p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
              <p className="text-zinc-400 text-sm">
                By completing a purchase on our website, you agree to abide by this Returns & Warranty Policy. For any questions, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
