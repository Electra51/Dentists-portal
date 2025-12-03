import React from "react";
import { Link } from "react-router-dom";
import FooterTag from "../../Components/FooterTag";

export default function ErrorPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <section className="max-w-4xl w-full bg-white shadow-lg rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="p-8 flex items-center justify-center bg-gradient-to-r from-secondary to-info hover:opacity-90 shadow-md text-white">
          <div className="max-w-xs text-center">
            <svg
              width="160"
              height="160"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto mb-6"
              aria-hidden="true">
              <rect
                x="2"
                y="2"
                width="60"
                height="60"
                rx="12"
                fill="rgba(255,255,255,0.06)"
              />
              <path
                d="M20 44c3-6 9-10 16-10s13 4 16 10"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M24 26c0-4 3-8 8-8s8 4 8 8"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="26" cy="26" r="1.75" fill="white" />
              <circle cx="38" cy="26" r="1.75" fill="white" />
            </svg>

            <h2 className="text-2xl font-semibold">Oops — Page not found</h2>
            <p className="mt-2 text-sm opacity-90">
              We can't find the page you're looking for. It may have been moved
              or removed.
            </p>
          </div>
        </div>

        <div className="p-10 flex flex-col justify-center gap-6">
          <div>
            <p className="text-2xl text-cyan-600 font-medium">404 error</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              This page doesn't exist
            </h1>
            <p className="mt-3 text-gray-600">
              If you think this is a mistake, contact the team or try one of the
              options below.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg shadow bg-gradient-to-r from-secondary to-info text-white hover:opacity-90 font-medium">
              Go back home
            </Link>

            <a
              href="mailto:hello@company.com"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium shadow-sm">
              Contact support
            </a>
          </div>

          <div className="mt-2 text-sm text-gray-500">
            <p>
              Quick links:{" "}
              <Link to="/about" className="text-indigo-600 underline">
                About
              </Link>{" "}
              ·{" "}
              <Link to="/careers" className="text-indigo-600 underline">
                Careers
              </Link>{" "}
              ·{" "}
              <Link to="/blog" className="text-indigo-600 underline">
                Blog
              </Link>
            </p>
          </div>

          <div className="mt-4 text-xs text-gray-400">
            <p>
              Tip for recruiters: this page highlights attention to detail,
              accessibility, and friendly UX — small touches like clear copy and
              accessible focus states stand out during reviews.
            </p>
          </div>
        </div>
      </section>

      <FooterTag />
    </main>
  );
}
