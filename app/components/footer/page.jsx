
import { AppWindow, Globe, Heart, ThumbsUp } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#111111] text-gray-400 border-t border-[#333333]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo and About */}
                    <div className="md:col-span-1">
                        <a href="#" className="text-2xl font-bold text-orange-500 mb-4 inline-block">
                            📷 ChitroJal
                        </a>
                        <p className="text-sm">
                            The premium management tool for professional photographers in Bangladesh.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Home</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Portfolio</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Packages</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Contact</h3>
                        <ul className="space-y-2 text-sm">
                            <li>Dhaka, Bangladesh</li>
                            <li>+880 123 456 7890</li>
                            <li>contact@chitrojal.com</li>
                        </ul>
                    </div>

                    {/* Socials - Placeholder Icons */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-orange-500 transition-colors"><AppWindow size={20} /></a>
                            <a href="#" className="hover:text-orange-500 transition-colors"><Globe size={20} /></a>
                            <a href="#" className="hover:text-orange-500 transition-colors"><Heart size={20} /></a>
                            <a href="#" className="hover:text-orange-500 transition-colors"><ThumbsUp size={20} /></a>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-[#333333] text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} ChitroJal. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
