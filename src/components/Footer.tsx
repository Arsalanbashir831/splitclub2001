
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    { title: 'Home', path: '/' },
    { title: 'Online Help', path: '/help' },
    { title: 'Contact us', path: '/contact' },
    { title: 'Press Relations', path: '/press' },
    { title: 'More about us', path: '/about' },
    { title: 'Terms of service', path: '/terms' },
    { title: 'Privacy policy', path: '/privacy' },
    { title: 'Who are we?', path: '/who-are-we' },
    { title: 'FAQ', path: '/faq' },
  ];

  return (
    <footer className="bg-muted border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {footerLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.title}
            </Link>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © {currentYear} SplitClub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
