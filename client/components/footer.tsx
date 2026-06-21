'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* About */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Image
                src="/tastepilot-logo.png"
                alt="Taste Pilot"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full"
              />
              <h3 className="text-lg font-bold text-white">
                <span className="text-blue-600">Taste</span>
                <span className="text-orange-500">Pilot</span>
              </h3>
            </div>
            <p className="text-sm leading-relaxed">
              Explore, taste, and enjoy delicious food from your favorite restaurants delivered to your doorstep.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 font-bold text-white">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-orange-500 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 font-bold text-white">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-orange-500 transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-4 font-bold text-white">Follow Us</h4>
            <div className="flex gap-4">
              <Link
                href="#"
                className="rounded-full bg-gray-800 p-2 hover:bg-orange-500 transition text-white"
              >
                f
              </Link>
              <Link
                href="#"
                className="rounded-full bg-gray-800 p-2 hover:bg-orange-500 transition text-white"
              >
                𝕏
              </Link>
              <Link
                href="#"
                className="rounded-full bg-gray-800 p-2 hover:bg-orange-500 transition text-white"
              >
                📷
              </Link>
              <Link
                href="#"
                className="rounded-full bg-gray-800 p-2 hover:bg-orange-500 transition text-white"
              >
                in
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-400">
              © 2026 Taste Pilot. All rights reserved.
            </p>
            <p className="text-sm text-gray-400">
              Made with <span className="text-orange-500">❤️</span> for food lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;