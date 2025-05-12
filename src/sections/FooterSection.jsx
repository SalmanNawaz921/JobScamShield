import Logo from "@/assets/Logo";
import Link from "next/link";
import { FiGithub, FiInstagram, FiLinkedin } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import { LiaDiscord } from "react-icons/lia";

const Footer = () => {
  const socialMedia = [
    {
      name: "Twitter",
      icon: <FaXTwitter className="h-4 w-4" />,
      url: "https://x.com/SalmanCh921",
      url2: "https://x.com/MuhammadAb49553",
    },
    {
      name: "GitHub",
      icon: <FiGithub className="h-4 w-4" />,
      url: "https://github.com/SalmanNawaz921",
      url2: "https://github.com/55jami",
    },
    {
      name: "LinkedIn",
      icon: <FiLinkedin className="h-4 w-4" />,
      url: "https://www.linkedin.com/in/salman921",
      url2: "https://www.linkedin.com/in/m-abu-bakar-23a7b3245",
    },
    {
      name: "Instagram",
      icon: <FiInstagram className="h-4 w-4" />,
      url: "https://www.instagram.com/salman.nawaz.rajput",
      url2: "https://www.instagram.com/abubakarr",
    },
    {
      name: "Discord",
      icon: <LiaDiscord className="h-4 w-4" />,
      url: "https://discord.gg/wMEy7YYM",
    },
  ];

  const resourcesLinks = [
    {
      name: "Documentation",
      url: "https://github.com/SalmanNawaz921/JobScamShield/blob/main/README.md",
    },
    { name: "GitHub", url: "https://github.com/SalmanNawaz921/JobScamShield" },
  ];

  const legalLinks = [
    { name: "Home", url: "/" },
    { name: "About Us", url: "#about" },
    { name: "Contact Us", url: "#contact" },
  ];

  return (
    <footer className="relative border-t border-white/10 bg-gradient-to-b from-blue-900/30 to-transparent backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="flex flex-col items-start space-y-4">
            <Logo size="md" />
            <p className="text-blue-100/80 text-sm">
              Protecting job seekers from fraudulent postings with AI
              technology.
            </p>
          </div>

          {/* Resources Links */}
          <FooterLinkSection title="Resources" links={resourcesLinks} />

          {/* Legal Links */}
          <FooterLinkSection title="Legal" links={legalLinks} />

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Connect
            </h4>
            <div className="space-y-2">
              <h4 className="text-xs text-white  tracking-wider">
                Muhammad Salman
              </h4>
              <div className="flex space-x-4">
                {socialMedia.map((item) => (
                  <Link
                    target="_blank"
                    key={item.name}
                    href={item.url}
                    className="text-blue-100/80 hover:text-white transition-colors"
                    aria-label={item.name}
                  >
                    {item.icon}
                  </Link>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-xs text-white  tracking-wider">
                Muhammad Abubakar
              </h4>
              <div className="flex space-x-4">
                {socialMedia.map((item) => {
                  return item.url2 ? (
                    <Link
                      target="_blank"
                      key={item.name}
                      href={item.url2}
                      className="text-blue-100/80 hover:text-white transition-colors"
                      aria-label={item.name}
                    >
                      {item.icon}
                    </Link>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/5 text-sm text-blue-100/60 text-center">
          <p>
            © {new Date().getFullYear()} Job Scam Shield. All rights reserved.
          </p>
          <p className="mt-2">Made with ❤️ for job seekers worldwide</p>
        </div>
      </div>
    </footer>
  );
};

// Reusable link section component
const FooterLinkSection = ({ title, links }) => (
  <div className="space-y-4">
    <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
      {title}
    </h4>
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.name}>
          <Link
            target="_blank"
            href={link.url}
            className="text-blue-100/80 hover:text-white transition-colors"
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;
