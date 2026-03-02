import Link from "next/link";
import { Zap } from "lucide-react";

export default function NavBar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-cyberLime fill-cyberLime" />
            <span className="text-2xl font-outfit font-extrabold tracking-tighter uppercase italic">
              Frame<span className="text-neonBlue">Foundry</span>
            </span>
          </Link>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                href="/blog"
                className="hover:text-cyberLime transition-colors font-medium"
              >
                AI Engineering
              </Link>
              <Link
                href="/blog"
                className="hover:text-cyberLime transition-colors font-medium"
              >
                Next.js
              </Link>
              <Link
                href="/blog"
                className="hover:text-cyberLime transition-colors font-medium"
              >
                Tools & Reviews
              </Link>
            </div>
          </div>
          <div>
            <Link
              href="#newsletter"
              className="bg-neonBlue text-charcoal px-6 py-2 rounded-full font-bold hover:bg-cyberLime transition-all duration-300 transform hover:scale-105"
            >
              Free AI Kit
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
