
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/authStore';
import { Menu, X, User, Settings, LogOut, Shield, Plus, Search, Sun, Moon, Info } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export const Navbar = () => {
  const { user, isAuthenticated, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/deals?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false); // Close mobile menu on search
    }
  };

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Browse Deals', href: '/deals' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SC</span>
              </div>
              <span className="font-bold text-xl text-foreground hidden sm:block">SplitClub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 ml-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </form>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hidden sm:flex"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {isAuthenticated && user ? (
              <>
                {/* Share Deal Button - Hidden on small screens */}
                <Button asChild variant="outline" size="sm" className="hidden md:flex">
                  <Link to="/share-deal">
                    <Plus className="h-4 w-4 mr-2" />
                    Share Deal
                  </Link>
                </Button>
                
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* Mobile-only Share Deal option */}
                    <DropdownMenuItem asChild className="md:hidden">
                      <Link to="/share-deal">
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Share Deal</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin">
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/help">
                        <Info className="mr-2 h-4 w-4" />
                        <span>Help</span>
                      </Link>
                    </DropdownMenuItem>
                    {/* Mobile-only theme toggle */}
                    <DropdownMenuItem 
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="sm:hidden"
                    >
                      {theme === 'dark' ? (
                        <>
                          <Sun className="mr-2 h-4 w-4" />
                          <span>Light Mode</span>
                        </>
                      ) : (
                        <>
                          <Moon className="mr-2 h-4 w-4" />
                          <span>Dark Mode</span>
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild size="sm">
                <Link to="/login">Sign In</Link>
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </form>
              
              {/* Mobile Navigation Links */}
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
