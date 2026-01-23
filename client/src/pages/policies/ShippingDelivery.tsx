import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PolicyHeader } from "@/components/PolicyHeader";

export default function ShippingDelivery() {
  return (
    <>
      <Header />
      <PolicyHeader 
        title="Shipping & Delivery Policy" 
        breadcrumbs={[{ label: "Policies" }, { label: "Shipping & Delivery" }]} 
      />
      <div className="min-h-screen bg-background pb-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 pt-12">
          
          <div className="prose prose-invert max-w-none space-y-8">
            <p className="text-zinc-300 leading-relaxed">
              At Expelight, we understand that getting your high-performance LED lighting quickly and reliably is important. We partner with leading logistics platforms to ensure efficient and secure delivery of your orders across India.
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">1. Order Processing Time</h2>
              <p className="text-zinc-300 leading-relaxed">
                <strong className="text-white">For In-Stock Items:</strong> All in-stock orders are processed and prepared for dispatch within 1-2 business days (Monday to Friday, excluding public holidays). Orders placed after 2:00 PM IST on a business day, or on weekends/public holidays, will begin processing on the next business day.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                <strong className="text-white">For Pre-Order Items:</strong> Pre-order items are processed for procurement from the US immediately after payment confirmation. The estimated delivery timeframe for pre-order items is 6-8 weeks.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">2. Shipping Charges</h2>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-zinc-700">
                  <span className="text-zinc-300">Orders up to Rs. 2,999</span>
                  <span className="text-white font-medium">Rs. 150 shipping fee</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-700">
                  <span className="text-zinc-300">Orders Rs. 3,000 - Rs. 4,999</span>
                  <span className="text-white font-medium">Rs. 99 shipping fee</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-300">Orders Rs. 5,000 and above</span>
                  <span className="text-primary font-medium">FREE Shipping</span>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">3. Delivery Timeframes</h2>
              
              <h3 className="text-lg font-medium text-white">For In-Stock Items (after dispatch):</h3>
              <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                <li>Within Telangana (Hyderabad & surrounding areas): 2-4 business days</li>
                <li>Metropolitan Cities (Delhi, Mumbai, Bangalore, Chennai, Kolkata): 3-7 business days</li>
                <li>Rest of India or Remote locations: 5-10 business days</li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6">For Pre-Order Items:</h3>
              <p className="text-zinc-300 leading-relaxed">
                Please allow 6-8 weeks from the date of payment for your pre-order to be delivered. This timeframe includes international shipping, customs clearance, and domestic delivery.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">4. Order Tracking</h2>
              <p className="text-zinc-300 leading-relaxed">
                Once your order is dispatched, you will receive an email with your tracking number and a link to track your shipment's progress. You can also track your order directly on our website by visiting our "Track Your Order" page.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">5. Important Shipping Notes</h2>
              <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                <li><strong className="text-white">High-Value Shipments:</strong> All shipments are packed with utmost care and appropriate protective measures</li>
                <li><strong className="text-white">Recipient Availability:</strong> Please ensure someone is available to receive the package at the provided shipping address</li>
                <li><strong className="text-white">Address Accuracy:</strong> Provide a complete and accurate shipping address, including pincode and a valid mobile number</li>
                <li><strong className="text-white">Lost or Damaged Shipments:</strong> Contact our customer support team immediately with your order number and clear photographs</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">6. International Shipping</h2>
              <p className="text-zinc-300 leading-relaxed">
                Currently, we only ship within India. We do not offer international shipping services directly to customers.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">7. Delays Due to External Factors</h2>
              <p className="text-zinc-300 leading-relaxed">We are not responsible for shipping delays caused by:</p>
              <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                <li>Natural calamities (floods, earthquakes)</li>
                <li>National or local strikes</li>
                <li>Government restrictions (lockdowns, customs bans)</li>
                <li>Courier partner service issues or inaccessibility</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed mt-4">
                However, we will fully support and coordinate to get your product delivered at the earliest possible time.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">8. Customer Support</h2>
              <p className="text-zinc-300 leading-relaxed">
                For all shipping-related concerns or updates, contact us via email or phone. Support Hours: Monday to Saturday, 10:00 AM - 6:00 PM (excluding public holidays).
              </p>
            </section>

            <div className="mt-12 p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
              <p className="text-zinc-400 text-sm">
                By placing an order with Expelight, you agree to comply with this Shipping & Delivery Policy. We reserve the right to modify this policy at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
