import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Leaf } from 'lucide-react';
import { AnimatedContainer } from '@/components/animations/AnimatedContainer';
import { HoverScale } from '@/components/animations/HoverScale';
const footerSections = [{
  title: 'Company',
  links: [{
    title: 'About Us',
    path: '/about'
  }, {
    title: 'Who are we?',
    path: '/who-are-we'
  }, {
    title: 'Press Relations',
    path: '/press'
  }, {
    title: 'Careers',
    path: '/recruiting'
  }, {
    title: 'Business',
    path: '/business'
  }]
}, {
  title: 'Support',
  links: [{
    title: 'Help Center',
    path: '/help'
  }, {
    title: 'Contact Us',
    path: '/contact'
  }, {
    title: 'FAQ',
    path: '/faq'
  }, {
    title: 'Community Guidelines',
    path: '/terms'
  }]
}];
const socialLinks = [{
  icon: Facebook,
  href: '#',
  label: 'Facebook'
}, {
  icon: Twitter,
  href: '#',
  label: 'Twitter'
}, {
  icon: Instagram,
  href: '#',
  label: 'Instagram'
}, {
  icon: Linkedin,
  href: '#',
  label: 'LinkedIn'
}];
const legalLinks = [{
  title: 'Terms of Service',
  path: '/terms'
}, {
  title: 'Privacy Policy',
  path: '/privacy'
}, {
  title: 'Cookie Policy',
  path: '/cookies'
}];
export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-muted/30 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <AnimatedContainer variant="slideUp" delay={0}>
            <div className="space-y-4">
              <motion.div className="flex items-center space-x-2" whileHover={{
              scale: 1.05
            }} transition={{
              duration: 0.2
            }}>
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl text-foreground">SplitClub</span>
              </motion.div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                The community marketplace for sharing unused subscriptions, memberships, and rewards. 
                Join thousands of users saving money while reducing waste.
              </p>
              <div className="space-y-2">
                {[{
                icon: Mail,
                text: 'hello@splitclub.com'
              }, {
                icon: Phone,
                text: '+1 (555) 123-4567'
              }, {
                icon: MapPin,
                text: 'San Francisco, CA'
              }].map((contact, index) => <motion.div key={index} className="flex items-center space-x-2 text-sm text-muted-foreground" initial={{
                opacity: 0,
                x: -10
              }} animate={{
                opacity: 1,
                x: 0
              }} transition={{
                delay: 0.1 + index * 0.1
              }}>
                    <contact.icon className="w-4 h-4" />
                    <span>{contact.text}</span>
                  </motion.div>)}
              </div>
            </div>
          </AnimatedContainer>

          {/* Footer Sections */}
          {footerSections.map((section, sectionIndex) => {})}

          {/* Newsletter & Social */}
          
        </div>

        <Separator className="my-8" />

        {/* Bottom Footer */}
        <AnimatedContainer variant="fadeIn" delay={0.8}>
          <div className="py-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>© {currentYear} SplitClub. All rights reserved.</span>
              <div className="flex gap-4">
                {legalLinks.map(link => <Link key={link.path} to={link.path} className="hover:text-foreground transition-colors duration-200">
                    {link.title}
                  </Link>)}
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              
              <div className="flex items-center space-x-1">
                <span>Powered by</span>
                <a href="https://launchmd.ingenious.agency" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  LaunchMD
                </a>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </footer>;
};