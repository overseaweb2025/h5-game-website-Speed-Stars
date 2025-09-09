import Link from "next/link"
import { ExternalLink, CheckCircle, AlertTriangle, Zap, Cpu, Wrench } from "lucide-react"
import { getCanonicalDomain } from "@/lib/seo-utils"

interface HelpCenterProps {
  t?: any;
}

export default function HelpCenter({ t }: HelpCenterProps = {}) {
const domain = getCanonicalDomain()

  return (
    <section id="help-center" className="py-8 md:py-12 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 right-10 text-6xl opacity-10 pop-in">🎮</div>
        <div className="absolute bottom-20 left-20 text-6xl opacity-10 pop-in" style={{ animationDelay: "0.3s" }}>
          🔧
        </div>
        <div className="absolute top-1/3 right-1/4 text-6xl opacity-10 pop-in" style={{ animationDelay: "0.6s" }}>
          💻
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-black mb-4 pop-in">
            {t?.helpCenter?.whyCantPlayH5Games || "Why Can't I Play H5 Games?"}
          </h2>
          <p className="text-xl text-text/80 max-w-3xl mx-auto">
            {t?.helpCenter?.topReasonsAndSolutions || "Top Reasons & Speed Stars Unblock Solutions"}
          </p>
        </div>

        <div className="mb-8 card p-6 shadow-cartoon-lg">
          <p className="text-lg mb-4">
            Discover why your <span className="font-bold text-primary">online H5 games</span> won't load and how to{" "}
            <span className="font-bold text-accent-3">unblock</span> them for{" "}
            <span className="font-bold text-secondary">free</span> using{" "}
            <span className="font-bold text-primary">Speed Stars</span>' official tools at{" "}
            <Link
              href={domain}
              className="text-accent-3 font-bold hover:underline flex items-center inline-flex"
              target="_blank"
              rel="noopener noreferrer"
            >
              {domain}
              <ExternalLink className="h-4 w-4 ml-1" />
            </Link>
            .
          </p>
        </div>

        <div className="space-y-8">
          {/* Issue 1 */}
          <div className="card border-l-8 border-l-primary">
            <div className="flex items-center mb-4">
              <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-black text-xl mr-3">
                1
              </div>
              <h3 className="text-2xl font-black">
                {t?.helpCenter?.browserCompatibility || "Browser Compatibility Issues | Unblock H5 Games"}
              </h3>
            </div>

            <div className="mb-4">
              <h4 className="text-xl font-bold mb-2 text-accent-3">{t?.helpCenter?.causes || "Causes:"}:</h4>
              <ul className="space-y-2 pl-6 mb-4">
                <li className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-accent-2 mr-2 flex-shrink-0 mt-1" />
                  <span>
                    Outdated browsers (e.g., IE9) blocking <span className="font-bold">online games</span>
                  </span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-accent-2 mr-2 flex-shrink-0 mt-1" />
                  <span>Disabled HTML5/WebGL support</span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-accent-2 mr-2 flex-shrink-0 mt-1" />
                  <span>Overly strict security policies</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-2 text-secondary">{t?.helpCenter?.speedStarsOfficialFixes || "Speed Stars Official Fixes:"}:</h4>
              <ul className="space-y-3 pl-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-1" />
                  <span>
                    Use <span className="font-bold">Speed Stars-approved browsers</span>: Chrome 90+, Firefox 89+, Edge
                    90+
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-1" />
                  <span>
                    Enable <span className="font-bold">hardware acceleration</span> &{" "}
                    <span className="font-bold">WebGL</span> (Chrome: chrome://settings/system)
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-1" />
                  <span>
                    Disable tracking for <span className="font-bold">smoother online gaming</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Issue 2 */}
          <div className="card border-l-8 border-l-accent-3">
            <div className="flex items-center mb-4">
              <div className="bg-accent-3 text-white rounded-full w-10 h-10 flex items-center justify-center font-black text-xl mr-3">
                2
              </div>
              <h3 className="text-2xl font-black">
                {t?.helpCenter?.networkErrors || "Network Errors (Most Common) | Free Unblock Tools"}
              </h3>
            </div>

            <div className="mb-4">
              <h4 className="text-xl font-bold mb-2 text-accent-3">{t?.helpCenter?.causes || "Causes:"}:</h4>
              <ul className="space-y-2 pl-6 mb-4">
                <li className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-accent-2 mr-2 flex-shrink-0 mt-1" />
                  <span>
                    CORS failures blocking <span className="font-bold">game resources</span>
                  </span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-accent-2 mr-2 flex-shrink-0 mt-1" />
                  <span>CDN errors (504/404) or firewall restrictions</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-2 text-secondary">{t?.helpCenter?.speedStarsSolutions || "Speed Stars Solutions:"}:</h4>
              <ul className="space-y-3 pl-6">
                <li className="flex items-start">
                  <Zap className="h-5 w-5 text-accent mr-2 flex-shrink-0 mt-1" />
                  <span>
                    Press <span className="font-bold">F12</span> {">"} Check{" "}
                    <span className="font-bold">Network tab</span> for blocked assets
                  </span>
                </li>
                <li className="flex items-start">
                  <Zap className="h-5 w-5 text-accent mr-2 flex-shrink-0 mt-1" />
                  <span>
                    Bypass Wi-Fi limits with 4G/5G (<span className="font-bold">mobile-friendly games</span>)
                  </span>
                </li>
                <li className="flex items-start">
                  <Zap className="h-5 w-5 text-accent mr-2 flex-shrink-0 mt-1" />
                  <span>
                    Try <span className="font-bold">Speed Stars Proxy</span> – free online unblock service
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Issue 3 */}
          <div className="card border-l-8 border-l-secondary">
            <div className="flex items-center mb-4">
              <div className="bg-secondary text-text rounded-full w-10 h-10 flex items-center justify-center font-black text-xl mr-3">
                3
              </div>
              <h3 className="text-2xl font-black">
                {t?.helpCenter?.missingRuntimeFeatures || "Missing Runtime Features | Optimize Game Speed"}
              </h3>
            </div>

            <div className="mb-4">
              <h4 className="text-xl font-bold mb-2 text-accent-3">{t?.helpCenter?.causes || "Causes:"}:</h4>
              <ul className="space-y-2 pl-6 mb-4">
                <li className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-accent-2 mr-2 flex-shrink-0 mt-1" />
                  <span>
                    Missing Web Audio API for <span className="font-bold">immersive games</span>
                  </span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-accent-2 mr-2 flex-shrink-0 mt-1" />
                  <span>Memory crashes (300MB+ H5 games)</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-2 text-secondary">{t?.helpCenter?.speedStarsFixes || "Speed Stars Fixes:"}:</h4>
              <ul className="space-y-3 pl-6">
                <li className="flex items-start">
                  <Cpu className="h-5 w-5 text-accent-4 mr-2 flex-shrink-0 mt-1" />
                  <span>
                    Test compatibility:{" "}
                    <Link
                      href="https://html5test.com"
                      className="text-accent-3 font-bold hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      html5test.com
                    </Link>{" "}
                    (500+ score)
                  </span>
                </li>
                <li className="flex items-start">
                  <Cpu className="h-5 w-5 text-accent-4 mr-2 flex-shrink-0 mt-1" />
                  <span>Boost speed: Chrome restart via chrome://restart</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Issue 4 */}
          <div className="card border-l-8 border-l-accent">
            <div className="flex items-center mb-4">
              <div className="bg-accent text-text rounded-full w-10 h-10 flex items-center justify-center font-black text-xl mr-3">
                4
              </div>
              <h3 className="text-2xl font-black">
                {t?.helpCenter?.codeLevelFailures || "Code-Level Failures | Official Game Support"}
              </h3>
            </div>

            <div className="mb-4">
              <h4 className="text-xl font-bold mb-2 text-accent-3">{t?.helpCenter?.causes || "Causes:"}:</h4>
              <ul className="space-y-2 pl-6 mb-4">
                <li className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-accent-2 mr-2 flex-shrink-0 mt-1" />
                  <span>JavaScript leaks ({">"} 1.5GB crashes)</span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-accent-2 mr-2 flex-shrink-0 mt-1" />
                  <span>Canvas limits on Retina displays</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-2 text-secondary">{t?.helpCenter?.speedStarsProTips || "Speed Stars Pro Tips:"}:</h4>
              <ul className="space-y-3 pl-6">
                <li className="flex items-start">
                  <Cpu className="h-5 w-5 text-accent-4 mr-2 flex-shrink-0 mt-1" />
                  <span>Check memory: performance.memory.jsHeapSizeLimit</span>
                </li>
                <li className="flex items-start">
                  <Cpu className="h-5 w-5 text-accent-4 mr-2 flex-shrink-0 mt-1" />
                  <span>
                    Add --disable-canvas-aa to <span className="font-bold">unblock rendering</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Issue 5 */}
          <div className="card border-l-8 border-l-accent-4">
            <div className="flex items-center mb-4">
              <div className="bg-accent-4 text-white rounded-full w-10 h-10 flex items-center justify-center font-black text-xl mr-3">
                5
              </div>
              <h3 className="text-2xl font-black">
                {t?.helpCenter?.hardwareLimits || "Hardware Limits | Speed Stars Certified"}
              </h3>
            </div>

            <div className="mb-4">
              <h4 className="text-xl font-bold mb-2 text-accent-3">{t?.helpCenter?.causes || "Causes:"}:</h4>
              <ul className="space-y-2 pl-6 mb-4">
                <li className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-accent-2 mr-2 flex-shrink-0 mt-1" />
                  <span>
                    Old GPUs lacking WebGL 2.0 (<span className="font-bold">game requirements</span>)
                  </span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-accent-2 mr-2 flex-shrink-0 mt-1" />
                  <span>
                    No gyroscope for motion-based <span className="font-bold">mobile games</span>
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-2 text-secondary">{t?.helpCenter?.speedStarsSolutions || "Speed Stars Solutions:"}:</h4>
              <ul className="space-y-3 pl-6">
                <li className="flex items-start">
                  <Wrench className="h-5 w-5 text-accent-2 mr-2 flex-shrink-0 mt-1" />
                  <span>
                    Verify WebGL:{" "}
                    <Link
                      href="https://get.webgl.org"
                      className="text-accent-3 font-bold hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      get.webgl.org
                    </Link>
                  </span>
                </li>
                <li className="flex items-start">
                  <Wrench className="h-5 w-5 text-accent-2 mr-2 flex-shrink-0 mt-1" />
                  <span>Force CPU mode: Chrome --disable-gpu</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Free H5 Game Unblock Guide */}
        <div className="mt-10 card bg-gradient-to-r from-primary/10 to-accent-3/10 border-4 border-accent">
          <h3 className="text-2xl font-black mb-4 text-center">
            <span className="gradient-text">{t?.helpCenter?.freeH5GameUnblockGuide || "Free H5 Game Unblock Guide"}</span>
          </h3>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <div className="bg-accent rounded-full w-6 h-6 flex items-center justify-center font-bold text-white mr-2 mt-1">
                1
              </div>
              <span>
                Start in <span className="font-bold">incognito mode</span> (blocks plugin conflicts)
              </span>
            </li>
            <li className="flex items-start">
              <div className="bg-accent rounded-full w-6 h-6 flex items-center justify-center font-bold text-white mr-2 mt-1">
                2
              </div>
              <span>Verify CORS: curl -I [URL] {"|"} grep -i access-control-allow-origin</span>
            </li>
            <li className="flex items-start">
              <div className="bg-accent rounded-full w-6 h-6 flex items-center justify-center font-bold text-white mr-2 mt-1">
                3
              </div>
              <span>Check GPU status: chrome://gpu</span>
            </li>
            <li className="flex items-start">
              <div className="bg-accent rounded-full w-6 h-6 flex items-center justify-center font-bold text-white mr-2 mt-1">
                4
              </div>
              <span>Clear cache at about:serviceworkers</span>
            </li>
          </ul>

          <div className="bg-white p-4 rounded-xl border-2 border-accent-3">
            <h4 className="text-xl font-bold mb-2 text-center text-accent-3">{t?.helpCenter?.officialSpeedStarsSupport || "Official Speed Stars Support:"}:</h4>
            <p className="text-center">
              Submit diagnostics via JSON.stringify(window.performance.timing) to Speed Stars Team.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
