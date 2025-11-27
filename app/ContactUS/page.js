import React from "react";
import Footer from "../footer/page";
import Header from "../Header/page";

const ContactUsPage = () => {
  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <h1 className="text-3xl font-bold text-red-600 text-center mb-10">
          Contact Us
        </h1>

        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2">
            <h2 className="text-xl font-bold mb-6 uppercase tracking-wider">
              Contact ME
            </h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="text-gray-700 block mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="text-gray-700 block mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="text-gray-700 block mb-1">
                  Your Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="text-gray-700 block mb-1">
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows="3"
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 border border-gray-500 bg-white text-gray-800 text-lg font-medium hover:bg-gray-100 transition duration-150"
              >
                Send
              </button>
            </form>
          </div>

          <div className="w-full md:w-1/2 mt-10 md:mt-13">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">
              SR Craft Ctreations Contact Details -
            </h3>

            <div className="space-y-4">
              <p>
                <span className="font-semibold">
                  For Order Related Queries - Call Us (India):{" "}
                </span>
                <span className="text-gray-600">+91-9266749755</span>
              </p>

              <p>
                <span className="font-semibold">
                  For Bulk Orders or Associations call us @{" "}
                </span>
                <span className="text-gray-600">9266749755</span>
              </p>

              <p>
                <span className="font-semibold">Email: </span>
                <span className="text-gray-600">srccindiapl@gmail.com</span>
              </p>

              <p>
                <span className="font-semibold">Office Address - </span>
                <span className="text-gray-600">
                  {" "}
                  B-9, 3rd Floor, Above B.K. Sweets, Dwarka More, New Delhi -
                  110059
                </span>
              </p>

              <p>
                <span className="font-semibold">Registered Address - </span>
                <span className="text-gray-600">
                  B-9, 3rd Floor, Above B.K. Sweets, Dwarka More, New Delhi -
                  110059
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ContactUsPage;
