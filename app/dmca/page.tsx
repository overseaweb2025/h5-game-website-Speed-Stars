import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { ChevronLeftIcon, ShieldIcon, AlertTriangleIcon, FileTextIcon, MailIcon } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "DMCA Policy | GameHub Central - Copyright Protection & Takedown Requests",
  description:
    "GameHub Central's DMCA policy and copyright protection guidelines. Learn how to report copyright infringement and our takedown procedures.",
  keywords: "DMCA, copyright, takedown, intellectual property, GameHub Central DMCA",
  openGraph: {
    title: "DMCA Policy | GameHub Central - Copyright Protection & Takedown Requests",
    description:
      "GameHub Central's DMCA policy and copyright protection guidelines. Learn how to report copyright infringement and our takedown procedures.",
    url: "https://speed-stars.net/dmca",
    siteName: "GameHub Central",
    locale: "en_US",
    type: "website",
  },
  canonical: "https://speed-stars.net/dmca",
}

export default function DMCAPage() {
  return (
    <main className="bg-background">
      <Header />

      <section className="py-12 md:py-16 bg-gray-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-6xl opacity-10 pop-in">⚖️</div>
        <div className="absolute bottom-20 right-10 text-6xl opacity-10 pop-in" style={{ animationDelay: "0.3s" }}>
          🛡️
        </div>
        <div className="absolute top-1/2 right-1/4 text-4xl opacity-15 pop-in" style={{ animationDelay: "0.6s" }}>
          📋
        </div>

        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-8 flex justify-center">
            <Link 
              href="/" 
              className="inline-flex items-center text-primary hover:text-primary-hover font-black text-lg group bg-gray-900 rounded-full px-6 py-3 shadow-cartoon border-4 border-primary cartoon-shadow transform hover:scale-110 hover:rotate-2 transition-all jello"
            >
              <ChevronLeftIcon className="w-6 h-6 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 pop-in">
              DMCA <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
              Digital Millennium Copyright Act compliance and takedown procedures
            </p>
            <div className="mt-4 text-sm text-white/60">
              <p>Last updated: December 2024</p>
            </div>
          </div>

          {/* Important Notice */}
          <div className="card cartoon-shadow border-4 border-accent-2 mb-12 pop-in">
            <div className="flex items-start space-x-4">
              <AlertTriangleIcon className="w-8 h-8 text-accent-2 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-black text-accent-2 mb-2">Copyright Respect Notice</h2>
                <p className="text-white/80 leading-relaxed">
                  GameHub Central respects the intellectual property rights of others and expects our users to do the same. 
                  We comply with the Digital Millennium Copyright Act (DMCA) and will respond promptly to valid 
                  takedown notices for copyrighted material.
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* DMCA Overview */}
            <div className="card cartoon-shadow border-4 border-primary transform hover:rotate-[0.5deg] transition-transform pop-in">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">📖</div>
                <h2 className="text-2xl md:text-3xl font-black text-primary">What is the DMCA?</h2>
              </div>
              <div className="text-white/90 space-y-4 leading-relaxed">
                <p>
                  The Digital Millennium Copyright Act (DMCA) is a United States copyright law that provides a framework 
                  for copyright holders to request removal of infringing content from online platforms.
                </p>
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border-2 border-primary/20">
                  <h3 className="font-black text-primary mb-2">🎯 Our Commitment</h3>
                  <p className="text-sm">
                    We are committed to protecting intellectual property rights while providing a platform for 
                    legitimate gaming content. We investigate all valid DMCA claims and take appropriate action 
                    when copyright infringement is identified.
                  </p>
                </div>
              </div>
            </div>

            {/* Filing a DMCA Notice */}
            <div className="card cartoon-shadow border-4 border-secondary transform hover:rotate-[-0.5deg] transition-transform pop-in" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">📧</div>
                <h2 className="text-2xl md:text-3xl font-black text-secondary">How to File a DMCA Takedown Notice</h2>
              </div>
              <div className="text-white/90 space-y-6 leading-relaxed">
                <p>
                  If you believe that content on GameHub Central infringes your copyright, you may submit a DMCA takedown notice. 
                  Your notice must include the following information:
                </p>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg p-4 border-2 border-secondary/20">
                    <h4 className="font-black text-secondary mb-2">1️⃣ Identification of Copyrighted Work</h4>
                    <p className="text-sm">
                      Describe the copyrighted work that you claim has been infringed, including registration numbers if applicable.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-accent/10 to-accent-2/10 rounded-lg p-4 border-2 border-accent/20">
                    <h4 className="font-black text-accent mb-2">2️⃣ Location of Infringing Material</h4>
                    <p className="text-sm">
                      Provide the specific URL(s) or location(s) of the material you claim is infringing.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-accent-2/10 to-accent-3/10 rounded-lg p-4 border-2 border-accent-2/20">
                    <h4 className="font-black text-accent-2 mb-2">3️⃣ Your Contact Information</h4>
                    <p className="text-sm">
                      Include your name, address, phone number, and email address.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-accent-3/10 to-accent-4/10 rounded-lg p-4 border-2 border-accent-3/20">
                    <h4 className="font-black text-accent-3 mb-2">4️⃣ Good Faith Statement</h4>
                    <p className="text-sm">
                      Include a statement that you have a good faith belief that the use is not authorized by the copyright owner.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-accent-4/10 to-primary/10 rounded-lg p-4 border-2 border-accent-4/20">
                    <h4 className="font-black text-accent-4 mb-2">5️⃣ Accuracy Statement & Signature</h4>
                    <p className="text-sm">
                      Include a statement that the information is accurate and that you are authorized to act on behalf of the copyright owner. 
                      Must be signed (electronic signature acceptable).
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl p-6 border-4 border-blue-400">
                  <h3 className="font-black text-blue-800 mb-3">📬 Submit Your Notice</h3>
                  <div className="text-sm text-blue-800 space-y-2">
                    <p><strong>Email:</strong> dmca@speed-stars.net</p>
                    <p><strong>Subject Line:</strong> DMCA Takedown Notice</p>
                    <p><strong>Response Time:</strong> We will respond within 72 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Response Process */}
            <div className="card cartoon-shadow border-4 border-accent transform hover:rotate-[0.5deg] transition-transform pop-in" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">⚡</div>
                <h2 className="text-2xl md:text-3xl font-black text-accent">Our Response Process</h2>
              </div>
              <div className="text-white/90 space-y-4 leading-relaxed">
                <p>
                  Upon receiving a valid DMCA takedown notice, we will:
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-4 border-2 border-accent/20">
                    <div className="text-2xl flex-shrink-0">1️⃣</div>
                    <div>
                      <h4 className="font-black text-accent mb-1">Review the Notice</h4>
                      <p className="text-sm">Verify that the notice contains all required elements and appears to be valid.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg p-4 border-2 border-secondary/20">
                    <div className="text-2xl flex-shrink-0">2️⃣</div>
                    <div>
                      <h4 className="font-black text-secondary mb-1">Remove or Disable Access</h4>
                      <p className="text-sm">If the notice is valid, we will promptly remove or disable access to the allegedly infringing material.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 bg-gradient-to-r from-accent-2/10 to-accent-3/10 rounded-lg p-4 border-2 border-accent-2/20">
                    <div className="text-2xl flex-shrink-0">3️⃣</div>
                    <div>
                      <h4 className="font-black text-accent-2 mb-1">Notify the User</h4>
                      <p className="text-sm">Inform the user who posted the content about the takedown (if contact information is available).</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 bg-gradient-to-r from-accent-3/10 to-accent-4/10 rounded-lg p-4 border-2 border-accent-3/20">
                    <div className="text-2xl flex-shrink-0">4️⃣</div>
                    <div>
                      <h4 className="font-black text-accent-3 mb-1">Document the Action</h4>
                      <p className="text-sm">Keep records of the takedown notice and our response for legal compliance.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Counter-Notice Process */}
            <div className="card cartoon-shadow border-4 border-accent-3 transform hover:rotate-[-0.5deg] transition-transform pop-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">🔄</div>
                <h2 className="text-2xl md:text-3xl font-black text-accent-3">DMCA Counter-Notice</h2>
              </div>
              <div className="text-white/90 space-y-4 leading-relaxed">
                <p>
                  If you believe your content was wrongly removed due to a DMCA takedown notice, you may file a counter-notice. 
                  Your counter-notice must include:
                </p>
                
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-accent-3/10 to-primary/10 rounded-lg p-4 border-2 border-accent-3/20">
                    <h4 className="font-black text-accent-3 mb-2">📝 Required Information</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Your name, address, phone number, and email</li>
                      <li>Identification of the removed material and its location</li>
                      <li>A statement under penalty of perjury that you have a good faith belief the material was removed by mistake</li>
                      <li>Consent to jurisdiction of federal court in your district</li>
                      <li>Your physical or electronic signature</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-xl p-6 border-4 border-yellow-400">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">⚠️</div>
                    <div>
                      <h3 className="font-black text-yellow-800 mb-2">Legal Warning</h3>
                      <p className="text-sm text-yellow-800">
                        Filing a false DMCA counter-notice may result in legal liability. Only file a counter-notice if you have 
                        a good faith belief that the material was removed by mistake or misidentification.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Repeat Infringers */}
            <div className="card cartoon-shadow border-4 border-accent-4 transform hover:rotate-[0.5deg] transition-transform pop-in" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">🚫</div>
                <h2 className="text-2xl md:text-3xl font-black text-accent-4">Repeat Infringer Policy</h2>
              </div>
              <div className="text-white/90 space-y-4 leading-relaxed">
                <p>
                  GameHub Central has a policy of terminating access for users who are repeat copyright infringers. 
                  We maintain records of DMCA notices and may take the following actions:
                </p>
                
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4 border-2 border-yellow-400">
                    <h4 className="font-black text-orange-700 mb-2">🟡 First Offense</h4>
                    <p className="text-sm text-orange-700">Warning and removal of infringing content</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-4 border-2 border-orange-400">
                    <h4 className="font-black text-red-700 mb-2">🟠 Multiple Offenses</h4>
                    <p className="text-sm text-red-700">Temporary suspension and content review</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-100 to-red-200 rounded-lg p-4 border-2 border-red-500">
                    <h4 className="font-black text-red-800 mb-2">🔴 Repeat Infringer</h4>
                    <p className="text-sm text-red-800">Permanent termination of access to our services</p>
                  </div>
                </div>
              </div>
            </div>

            {/* False Claims */}
            <div className="card cartoon-shadow border-4 border-primary transform hover:rotate-[-0.5deg] transition-transform pop-in" style={{ animationDelay: "0.5s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">⚖️</div>
                <h2 className="text-2xl md:text-3xl font-black text-primary">False Claims and Penalties</h2>
              </div>
              <div className="text-white/90 space-y-4 leading-relaxed">
                <div className="bg-gradient-to-r from-red-100 to-red-50 rounded-xl p-6 border-4 border-red-400">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">🚨</div>
                    <div>
                      <h3 className="font-black text-red-800 mb-2">Section 512(f) Warning</h3>
                      <p className="text-sm text-red-800 leading-relaxed">
                        Under Section 512(f) of the DMCA, any person who knowingly materially misrepresents that material 
                        is infringing may be subject to liability for damages, including court costs and attorney's fees.
                      </p>
                    </div>
                  </div>
                </div>
                
                <p>
                  Before filing a DMCA notice, please ensure that:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>You own the copyright or are authorized to act on behalf of the copyright owner</li>
                  <li>The use of the material is not authorized by law (such as fair use)</li>
                  <li>The material is actually infringing your copyrighted work</li>
                  <li>All information in your notice is accurate</li>
                </ul>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card cartoon-shadow border-4 border-secondary transform hover:rotate-[0.5deg] transition-transform pop-in" style={{ animationDelay: "0.6s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">📮</div>
                <h2 className="text-2xl md:text-3xl font-black text-secondary">Designated DMCA Agent</h2>
              </div>
              <div className="text-white/90 space-y-4 leading-relaxed">
                <p>
                  Our designated agent for receiving DMCA notices is:
                </p>
                
                <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl p-6 border-2 border-secondary/20">
                  <h3 className="font-black text-secondary mb-4">📧 DMCA Agent Contact</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Email:</strong> dmca@speed-stars.net</p>
                    <p><strong>Address:</strong> GameHub Central DMCA Agent<br />
                       36 Central Avenue<br />
                       California, USA</p>
                    <p><strong>Phone:</strong> +1 (607) 023-1235</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl p-4 border-2 border-blue-400">
                  <h4 className="font-black text-blue-800 mb-2">⏰ Processing Times</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>• <strong>Initial Response:</strong> Within 24 hours</p>
                    <p>• <strong>Content Review:</strong> Within 72 hours</p>
                    <p>• <strong>Action Taken:</strong> Within 5 business days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Resources */}
            <div className="card cartoon-shadow border-4 border-accent transform hover:rotate-[-0.5deg] transition-transform pop-in" style={{ animationDelay: "0.7s" }}>
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">📚</div>
                <h2 className="text-2xl md:text-3xl font-black text-accent">Additional Resources</h2>
              </div>
              <div className="text-white/90 space-y-4 leading-relaxed">
                <p>
                  For more information about copyright law and the DMCA:
                </p>
                
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-4 border-2 border-accent/20">
                    <h4 className="font-black text-accent mb-2">🏛️ Official Resources</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>US Copyright Office: <span className="text-accent">copyright.gov</span></li>
                      <li>DMCA.com Educational Resources</li>
                      <li>Electronic Frontier Foundation (EFF)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg p-4 border-2 border-secondary/20">
                    <h4 className="font-black text-secondary mb-2">⚖️ Legal Consultation</h4>
                    <p className="text-sm">
                      For complex copyright issues, we recommend consulting with a qualified intellectual property attorney.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="mt-16 text-center">
            <div className="card cartoon-shadow border-4 border-primary max-w-2xl mx-auto transform hover:scale-105 transition-transform pop-in">
              <div className="text-center">
                <div className="text-5xl mb-4">📄</div>
                <h3 className="text-2xl font-black text-white mb-4">Legal Documents</h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/terms"
                    className="btn-secondary text-lg jello"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="/privacy"
                    className="btn-secondary text-lg jello"
                    style={{ animationDelay: "0.1s" }}
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/contact"
                    className="btn-secondary text-lg jello"
                    style={{ animationDelay: "0.2s" }}
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}