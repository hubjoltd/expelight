import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function CancellationPolicy() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Order Cancellation Policy</h1>
          
          <div className="prose prose-invert max-w-none space-y-8">
            <p className="text-zinc-300 leading-relaxed">
              At Expelight, we strive for efficient order processing and timely delivery. We understand that circumstances can change, and you may need to cancel an order. This policy outlines the conditions under which an order can be cancelled.
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">1. General Cancellation Policy (For In-Stock Items Only)</h2>
              <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                <li>You may request to cancel an order for in-stock items at any time before it has been processed for dispatch from our warehouse</li>
                <li>To request a cancellation, please contact our customer support team immediately during business hours. Please provide your order number</li>
                <li>If your cancellation request for an in-stock item is received and confirmed before dispatch, we will process a full refund to your original payment method within 5-7 business days</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">2. Cancellation of Processed/Dispatched In-Stock Orders</h2>
              <p className="text-zinc-300 leading-relaxed">
                Once an order for in-stock items has been fulfilled or processed for dispatch (i.e., handed over to our shipping partner) or has already been shipped, it cannot be cancelled.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                In such cases, our "No Returns / No Exchanges (Change of Mind Policy)" as detailed in our Returns & Warranty Policy will apply.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">3. Cancellation of Pre-Orders</h2>
              <p className="text-zinc-300 leading-relaxed">
                Due to the special procurement nature and significant upfront costs involved in importing pre-ordered items specifically for you from the US, all pre-orders are considered final and binding after payment has been successfully processed.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                Therefore, we do not offer cancellations or refunds for pre-ordered items due to a change of mind, incorrect ordering, or subjective dissatisfaction once the pre-order has been placed and payment confirmed.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                Please refer to our dedicated Pre-Order Policy for full details on the terms specific to pre-orders.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">4. Cancellation by Expelight</h2>
              <p className="text-zinc-300 leading-relaxed">
                While we strive to fulfill every order, Expelight reserves the right to cancel an order in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                <li><strong className="text-white">Product Unavailability:</strong> If a product ordered becomes unavailable or cannot be procured within a reasonable timeframe</li>
                <li><strong className="text-white">Incorrect Pricing or Product Information:</strong> If there was a technical error or genuine mistake in the pricing or product information displayed</li>
                <li><strong className="text-white">Payment Issues:</strong> If your payment fails or is not authorized</li>
                <li><strong className="text-white">Suspicion of Fraudulent Activity:</strong> If we suspect any fraudulent or unauthorized transaction</li>
                <li><strong className="text-white">Unserviceable Location:</strong> If your shipping address is in an area not serviceable by our logistics partners</li>
                <li><strong className="text-white">Breach of Terms:</strong> If we believe you have violated our Terms & Conditions or any other policy</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed mt-4">
                In the event that Expelight cancels your order, we will notify you immediately and process a full refund to your original payment method within 5-7 business days.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">5. Refund Processing</h2>
              <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                <li>All refunds for accepted cancellations will be processed to the original payment method used for the purchase</li>
                <li>The time taken for the refund to reflect in your account may vary depending on your bank or payment service provider (typically 5-10 business days)</li>
              </ul>
            </section>

            <div className="mt-12 p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
              <p className="text-zinc-400 text-sm">
                This Cancellation Policy works in conjunction with our Shipping & Delivery Policy, Returns & Warranty Policy, and Pre-Order Policy. By placing an order with Expelight, you agree to comply with this Cancellation Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
