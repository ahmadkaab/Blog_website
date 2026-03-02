import { TrendingUp, Cpu, Gauge } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 border border-neonBlue/30 bg-neonBlue/5 px-4 py-1 rounded-full mb-6">
              <TrendingUp className="w-4 h-4 text-neonBlue" />
              <span className="text-xs font-bold uppercase tracking-widest text-neonBlue">
                AI + Full-Stack Engineering
              </span>
            </div>
            <h1 className="text-6xl sm:text-7xl font-outfit font-extrabold leading-[1.1] mb-6">
              FORGE THE <br />
              <span className="text-gradient">FUTURE</span> <br />
              STACK.
            </h1>
            <p className="text-lg text-gray-400 mb-10 max-w-lg leading-relaxed">
              Battle-tested patterns for founders shipping AI-powered apps with
              Next.js. Production-grade code, not toy examples.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/blog"
                className="bg-neonBlue text-charcoal px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-cyberLime transition-all group"
              >
                <Gauge className="w-5 h-5" />
                Latest Deep-Dives
              </Link>
              <Link
                href="#newsletter"
                className="border border-white/10 hover:bg-white/5 px-8 py-4 rounded-xl font-bold transition-all"
              >
                Get the Free AI Kit
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-neonBlue/20 blur-3xl opacity-20 -z-10 animate-pulse"></div>
            <div className="border border-white/10 bg-surface/50 rounded-3xl overflow-hidden shadow-2xl glass">
              <div className="aspect-square bg-gradient-to-br from-charcoal to-surface flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                <Cpu className="w-48 h-48 text-neonBlue/20 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-8 left-8 right-8 border border-white/10 bg-black/40 backdrop-blur-md p-6 rounded-2xl">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-neonBlue font-bold uppercase tracking-tighter mb-1">
                        Automated Pipeline
                      </p>
                      <h3 className="text-xl font-bold font-outfit uppercase italic">
                        AI → CMS → Deploy
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-cyberLime">
                        60+ Posts
                      </p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                        Month 1 Target
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-white/5 pt-10">
          <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-gray-600 mb-8">
            Powered By
          </p>
          <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default">
            <span className="text-xl font-black italic">Next.js</span>
            <span className="text-xl font-black italic">Gemini</span>
            <span className="text-xl font-black italic">Sanity</span>
            <span className="text-xl font-black italic">Vercel</span>
          </div>
        </div>
      </div>
    </section>
  );
}
