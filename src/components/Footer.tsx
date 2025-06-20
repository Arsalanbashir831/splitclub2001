import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Mail, Phone, MapPin, Github, Twitter, Linkedin, Instagram } from 'lucide-react';
export const Footer = () => {
  const navItems = [{
    label: 'Home',
    href: '/'
  }, {
    label: 'Browse Deals',
    href: '/deals'
  }, {
    label: 'About',
    href: '/about'
  }, {
    label: 'Contact',
    href: '/contact'
  }];
  const companyLinks = [{
    label: 'Who Are We',
    href: '/who-are-we'
  }, {
    label: 'Careers',
    href: '/careers'
  }, {
    label: 'Press',
    href: '/press'
  }, {
    label: 'Business',
    href: '/business'
  }];
  const supportLinks = [{
    label: 'Help Center',
    href: '/help'
  }, {
    label: 'FAQ',
    href: '/faq'
  }, {
    label: 'Privacy Policy',
    href: '/privacy'
  }, {
    label: 'Terms of Service',
    href: '/terms'
  }, {
    label: 'Cookie Policy',
    href: '/cookies'
  }];
  const socialLinks = [{
    icon: Twitter,
    href: '#',
    label: 'Twitter'
  }, {
    icon: Linkedin,
    href: '#',
    label: 'LinkedIn'
  }, {
    icon: Instagram,
    href: '#',
    label: 'Instagram'
  }, {
    icon: Github,
    href: '#',
    label: 'GitHub'
  }];
  return <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div className="space-y-4" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">SplitClub</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Join the community marketplace for unused subscriptions, memberships, and rewards. 
              Share deals, save money, and reduce waste together.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(social => {
              const Icon = social.icon;
              return <motion.a key={social.label} href={social.href} className="text-muted-foreground hover:text-primary transition-colors duration-200" whileHover={{
                scale: 1.1
              }} whileTap={{
                scale: 0.95
              }} aria-label={social.label}>
                    <Icon className="w-5 h-5" />
                  </motion.a>;
            })}
            </div>
          </motion.div>

          {/* Navigation Links */}
          <motion.div className="space-y-4" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: 0.1
        }}>
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              {navItems.map(item => <li key={item.href}>
                  <Link to={item.href} className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm">
                    {item.label}
                  </Link>
                </li>)}
            </ul>
          </motion.div>

          {/* Company Links */}
          

          {/* Support & Legal */}
          <motion.div className="space-y-4" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: 0.3
        }}>
            <h3 className="font-semibold text-foreground">Support & Legal</h3>
            <ul className="space-y-2">
              {supportLinks.map(item => <li key={item.href}>
                  <Link to={item.href} className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm">
                    {item.label}
                  </Link>
                </li>)}
            </ul>
          </motion.div>
        </div>

        {/* Contact Information */}
        <motion.div className="mt-8 pt-8 border-t border-border" initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6,
        delay: 0.4
      }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>hello@splitclub.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>San Francisco, CA</span>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0" initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6,
        delay: 0.5
      }}>
          <p className="text-sm text-muted-foreground">
            © 2024 SplitClub. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors duration-200">
              Privacy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors duration-200">
              Terms
            </Link>
            <Link to="/cookies" className="text-muted-foreground hover:text-primary transition-colors duration-200">
              Cookies
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>;
};