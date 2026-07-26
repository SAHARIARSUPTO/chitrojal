"use client";
import { useState, useEffect } from "react";
import { FiHome, FiCamera, FiPackage, FiGrid, FiMenu, FiX } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "./logo.png";
import TopBar from "./TopBar";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/", icon: <FiHome /> },
    { name: "Portfolio", href: "/#portfolio", icon: <FiCamera /> },
    { name: "Packages", href: "/#packages", icon: <FiPackage /> },
    { name: "Admin", href: "/admin", icon: <FiGrid /> },
  ];

  useEffect(() => {
    // Close menu on route change
    setIsMenuOpen(false);
  }, [pathname]);

  const menuVariants = {
    hidden: {
      opacity: 0,
      y: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 font-poppins bg-black/70 backdrop-blur-lg border-b border-white/5">
      {/* Top bar with contact info */}
      <div className="hidden md:block">
        <TopBar />
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">
            <Image
              src={logo}
              alt="ChitroJal Logo"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center gap-2 text-sm font-medium transition-colors ${
                    isActive ? "text-orange-400" : "text-white hover:text-orange-400"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div
                      className="absolute bottom-[-8px] left-0 right-0 h-0.5 bg-orange-400"
                      layoutId="underline"
                      initial={false}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Book Now Button - Desktop */}
          <div className="hidden md:block">
            <Link
              href="/booking"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-2 font-medium text-white transition-all duration-300 bg-orange-600 hover:bg-orange-700 shadow-md hover:shadow-lg"
            >
              <span className="relative">বুকিং করুন</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-[#0A0A0A]/95 backdrop-blur-md shadow-lg"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <nav className="container mx-auto px-6 pt-4 pb-8 flex flex-col gap-2">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 py-3 px-4 rounded-lg text-white text-md font-medium transition-colors ${
                    pathname === item.href ? "bg-orange-500/10 text-orange-400" : "hover:bg-white/5"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
              <div className="border-t border-white/10 my-4" />
              <Link
                href="/booking"
                className="w-full text-center bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-full transition-colors text-md"
              >
                বুকিং করুন
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
