import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-4">
          <div>
            <h3 className="text-xl font-semibold text-white">✈ TravelEase</h3>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
              Elegant travel booking designed to help modern explorers plan
              premium journeys with confidence.
            </p>
            <div className="mt-6 flex items-center gap-3 text-slate-400">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900">
                F
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900">
                T
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900">
                I
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              Company
            </h4>
            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <Link to="/about-us" className="transition hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="transition hover:text-white">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              Support
            </h4>
            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <Link to="/help-center" className="transition hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="transition hover:text-white"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

         
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex sm:items-center sm:justify-between">
          <p>© 2026 TravelEase. All rights reserved.</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 sm:mt-0">
            <Link to="/privacy-policy" className="transition hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/cookies-policy" className="transition hover:text-white">
              Cookies Policy
            </Link>
            <Link
              to="/legal-disclaimer"
              className="transition hover:text-white"
            >
              Legal Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
