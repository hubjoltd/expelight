import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PreOrderPolicy() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Pre-Order Policy</h1>
          
          <div className="prose prose-invert max-w-none space-y-8">
            <p className="text-zinc-300 leading-relaxed">
              At Expelight, we are excited to offer you the opportunity to pre-order certain Diode Dynamics products that are not immediately available from our in-India stock. These products are specially sourced from the US to fulfill your order. By placing a pre-order, you agree to the following terms and conditions specific to pre-order items.
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">1. What is a Pre-Order?</h2>
              <p className="text-zinc-300 leading-relaxed">
                A pre-order allows you to reserve a product that is not currently in our Indian inventory. Upon receiving your payment, we initiate the special procurement process for this item directly from Diode Dynamics in the US.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">2. Commitment & Payment</h2>
              <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                <li><strong className="text-white">Full Payment Required:</strong> To secure your pre-order and initiate the international procurement process, full payment is required at the time of placing the pre-order. Your payment confirms your commitment to purchase the item</li>
                <li><strong className="text-white">Irreversible Procurement:</strong> Once your payment is confirmed, we immediately commit funds to our US supplier to procure your specific item. This involves international purchasing, logistics, and customs processes which incur non-refundable costs for us</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">3. No Cancellation or Refunds After Placing Order</h2>
              <div className="bg-zinc-900 border border-primary/30 rounded-lg p-6">
                <p className="text-zinc-300 leading-relaxed">
                  Due to the special procurement nature and the significant upfront costs involved in importing pre-ordered items specifically for you from the US, all pre-orders are considered <strong className="text-white">final and binding</strong> after payment has been successfully processed.
                </p>
                <p className="text-zinc-300 leading-relaxed mt-4">
                  We do not offer cancellations or refunds for pre-ordered items due to a change of mind, incorrect ordering by the customer, or subjective dissatisfaction once the order has been placed and payment confirmed.
                </p>
              </div>
              <p className="text-zinc-300 leading-relaxed mt-4">
                We strongly advise you to carefully review all product specifications, compatibility, and our Pre-Order Policy before confirming your purchase.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">4. Estimated Delivery Timeframe</h2>
              <p className="text-zinc-300 leading-relaxed">
                Pre-ordered items typically require an estimated <strong className="text-white">6-8 weeks</strong> from the date of payment confirmation for delivery to your address in India. This timeframe accounts for international shipping, customs clearance, and final domestic delivery.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                While we strive to meet these estimates, please understand that international logistics can be subject to unforeseen delays (e.g., customs inspections, carrier delays, port congestion). We will keep you informed of any significant delays impacting your pre-order.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                <strong className="text-white">Note on Delays:</strong> Minor or reasonable delays within the typical range of international shipping are not grounds for cancellation or refund.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">5. Warranty for Pre-Ordered Items</h2>
              <p className="text-zinc-300 leading-relaxed">
                Our commitment to quality remains unwavering for all products, including pre-orders.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                In the event that a pre-ordered product is defective in material or workmanship upon delivery, or develops a manufacturing defect within its specified warranty period, it will be covered under our standard Warranty Policy.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                Our "No Cancellation or Refunds" policy for pre-orders does NOT apply to defective or faulty products covered under our warranty.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">6. Combined Orders (In-Stock & Pre-Order)</h2>
              <p className="text-zinc-300 leading-relaxed">
                If your order includes both in-stock items and pre-order items, the entire order will be shipped together once all pre-order items have arrived at our Indian warehouse.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                If you wish to receive the in-stock items sooner, please place a separate order for them. Separate shipping charges will apply to each order.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">7. Pre-Order Updates</h2>
              <p className="text-zinc-300 leading-relaxed">
                We will endeavor to provide you with updates on the status of your pre-order, particularly during key milestones like dispatch from the US and customs clearance in India.
              </p>
            </section>

            <div className="mt-12 p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
              <p className="text-zinc-400 text-sm">
                By proceeding with a pre-order from Expelight, you acknowledge and accept these terms and conditions. We appreciate your understanding and patience as we work to bring you the best of Diode Dynamics.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
