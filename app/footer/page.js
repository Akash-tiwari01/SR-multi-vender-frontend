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
import PopularSearches from "../popularSearches/page";
import Link from "next/link";
import FeaturesSection from "../FeaturesSection/page";

export default function Footer() {
  return (
    <div>
      <FeaturesSection/>
      <footer className="footer">
        <div className="footer-container">
          {/* Get in Touch */}
          <div className="footer-column" style={{gap:30}}>
            <h4>Get in touch</h4>
            <p>
              B-9, 3rd Floor, Above B.K. Sweets, Dwarka More, New Delhi - 110059
            </p>
            <p>
              <a href="mailto:care@ecraftindia.com">
                srccindiapl@gmail.com
              </a>
              <br />
              <a href="tel:+919266749755">+91-9266749755</a>
            </p>
            <div className="social-icons">
              <a href="#">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="#">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="#">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
              <a href="#">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </div>
          </div>

          {/* Top Categories */}
          <div className="footer-column">
            <h4>Top Categories</h4>
            <ul>
              <li>
                <a href="#">Product1</a>
              </li>
              <li>
                <a href="#">Product2</a>
              </li>
              <li>
                <a href="#">Product3</a>
              </li>
              <li>
                <a href="#">Product4</a>
              </li>
            </ul>
          </div>

          {/* About Store */}
          <div className="footer-column">
            <h4>About Store</h4>
            <ul>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">Bulk Order</a>
              </li>
              <li>
                <a href="#">Reviews</a>
              </li>
            </ul>
          </div>

          {/* Useful Links */}
          <div className="footer-column">
            <h4>Useful Links</h4>
            <ul>
              <li>
                <a href="#">Quotes and Wishes</a>
              </li>
              <li>
                <a href="#">Aartis</a>
              </li>
              <li>
                <a href="#">Blogs</a>
              </li>
            </ul>
          </div>

          {/* Help & Policies */}
          <div className="footer-column">
            <h4>Help & Policies</h4>
            <ul>
              <li>
                {/* <a href=".footer/ContactUS">Contact Us</a> */}
                <Link href='/ContactUS'>Contact US</Link>
              </li>
              <li>
                {/* <a href="#">Privacy Policy</a> */}
                <Link href="FaqSection">FAQ</Link>
              </li>
              <li>
                <a href="#">Payment Security</a>
              </li>
              <li>
                <a href="#">Return Policy</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>

      <PopularSearches/>
{/* ----------------------------------down Side ---------------- */}
      <footer className="bg-[#faa851] text-white py-1">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          {/* Copyright Text */}
          <p className="text-center md:text-left text-sm mb-2 md:mb-0">
            Copyright © 2025 <span className="font-semibold">SR CRAFT CREATIONS</span>{" "}
            all rights reserved.
            <br className="md:hidden" />
            “SR Craft Creations” is a registered brand name of{" "}
            <span className="font-semibold">Intellozene</span>
          </p>

          {/* Payment Icons */}
          <div className="flex items-center gap-3">
            <Image
              src="/1.png"
              alt="Visa"
              width={40}
              height={25}
            />
            <Image
              src="/2.png"
              alt="MasterCard"
              width={40}
              height={25}
            />
            <Image
              src="/3.png"
              alt="Paytm"
              width={40}
              height={25}
            />
            <Image
              src="/masterCard.webp"
              alt="Amex"
              width={40}
              height={25}
            />
            <Image
              src="/paypal.png"
              alt="PayPal"
              width={40}
              height={25}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
