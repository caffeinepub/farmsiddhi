import { Link, useRouterState } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/products', label: 'Products' },
    { path: '/farmer-network', label: 'Farmer Network' },
    { path: '/exports', label: 'Exports' },
    { path: '/contact', label: 'Contact Us' },
    { path: '/admin', label: 'Admin' },
  ];

  const isActive = (path: string) => currentPath === path;

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-xs">
      <div className="section-container">
        <div className="flex items-center justify-between h-40">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/assets/image_8a526262-3a20-4994-9dc2-1df6b5d6410e-1.png"
              alt="FarmSiddhi"
              className="h-32 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  isActive(link.path)
                    ? 'text-primary bg-primary/5'
                    : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded transition-colors ${
                    isActive(link.path)
                      ? 'text-primary bg-primary/5'
                      : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
