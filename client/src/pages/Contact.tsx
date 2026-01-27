import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Have questions about our lighting systems? Our team of experts is here to help you choose the right setup for your vehicle.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-6">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-white">Email Us</h3>
                    </div>
                    <p className="text-zinc-400 text-sm">support@expelight.com</p>
                    <p className="text-zinc-400 text-sm">sales@expelight.com</p>
                  </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-white">Call Us</h3>
                    </div>
                    <p className="text-zinc-400 text-sm">+91 98765 43210</p>
                    <p className="text-zinc-400 text-sm">Mon-Sat: 10am - 7pm</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-white">Visit Our Studio</h3>
                  </div>
                  <p className="text-zinc-400 text-sm">
                    Expelight Lighting Systems<br />
                    123, Adventure Drive, Industrial Area<br />
                    Bangalore, Karnataka - 560001
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-6">
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">First Name</label>
                      <Input placeholder="John" className="bg-zinc-800 border-zinc-700" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">Last Name</label>
                      <Input placeholder="Doe" className="bg-zinc-800 border-zinc-700" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Email Address</label>
                    <Input type="email" placeholder="john@example.com" className="bg-zinc-800 border-zinc-700" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Message</label>
                    <Textarea placeholder="How can we help you?" className="min-h-[150px] bg-zinc-800 border-zinc-700" />
                  </div>
                  <Button className="w-full h-12 text-base font-semibold">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}