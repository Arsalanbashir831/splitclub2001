
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Leaf } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const companyLinks = [
    { title: 'About Us', path: '/about' },
    { title: 'Who are we?', path: '/who-are-we' },
    { title: 'Press Relations', path: '/press' },
    { title: 'Careers', path: '/recruiting' },
    { title: 'Business', path: '/business' },
  ];

  const supportLinks = [
    { title: 'Help Center', path: '/help' },
    { title: 'Contact Us', path: '/contact' },
    { title: 'FAQ', path: '/faq' },
    { title: 'Community Guidelines', path: '/terms' },
  ];

  const legalLinks = [
    { title: 'Terms of Service', path: '/terms' },
    { title: 'Privacy Policy', path: '/privacy' },
    { title: 'Cookie Policy', path: '/cookies' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-muted/30 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">SplitClub</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The community marketplace for sharing unused subscriptions, memberships, and rewards. 
              Join thousands of users saving money while reducing waste.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>hello@splitclub.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="font-semibold text-foreground">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 story-link"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="font-semibold text-foreground">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 story-link"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="font-semibold text-foreground">Stay Connected</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest deals and updates.
            </p>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button size="sm" className="px-4">
                  Subscribe
                </Button>
              </div>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200 hover-scale"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Footer */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 animate-fade-in">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>© {currentYear} SplitClub. All rights reserved.</span>
            <div className="flex gap-4">
              {legalLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="hover:text-foreground transition-colors duration-200"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Made with ❤️ for the community</span>
            <div className="flex items-center space-x-1">
              <span>Powered by</span>
              <a 
                href="https://launchmd.ingenious.agency" 
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                LaunchMD
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
