import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [location]);
  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'All',         to: '/products' },
    { label: 'Clothing',    to: '/products?category=clothing' },
    { label: 'Shoes',       to: '/products?category=shoes' },
    { label: 'Watches',     to: '/products?category=watches' },
    { label: 'Accessories', to: '/products?category=accessories' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'
      }`}>
        {/* Announcement bar */}
        <div className={`bg-obsidian text-ivory text-xs text-center py-2 tracking-widest font-body transition-all duration-300 ${scrolled ? 'h-0 overflow-hidden py-0' : ''}`}>
          FREE SHIPPING ON ORDERS ABOVE ₹999 &nbsp;·&nbsp; USE CODE: LUXE15 FOR 15% OFF
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 group">
              <span className="font-display text-2xl md:text-3xl font-black tracking-widest text-obsidian group-hover:text-gold transition-colors duration-300">
                LUXE
              </span>
              <span className="block text-[10px] tracking-[0.4em] text-gold font-body font-medium -mt-1 uppercase">
                Fashion
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  className="text-xs font-body font-medium tracking-widest uppercase text-obsidian/70 hover:text-gold transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
                </NavLink>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:text-gold transition-colors duration-200"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" strokeWidth="1.5"/>
                  <path d="m21 21-4.35-4.35" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>

              {/* Wishlist */}
              {user && (
                <Link to="/wishlist" className="p-2 hover:text-gold transition-colors duration-200 hidden md:block" aria-label="Wishlist">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="1.5"/>
                  </svg>
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative p-2 hover:text-gold transition-colors duration-200" aria-label="Cart">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" strokeWidth="1.5"/>
                  <line x1="3" y1="6" x2="21" y2="6" strokeWidth="1.5"/>
                  <path d="M16 10a4 4 0 0 1-8 0" strokeWidth="1.5"/>
                </svg>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.5 }} animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-gold text-obsidian text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </Link>

              {/* User */}
              {user ? (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    className="flex items-center gap-1.5 p-2 hover:text-gold transition-colors duration-200"
                  >
                    <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center text-xs font-bold text-gold">
                      {user.name[0].toUpperCase()}
                    </div>
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-100 shadow-xl py-1 z-50"
                      >
                        <div className="px-4 py-2 border-b border-gray-50">
                          <p className="text-xs font-semibold text-obsidian truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <Link to="/profile"       onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-gray-50 text-obsidian transition-colors">My Profile</Link>
                        <Link to="/orders"        onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-gray-50 text-obsidian transition-colors">My Orders</Link>
                        <Link to="/wishlist"      onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-gray-50 text-obsidian transition-colors">Wishlist</Link>
                        <hr className="my-1 border-gray-50"/>
                        <button onClick={() => { logout(); setUserMenuOpen(false); navigate('/'); }} className="flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-gray-50 text-red-500 w-full text-left transition-colors">
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login"    className="text-xs font-body font-medium tracking-wider uppercase text-obsidian hover:text-gold transition-colors duration-200 px-3 py-2">Login</Link>
                  <Link to="/register" className="btn-primary text-xs !py-2 !px-4">Join</Link>
                </div>
              )}

              {/* Mobile Menu */}
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="lg:hidden p-2 hover:text-gold transition-colors duration-200"
              >
                <div className="w-5 flex flex-col gap-1.5">
                  <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                  <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                  <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-0 z-40 bg-white pt-24 pb-8 px-6 shadow-xl lg:hidden"
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map(link => (
                <Link key={link.label} to={link.to} onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium tracking-widest uppercase py-3 border-b border-gray-50 hover:text-gold transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 flex flex-col gap-3">
              {user ? (
                <>
                  <Link to="/profile"  onClick={() => setMenuOpen(false)} className="text-sm hover:text-gold transition-colors py-2">My Profile</Link>
                  <Link to="/orders"   onClick={() => setMenuOpen(false)} className="text-sm hover:text-gold transition-colors py-2">My Orders</Link>
                  <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="text-sm hover:text-gold transition-colors py-2">Wishlist</Link>
                  <button onClick={() => { logout(); setMenuOpen(false); navigate('/'); }} className="btn-outline text-sm !py-2 text-left">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/login"    onClick={() => setMenuOpen(false)} className="btn-outline text-center text-sm !py-3">Login</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-center text-sm !py-3">Create Account</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-obsidian/95 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl"
            >
              <form onSubmit={handleSearch} className="relative">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search for clothes, shoes, watches..."
                  className="w-full bg-transparent border-b-2 border-white/30 focus:border-gold text-white text-2xl md:text-3xl font-display pb-4 outline-none placeholder-white/30 transition-colors duration-300"
                />
                <button type="submit" className="absolute right-0 bottom-4 text-white/60 hover:text-gold transition-colors">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" strokeWidth="1.5"/>
                    <path d="m21 21-4.35-4.35" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </form>
              <p className="text-white/30 text-xs mt-4 tracking-widest">PRESS ENTER TO SEARCH &nbsp; · &nbsp; ESC TO CLOSE</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for user menu */}
      {userMenuOpen && <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />}
    </>
  );
};

export default Navbar;
