"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import PopularSearches from "./PopularSearches";
import Link from "next/link";
import FeaturesSection from "./FeatureSection";

export default function Footer() {
  return (
    <div>
      {/* Renders FeaturesSection component */}

      {/* Main Footer Section - Slate Background, White/Rose Text */}
      <footer className="bg-slate-950 text-white pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-y-10">
          {/* Get in Touch */}
          <div className="space-y-4 col-span-2 md:col-span-1">
            <h4 className="text-xl font-bold text-rose-700 border-b border-rose-400 pb-2 mb-4">
              Get in touch
            </h4>
            <p className="text-slate-300 text-sm">
              B-9, 3rd Floor, Above B.K. Sweets, Dwarka More, New Delhi - 110059
            </p>
            <p className="text-sm">
              <a
                href="mailto:srccindiapl@gmail.com"
                className="text-slate-300 hover:text-rose-400 transition duration-300"
              >
                srccindiapl@gmail.com
              </a>
              <br />
              <a
                href="tel:+919266749755"
                className="text-slate-300 hover:text-rose-400 transition duration-300"
              >
                +91-9266749755
              </a>
            </p>
            <div className="flex space-x-4 pt-2">
              {[faFacebookF, faTwitter, faInstagram, faLinkedinIn, faYoutube].map(
                (icon, index) => (
                  <a
                    key={index}
                    href="#"
                    aria-label={`Follow us on ${icon.iconName}`}
                    className="text-slate-300 hover:text-rose-400 transition duration-300 text-lg"
                  >
                    <FontAwesomeIcon icon={icon} />
                  </a>
                )
              )}
            </div>
          </div>

          {/* Top Categories */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-rose-700 border-b border-rose-400 pb-2 mb-4">
              Top Categories
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-slate-300 hover:text-rose-400 transition duration-300">
                  Product1
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-rose-400 transition duration-300">
                  Product2
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-rose-400 transition duration-300">
                  Product3
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-rose-400 transition duration-300">
                  Product4
                </a>
              </li>
            </ul>
          </div>

          {/* About Store */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-rose-700 border-b border-rose-400 pb-2 mb-4">
              About Store
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-slate-300 hover:text-rose-400 transition duration-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-rose-400 transition duration-300">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-rose-400 transition duration-300">
                  Bulk Order
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-rose-400 transition duration-300">
                  Reviews
                </a>
              </li>
            </ul>
          </div>

          {/* Useful Links */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-rose-700 border-b border-rose-400 pb-2 mb-4">
              Useful Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-slate-300 hover:text-rose-400 transition duration-300">
                  Quotes and Wishes
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-rose-400 transition duration-300">
                  Aartis
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-rose-400 transition duration-300">
                  Blogs
                </a>
              </li>
            </ul>
          </div>

          {/* Help & Policies */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-rose-700 border-b border-rose-400 pb-2 mb-4">
              Help & Policies
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/ContactUS"
                  className="text-slate-300 hover:text-rose-400 transition duration-300"
                >
                  Contact US
                </Link>
              </li>
              <li>
                <Link
                  href="/FaqSection"
                  className="text-slate-300 hover:text-rose-400 transition duration-300"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-rose-400 transition duration-300">
                  Payment Security
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-rose-400 transition duration-300">
                  Return Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Renders PopularSearches component */}
      <PopularSearches />
      
      {/* Bottom Bar - Rose Background, White Text */}
      <footer className="bg-rose-950 text-white py-4 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          {/* Copyright Text */}
          <p className="text-center md:text-left text-sm mb-3 md:mb-0">
            Copyright © 2025{" "}
            <span className="font-semibold">SR CRAFT CREATIONS</span> all rights
            reserved.
            <br className="md:hidden" />
            “SR Craft Creations” is a registered brand name of{" "}
            <span className="font-semibold">Intellozene</span>
          </p>
        </div>
      </footer>
    </div>
  );
}