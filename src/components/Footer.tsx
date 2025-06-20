
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Leaf } from 'lucide-react';
import { AnimatedContainer } from '@/components/animations/AnimatedContainer';

const footerSections = [
  {
    title: 'Company',
    links: [
      { title: 'About Us', path: '/about' },
      { title: 'Who are we?', path: '/who-are-we' },
      { title: 'Press Relations', path: '/press' },
      { title: 'Careers', path: '/recruiting' },
      { title: 'Business', path: '/business' }
    ]
  },
  {
    title: 'Support',
    links: [
      { title: 'Help Center', path: '/help' },
      { title: 'Contact Us', path: '/contact' },
      { title: 'FAQ', path: '/faq' },
      { title: 'Community Guidelines', path: '/terms' }
    ]
  }
];

const legalLinks = [
  { title: 'Terms of Service', path: '/terms' },
  { title: 'Privacy Policy', path: '/privacy' },
  { title: 'Cookie Policy', path: '/cookies' }
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <AnimatedContainer variant="slideUp" delay={0} className="lg:col-span-2">
            <div className="space-y-6">
              <motion.div 
                className="flex items-center space-x-3" 
                whileHover={{ scale: 1.02 }} 
                transition={{ duration: 0.2 }}
              >
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                  <Leaf className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-bold text-2xl text-foreground">SplitClub</span>
              </motion.div>
              
              <p className="text-muted-foreground text-base leading-relaxed max-w-md">
                The community marketplace for sharing unused subscriptions, memberships, and rewards. 
                Join thousands of users saving money while reducing waste.
              </p>
              
              <div className="space-y-3">
                {[
                  { icon: Mail, text: 'hello@splitclub.com' },
                  { icon: Phone, text: '+1 (555) 123-4567' },
                  { icon: MapPin, text: 'San Francisco, CA' }
                ].map((contact, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors duration-200"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                  >
                    <contact.icon className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">{contact.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedContainer>

          {/* Footer Sections */}
          {footerSections.map((section, sectionIndex) => (
            <AnimatedContainer 
              key={section.title} 
              variant="slideUp" 
              delay={0.2 + sectionIndex * 0.1}
            >
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-foreground">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm font-medium"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Bottom Footer */}
        <AnimatedContainer variant="fadeIn" delay={0.8}>
          <div className="py-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <span className="font-medium">© {currentYear} SplitClub. All rights reserved.</span>
              <div className="flex gap-6">
                {legalLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="hover:text-foreground transition-colors duration-200 font-medium"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Powered by</span>
              <a 
                href="https://launchmd.ingenious.agency" 
                className="text-primary hover:text-primary/80 transition-colors duration-200 font-semibold" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                LaunchMD
              </a>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </footer>
  );
};
