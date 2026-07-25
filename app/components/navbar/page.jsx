"use client";
import { useState } from "react";
import { FiHome, FiShield, FiFileText, FiMenu, FiX } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import logo from "./logo.png";
import TopBar from "./TopBar";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/", icon: <FiHome /> },
    { name: "Privacy", href: "/privacy", icon: <FiShield /> },
    { name: "Condition", href: "/condition", icon: <FiFileText /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 font-poppins bg-black bg-opacity-80 backdrop-blur-sm border-b border-white/10">
      {/* Top bar with contact info - visible on medium screens and up */}
      <div className="hidden md:block">
        <TopBar />
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src={logo}
              alt="ChitroJal Logo"
              height={40} // Set height
              style={{ width: "auto" }} // Use style to maintain aspect ratio
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 text-white hover:text-orange-400 transition-colors text-md"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Book Now Button - Desktop */}
          <div className="hidden md:block">
            <Link
              href="/booking"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black bg-opacity-95">
          <nav className="container mx-auto px-4 pt-4 pb-8 flex flex-col items-center gap-6">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-white text-xl font-semibold"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="border-t border-white/20 w-full my-4" />
            <Link
              href="/booking"
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-full transition-colors text-lg"
            >
              Book Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
