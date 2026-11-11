import React, { useState, useEffect, useRef } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface BookingFormState {
  type: 'grooming' | 'concierge';
  petName: string;
  petBreed: string;
  ownerName: string;
  location: string;
  date: string;
  service: string;
  notes: string;
}

const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

const PRODUCTS: Product[] = [
  {
    id: 'heritage-collar',
    name: 'Heritage Leather & Brass Collar',
    price: 48000,
    image: 'https://images.pexels.com/photos/7053881/pexels-photo-7053881.jpeg?w=200&h=200&fit=crop',
    category: 'Accessories',
    description: 'Hand-stitched leather collar with custom-engraved brass ID tag.',
  },
  {
    id: 'stone-bowl',
    name: 'Cool-Stone Artisan Bowl',
    price: 22500,
    image: 'https://images.pexels.com/photos/19884207/pexels-photo-19884207.png?w=200&h=200&fit=crop',
    category: 'Dining',
    description: 'Weighted ceramic stoneware bowl that keeps water cool in Lagos heat.',
  },
  {
    id: 'velvet-bed',
    name: 'Cloud Nine Cooling Velvet Bed',
    price: 135000,
    image: 'https://images.pexels.com/photos/31517777/pexels-photo-31517777.jpeg?w=200&h=200&fit=crop',
    category: 'Slumber',
    description: 'Orthopedic memory foam core wrapped in breathable, easy-wash velvet.',
  },
  {
    id: 'amber-treats',
    name: 'Salmon & Turmeric Coat Chews',
    price: 18500,
    image: 'https://images.pexels.com/photos/7368026/pexels-photo-7368026.jpeg?w=200&h=200&fit=crop',
    category: 'Apothecary',
    description: 'Omega-rich wellness bites for a glossy coat through rainy season & Harmattan.',
  },
];

const HERO_LEFT_IMAGES = [
  {
    src: 'https://images.pexels.com/photos/2318990/pexels-photo-2318990.jpeg?w=600&h=900&fit=crop',
    alt: 'Happy dog enjoying the soft life',
  },
  {
    src: 'https://images.pexels.com/photos/34060703/pexels-photo-34060703.jpeg?w=600&h=900&fit=crop',
    alt: 'Freshly groomed retriever',
  },
  {
    src: 'https://images.pexels.com/photos/9102181/pexels-photo-9102181.jpeg?w=600&h=900&fit=crop',
    alt: 'Healthy puppy after spa bath',
  },
];

const HERO_RIGHT_IMAGES = [
  {
    src: 'https://images.pexels.com/photos/33346673/pexels-photo-33346673.jpeg?w=600&h=900&fit=crop',
    alt: 'Luxury cat accessories',
  },
  {
    src: 'https://images.pexels.com/photos/10292640/pexels-photo-10292640.jpeg?w=600&h=900&fit=crop',
    alt: 'Designer cat furniture',
  },
  {
    src: 'https://images.pexels.com/photos/7309472/pexels-photo-7309472.jpeg?w=600&h=900&fit=crop',
    alt: 'Organic pet treats and gear',
  },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [activeBookingForm, setActiveBookingForm] = useState<'grooming' | 'concierge' | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingForm, setBookingForm] = useState<BookingFormState>({
    type: 'grooming',
    petName: '',
    petBreed: '',
    ownerName: '',
    location: 'Lekki Phase 1, Lagos',
    date: '2026-11-15',
    service: 'Full Tropical Spa Bath, Tick Defense & Styling (₦35,000)',
    notes: '',
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Hero Slider State
  const [leftSlideIndex, setLeftSlideIndex] = useState(0);
  const [rightSlideIndex, setRightSlideIndex] = useState(0);

  // Parallax & Horizontal Scroll Refs
  const parallaxTextRef = useRef<HTMLDivElement>(null);
  const journeyScrollContainerRef = useRef<HTMLDivElement>(null);
  const journeyTrackRef = useRef<HTMLDivElement>(null);
  const navMenuBoxRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  // Hero Sliders interval
  useEffect(() => {
    const interval = setInterval(() => {
      setLeftSlideIndex((prev) => (prev + 1) % HERO_LEFT_IMAGES.length);
      setRightSlideIndex((prev) => (prev + 1) % HERO_RIGHT_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-on-scroll-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animation-on-scroll]');
    elements.forEach((el) => {
      el.classList.add('animate-on-scroll-hidden');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Scroll listeners for Parallax & Journey Horizontal Scroll
  useEffect(() => {
    const handleScroll = () => {
      // Parallax Effect
      if (parallaxTextRef.current && parallaxTextRef.current.parentElement) {
        const parentRect = parallaxTextRef.current.parentElement.getBoundingClientRect();
        if (parentRect.top < window.innerHeight && parentRect.bottom > 0) {
          const relativeScroll =
            window.innerHeight / 2 - (parentRect.top + parentRect.height / 2);
          const movement = relativeScroll * 0.1;
          parallaxTextRef.current.style.transform = `translateY(${movement}px)`;
        }
      }

      // Journey Horizontal Scroll Logic
      if (journeyScrollContainerRef.current && journeyTrackRef.current) {
        const rect = journeyScrollContainerRef.current.getBoundingClientRect();
        const scrollEnd =
          journeyScrollContainerRef.current.offsetHeight - window.innerHeight;
        if (scrollEnd > 0) {
          let progress = -rect.top / scrollEnd;
          progress = Math.max(0, Math.min(1, progress));
          const maxTranslate =
            journeyTrackRef.current.scrollWidth - window.innerWidth;
          journeyTrackRef.current.style.transform = `translateX(${-progress * maxTranslate}px)`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Escape key & outside click handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isOverlayOpen) {
          setIsOverlayOpen(false);
          setActiveBookingForm(null);
          document.body.style.overflow = '';
        }
        if (isMenuOpen) setIsMenuOpen(false);
        if (isCartOpen) setIsCartOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        isMenuOpen &&
        navMenuBoxRef.current &&
        !navMenuBoxRef.current.contains(e.target as Node) &&
        menuTriggerRef.current &&
        !menuTriggerRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOverlayOpen, isMenuOpen, isCartOpen]);

  const openOverlay = (defaultForm: 'grooming' | 'concierge' | null = null) => {
    setIsOverlayOpen(true);
    setActiveBookingForm(defaultForm);
    setBookingConfirmed(false);
    setIsMenuOpen(false);
    document.body.style.overflow = 'hidden';
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
    setActiveBookingForm(null);
    document.body.style.overflow = '';
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, selector: string) => {
    e.preventDefault();
    if (isMenuOpen) setIsMenuOpen(false);
    if (isOverlayOpen) closeOverlay();

    if (selector === '#' || selector === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const target = document.querySelector(selector);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setOrderConfirmed(false);
    setAddedToast(`${product.name} added to bag`);
    setTimeout(() => setAddedToast(null), 2600);
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
  };

  return (
    <div className="font-primary bg-neutral-background text-text-primary min-h-screen flex flex-col w-full relative">
      {/* Subtle Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] bg-neutral-dark text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 text-xs font-bold uppercase tracking-widest transition-all">
          <span>{addedToast}</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-brand-accent underline hover:text-white ml-2"
          >
            View Bag ({cartCount})
          </button>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 md:h-20 z-50 px-4 md:px-8 flex items-center justify-between pointer-events-none">
        {/* Left: Menu Button */}
        <div className="relative pointer-events-auto">
          <button
            ref={menuTriggerRef}
            id="menu-trigger"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="bg-brand-accent h-10 md:h-12 px-4 md:px-6 flex items-center gap-3 rounded-full group overflow-hidden shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <div className="flex flex-col justify-between h-2 w-5">
              <span
                className="h-[1.5px] w-full bg-brand-primary transition-transform origin-center"
                style={{
                  transform: isMenuOpen ? 'translateY(3.5px) rotate(45deg)' : 'none',
                }}
              ></span>
              <span
                className="h-[1.5px] w-full bg-brand-primary transition-transform origin-center"
                style={{
                  transform: isMenuOpen ? 'translateY(-3.5px) rotate(-45deg)' : 'none',
                }}
              ></span>
            </div>
            <div className="hidden md:block text-split-hover text-[11px] md:text-[12px] font-bold uppercase tracking-wider text-brand-primary">
              <span>{isMenuOpen ? 'Close' : 'Menu'}</span>
              <span>{isMenuOpen ? 'Back' : 'Explore'}</span>
            </div>
          </button>

          {/* Expanded Menu Box (Bottom Right corner) */}
          <div
            ref={navMenuBoxRef}
            id="nav-menu-box"
            className={`fixed bottom-6 right-4 md:right-8 w-64 md:w-80 bg-brand-accent rounded-[2rem] shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden border border-brand-primary/10 ${
              isMenuOpen
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-10 pointer-events-none'
            }`}
          >
            <div className="p-8 flex flex-col gap-6">
              <nav className="flex flex-col gap-4">
                <a
                  href="#services-shop"
                  onClick={(e) => scrollToSection(e, '#services-shop')}
                  className="text-2xl font-display font-bold tracking-tight hover:pl-2 transition-all text-text-primary flex items-center justify-between group/link"
                >
                  Services
                  <span className="opacity-0 group-hover/link:opacity-100 transition-opacity text-brand-primary">
                    →
                  </span>
                </a>
                <a
                  href="#services-shop"
                  onClick={(e) => scrollToSection(e, '#services-shop')}
                  className="text-2xl font-display font-bold tracking-tight hover:pl-2 transition-all text-text-primary flex items-center justify-between group/link"
                >
                  Boutique
                  <span className="opacity-0 group-hover/link:opacity-100 transition-opacity text-brand-primary">
                    →
                  </span>
                </a>
                <a
                  href="#journey-section"
                  onClick={(e) => scrollToSection(e, '#journey-section')}
                  className="text-2xl font-display font-bold tracking-tight hover:pl-2 transition-all text-text-primary flex items-center justify-between group/link"
                >
                  Our Story
                  <span className="opacity-0 group-hover/link:opacity-100 transition-opacity text-brand-primary">
                    →
                  </span>
                </a>
                <a
                  href="#testimonials-section"
                  onClick={(e) => scrollToSection(e, '#testimonials-section')}
                  className="text-2xl font-display font-bold tracking-tight hover:pl-2 transition-all text-text-primary flex items-center justify-between group/link"
                >
                  Reviews
                  <span className="opacity-0 group-hover/link:opacity-100 transition-opacity text-brand-primary">
                    →
                  </span>
                </a>
                <a
                  href="#contact-footer"
                  onClick={(e) => scrollToSection(e, '#contact-footer')}
                  className="text-2xl font-display font-bold tracking-tight hover:pl-2 transition-all text-text-primary flex items-center justify-between group/link"
                >
                  Contact
                  <span className="opacity-0 group-hover/link:opacity-100 transition-opacity text-brand-primary">
                    →
                  </span>
                </a>
              </nav>
              <div className="pt-6 border-t border-brand-primary/10 text-text-primary">
                <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold mb-2">
                  Lagos &amp; Abuja Lounges
                </p>
                <div className="flex gap-4">
                  <a
                    href="#contact-footer"
                    onClick={(e) => scrollToSection(e, '#contact-footer')}
                    className="text-xs font-semibold hover:text-brand-primary transition-colors"
                  >
                    Instagram
                  </a>
                  <a
                    href="#contact-footer"
                    onClick={(e) => scrollToSection(e, '#contact-footer')}
                    className="text-xs font-semibold hover:text-brand-primary transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Company Name */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <a
            href="/"
            onClick={(e) => scrollToSection(e, '/')}
            className="font-display text-lg md:text-2xl font-bold tracking-logo text-brand-primary uppercase whitespace-nowrap"
          >
            <span className="md:hidden">P&amp;W.</span>
            <span className="hidden md:inline">Paws &amp; Whiskers.</span>
          </a>
        </div>

        {/* Right: Bag & Project Button */}
        <div className="pointer-events-auto flex items-center gap-2.5">
          {cartCount > 0 && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-white border border-brand-primary/20 h-10 md:h-12 px-4 flex items-center gap-2 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 text-brand-primary text-xs font-bold uppercase tracking-wider"
              aria-label="Open Shopping Bag"
            >
              <span>Bag</span>
              <span className="w-5 h-5 rounded-full bg-brand-primary text-white flex items-center justify-center text-[11px] tabular-nums">
                {cartCount}
              </span>
            </button>
          )}
          <button
            onClick={() => openOverlay()}
            className="bg-brand-accent h-10 md:h-12 px-4 md:px-6 flex items-center rounded-full group overflow-hidden shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <div className="hidden md:block text-split-hover text-[11px] md:text-[12px] font-bold uppercase tracking-wider text-brand-primary pointer-events-none">
              <span>Book a visit</span>
              <span>Holla at us</span>
            </div>
            <div className="md:hidden text-brand-primary">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
          </button>
        </div>
      </header>

      {/* Shopping Bag Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[70] flex justify-end bg-black/40 backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 md:p-8 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-brand-primary/10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary block">
                    Same-Day Dispatch · Lagos &amp; Abuja
                  </span>
                  <h3 className="font-display text-2xl font-bold text-text-primary">
                    Your Boutique Bag
                  </h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-10 h-10 rounded-full border border-brand-primary/30 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {orderConfirmed ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-brand-accent text-brand-primary mx-auto flex items-center justify-center text-2xl font-bold">
                    ✓
                  </div>
                  <h4 className="font-display text-2xl font-bold text-text-primary">
                    Order #PW-LAG84 Confirmed
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Ese! Thank you for shopping with Paws &amp; Whiskers. Our dispatch
                    rider is preparing your package for doorstep delivery across the
                    Island &amp; Mainland.
                  </p>
                  <button
                    onClick={() => {
                      setOrderConfirmed(false);
                      setIsCartOpen(false);
                    }}
                    className="mt-4 inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-primary text-white text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all"
                  >
                    Continue Exploring
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="py-16 text-center space-y-4">
                  <p className="italic-style text-2xl text-brand-primary">
                    Your boutique bag is empty.
                  </p>
                  <p className="text-sm text-text-secondary">
                    Treat your furry companion to engraved brass leather collars,
                    cooling stoneware bowls, and imported coat chews.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-brand-primary/10 my-4">
                  {cart.map((item) => (
                    <div key={item.id} className="py-4 flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-2xl object-cover bg-brand-accent/30 flex-shrink-0"
                      />
                      <div className="flex-grow">
                        <h4 className="font-display text-sm font-bold uppercase text-text-primary">
                          {item.name}
                        </h4>
                        <p className="text-xs text-brand-primary font-bold tabular-nums mt-0.5">
                          {formatNaira(item.price)}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => updateCartQty(item.id, -1)}
                            className="w-6 h-6 rounded-full bg-brand-accent text-brand-primary font-bold text-xs flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQty(item.id, 1)}
                            className="w-6 h-6 rounded-full bg-brand-accent text-brand-primary font-bold text-xs flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-right font-display font-bold text-sm tabular-nums text-text-primary">
                        {formatNaira(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && !orderConfirmed && (
              <div className="pt-6 border-t border-brand-primary/10 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">
                    Express Dispatch (Island &amp; Mainland)
                  </span>
                  <span className="font-bold text-brand-primary uppercase text-xs">
                    Complimentary
                  </span>
                </div>
                <div className="flex items-center justify-between text-lg font-display font-bold">
                  <span>Subtotal</span>
                  <span className="tabular-nums text-brand-primary">
                    {formatNaira(cartTotal)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setOrderConfirmed(true);
                    setCart([]);
                  }}
                  className="w-full py-4 rounded-full bg-brand-primary text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:brightness-110 transition-all"
                >
                  Confirm Order (Pay via Transfer / Card)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Project Overlay */}
      <div
        id="project-overlay"
        className={`fixed inset-0 z-[60] bg-white transition-transform duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] overflow-y-auto ${
          isOverlayOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex flex-col min-h-screen">
          <div className="p-4 md:p-8 flex justify-between items-center sticky top-0 bg-white z-10">
            <span className="font-display text-lg font-bold tracking-logo text-brand-primary uppercase">
              Paws &amp; Whiskers · Lagos &amp; Abuja
            </span>
            <button
              onClick={closeOverlay}
              className="w-12 h-12 rounded-full border border-brand-primary flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors"
              aria-label="Close overlay"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="flex-grow flex items-center justify-center px-6">
            {!activeBookingForm ? (
              <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 py-12">
                <button
                  type="button"
                  onClick={() => {
                    setBookingForm((prev) => ({
                      ...prev,
                      type: 'grooming',
                      service: 'Full Tropical Spa Bath, Tick Defense & Styling (₦35,000)',
                    }));
                    setActiveBookingForm('grooming');
                  }}
                  className="text-left group flex flex-col gap-6 no-underline text-text-primary p-8 rounded-[40px] transition-colors hover:bg-brand-accent/30 border-1.6 border-transparent hover:border-brand-primary/20"
                >
                  <p className="italic-style text-[28px] md:text-[32px] font-light leading-none text-brand-primary">
                    Grooming &amp; Coat Care
                  </p>
                  <div className="flex flex-col">
                    <h2 className="text-[44px] md:text-[72px] font-display font-bold leading-[0.9] tracking-tighter text-text-primary">
                      <span className="block">Time for a</span>
                      <span className="block">proper glow-up?</span>
                    </h2>
                  </div>
                  <p className="text-[18px] md:text-[20px] font-light leading-[1.4] max-w-[360px] text-text-secondary">
                    Book a deep de-shedding bath, medicated tick &amp; flea wash, or invite
                    our AC mobile grooming van right to your gate.
                  </p>
                  <div className="mt-4 w-12 h-12 rounded-full border border-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="transform group-hover:rotate-45 transition-transform"
                    >
                      <path
                        d="M1 17L17 1M17 1H1M17 1V17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBookingForm((prev) => ({
                      ...prev,
                      type: 'concierge',
                      service: '24/7 AC Luxury Boarding Suite + WhatsApp Updates (₦45,000/night)',
                    }));
                    setActiveBookingForm('concierge');
                  }}
                  className="text-left group flex flex-col gap-6 no-underline text-text-primary p-8 rounded-[40px] transition-colors hover:bg-neutral-50 border-1.6 border-transparent hover:border-brand-primary/20"
                >
                  <p className="italic-style text-[28px] md:text-[32px] font-light leading-none text-brand-primary">
                    Boarding &amp; VIP Concierge
                  </p>
                  <div className="flex flex-col">
                    <h2 className="text-[44px] md:text-[72px] font-display font-bold leading-[0.9] tracking-tighter text-text-primary">
                      <span className="block">Traveling or</span>
                      <span className="block">got Owambe?</span>
                    </h2>
                  </div>
                  <p className="text-[18px] md:text-[20px] font-light leading-[1.4] max-w-[360px] text-text-secondary">
                    From 24/7 inverter-powered AC boarding suites with daily WhatsApp
                    videos to custom imported diet orders—we&apos;ve got you covered.
                  </p>
                  <div className="mt-4 w-12 h-12 rounded-full border border-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="transform group-hover:rotate-45 transition-transform"
                    >
                      <path
                        d="M1 17L17 1M17 1H1M17 1V17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </div>
                </button>
              </div>
            ) : (
              <div className="max-w-2xl w-full py-8">
                <button
                  type="button"
                  onClick={() => {
                    setActiveBookingForm(null);
                    setBookingConfirmed(false);
                  }}
                  className="text-xs font-bold uppercase tracking-widest text-brand-primary hover:underline mb-6 inline-flex items-center gap-2"
                >
                  ← Back to Options
                </button>

                {bookingConfirmed ? (
                  <div className="bg-brand-accent/40 p-10 rounded-[32px] border border-brand-primary/20 space-y-6 text-center">
                    <p className="italic-style text-3xl text-brand-primary">
                      Your slot is locked in!
                    </p>
                    <h3 className="font-display text-3xl font-bold text-text-primary">
                      VIP Session Reserved for {bookingForm.petName || 'Your Companion'}
                    </h3>
                    <p className="text-text-secondary text-base max-w-md mx-auto">
                      Our Lekki &amp; VI Concierge team has received your booking for{' '}
                      <span className="font-semibold text-text-primary">
                        {bookingForm.service}
                      </span>{' '}
                      on <span className="font-semibold">{bookingForm.date}</span> (
                      {bookingForm.location}). We&apos;ll send your confirmation on
                      WhatsApp shortly.
                    </p>
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={closeOverlay}
                        className="px-8 py-4 rounded-full bg-brand-primary text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:brightness-110 transition-all"
                      >
                        Return to Boutique
                      </button>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={handleBookingSubmit}
                    className="bg-brand-accent/30 p-8 md:p-12 rounded-[32px] border border-brand-primary/15 space-y-6"
                  >
                    <div>
                      <p className="italic-style text-2xl text-brand-primary">
                        {activeBookingForm === 'grooming'
                          ? 'Tropical Spa & Coat Sanctuary'
                          : '24/7 AC Boarding & Gate-to-Gate Concierge'}
                      </p>
                      <h3 className="font-display text-3xl font-bold text-text-primary mt-1">
                        Book Your Pet&apos;s Soft Life Session
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-primary mb-2">
                          Pet&apos;s Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., Simba, Zoe, Duke"
                          value={bookingForm.petName}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, petName: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-2xl bg-white border border-brand-primary/20 text-sm focus:outline-none focus:border-brand-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-primary mb-2">
                          Breed &amp; Size
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Lhasa Apso, Frenchie, Boerboel"
                          value={bookingForm.petBreed}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, petBreed: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-2xl bg-white border border-brand-primary/20 text-sm focus:outline-none focus:border-brand-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-primary mb-2">
                          Your Name &amp; WhatsApp Number *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., Tunde · 0803 000 0000"
                          value={bookingForm.ownerName}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, ownerName: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-2xl bg-white border border-brand-primary/20 text-sm focus:outline-none focus:border-brand-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-primary mb-2">
                          Preferred Lounge / Pickup Area *
                        </label>
                        <select
                          value={bookingForm.location}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, location: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-2xl bg-white border border-brand-primary/20 text-sm focus:outline-none focus:border-brand-primary"
                        >
                          <option value="Lekki Phase 1, Lagos">Lekki Phase 1, Lagos</option>
                          <option value="Victoria Island / Ikoyi, Lagos">
                            Victoria Island / Ikoyi, Lagos
                          </option>
                          <option value="Ikeja GRA / Maryland, Lagos">
                            Ikeja GRA / Maryland, Lagos
                          </option>
                          <option value="Maitama / Wuse II, Abuja">
                            Maitama / Wuse II, Abuja
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-primary mb-2">
                          Selected Experience
                        </label>
                        <select
                          value={bookingForm.service}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, service: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-2xl bg-white border border-brand-primary/20 text-sm focus:outline-none focus:border-brand-primary"
                        >
                          <option value="Full Tropical Spa Bath, Tick Defense & Styling (₦35,000)">
                            Full Tropical Spa Bath &amp; Tick Defense (₦35,000)
                          </option>
                          <option value="Mobile AC Grooming Van at Your Gate (₦55,000)">
                            Mobile AC Grooming Van at Your Gate (₦55,000)
                          </option>
                          <option value="24/7 AC Luxury Boarding Suite + WhatsApp Updates (₦45,000/night)">
                            24/7 AC Luxury Boarding Suite (₦45,000/night)
                          </option>
                          <option value="Heavy-Breed K9 De-Shedding & Conditioning (₦42,000)">
                            Big-Breed K9 De-Shedding &amp; Coat Shine (₦42,000)
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-primary mb-2">
                          Preferred Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={bookingForm.date}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, date: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-2xl bg-white border border-brand-primary/20 text-sm focus:outline-none focus:border-brand-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-primary mb-2">
                        Special Instructions (Estate Gate Code, Diet, Temperament)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Let us know if we need an estate call-in code, or share any diet/skin notes..."
                        value={bookingForm.notes}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, notes: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-2xl bg-white border border-brand-primary/20 text-sm focus:outline-none focus:border-brand-primary"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-full bg-brand-primary text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:brightness-110 transition-all"
                    >
                      Confirm Slot &amp; Send WhatsApp Alert
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        <div className="relative w-full">
          <div className="absolute inset-0 bg-pattern-overlay pointer-events-none z-0"></div>

          <section className="relative z-10 max-w-[1505px] mx-auto py-12 px-4">
            <div className="flex flex-col md:flex-row w-full min-h-[689px] border-t border-brand-primary/10 pt-4">
              {/* Left Column: Image Slider */}
              <div
                className="w-full md:w-[32%] h-[689px] overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none relative"
                id="hero-slider-left"
              >
                {HERO_LEFT_IMAGES.map((img, idx) => (
                  <img
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    referrerPolicy="no-referrer"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                      idx === leftSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  />
                ))}
              </div>

              {/* Center Column: Text Content */}
              <div className="w-full md:w-[36%] h-[689px] bg-brand-accent flex flex-col items-center justify-center px-10 text-center relative overflow-hidden">
                <div
                  ref={parallaxTextRef}
                  id="parallax-text-container"
                  className="space-y-10 will-change-transform"
                >
                  <span className="text-brand-primary font-bold tracking-widest uppercase text-sm block">
                    Lagos · Abuja · VIP Pet Care
                  </span>
                  <h2
                    className="text-3xl lg:text-4xl font-display font-bold leading-tight text-brand-primary max-w-[380px]"
                    data-animation-on-scroll=""
                  >
                    Premium Soft Life For Your Furry Best Friends
                  </h2>
                  <p
                    className="text-text-secondary text-lg max-w-[330px] mx-auto"
                    data-animation-on-scroll=""
                  >
                    From medicated tropical spa baths and 24/7 AC boarding to authentic
                    imported treats—delivered straight to your gate.
                  </p>
                  <div className="flex justify-center">
                    <a
                      href="#services-shop"
                      onClick={(e) => scrollToSection(e, '#services-shop')}
                      className="inline-flex items-center justify-center w-[190px] h-[54px] bg-brand-primary text-white text-[16px] font-bold hover:bg-white hover:text-brand-primary border-2 border-brand-primary transition-all duration-300 shadow-lg rounded-full"
                      data-animation-on-scroll=""
                    >
                      Explore Boutique
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Image Slider */}
              <div
                className="w-full md:w-[32%] h-[689px] overflow-hidden rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none relative"
                id="hero-slider-right"
              >
                {HERO_RIGHT_IMAGES.map((img, idx) => (
                  <img
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    referrerPolicy="no-referrer"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                      idx === rightSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Merged Services & Boutique Section */}
        <section id="services-shop" className="py-24 px-6 bg-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto">
            {/* Header Bar */}
            <div
              className="bg-brand-accent rounded-[20px] px-8 py-4 flex flex-col md:flex-row justify-between items-center text-brand-primary font-display font-bold text-sm tracking-widest uppercase mb-6"
              data-animation-on-scroll=""
            >
              <span>Lekki Phase 1 · Victoria Island · Ikeja GRA · Maitama</span>
              <button
                type="button"
                onClick={() => openOverlay('grooming')}
                className="hover:underline mt-2 md:mt-0 uppercase tracking-widest font-bold"
              >
                Book Spa or Boarding
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_340px] gap-6 items-stretch">
              {/* Left: Services Features List */}
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 h-full">
                {/* Feature 1 */}
                <div
                  onClick={() => openOverlay('grooming')}
                  className="bg-brand-accent/30 rounded-[24px] p-6 flex flex-col justify-between h-full min-h-[180px] group hover:bg-brand-accent transition-colors duration-300"
                  data-animation-on-scroll=""
                >
                  <div className="text-brand-primary text-2xl mb-4 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-display text-base leading-tight mb-2 uppercase font-bold text-text-primary">
                      Tropical Spa &amp;
                      <br />
                      Tick Defense
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Deep-cleansing medicated baths, fluff blowouts &amp; tick protection
                      formulated for Naija weather.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div
                  onClick={() => openOverlay('concierge')}
                  className="bg-brand-accent/30 rounded-[24px] p-6 flex flex-col justify-between h-full min-h-[180px] group hover:bg-brand-accent transition-colors duration-300"
                  data-animation-on-scroll=""
                >
                  <div className="text-brand-primary text-2xl mb-4 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-display text-base leading-tight mb-2 uppercase font-bold text-text-primary">
                      24/7 AC
                      <br />
                      Boarding
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Uninterrupted solar &amp; inverter AC suites with daily WhatsApp
                      video updates while you travel.
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div
                  onClick={() => openOverlay('grooming')}
                  className="bg-brand-accent/30 rounded-[24px] p-6 flex flex-col justify-between h-full min-h-[180px] group hover:bg-brand-accent transition-colors duration-300"
                  data-animation-on-scroll=""
                >
                  <div className="text-brand-primary text-2xl mb-4 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-display text-base leading-tight mb-2 uppercase font-bold text-text-primary">
                      Toy &amp; Big-Breed
                      <br />
                      Wellness
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Expert care for Lhasa Apsos, Frenchies, Boerboels &amp; GSDs—from
                      coat shine to joint nutrition.
                    </p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div
                  onClick={() => openOverlay('concierge')}
                  className="bg-brand-accent/30 rounded-[24px] p-6 flex flex-col justify-between h-full min-h-[180px] group hover:bg-brand-accent transition-colors duration-300"
                  data-animation-on-scroll=""
                >
                  <div className="text-brand-primary text-2xl mb-4 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-display text-base leading-tight mb-2 uppercase font-bold text-text-primary">
                      Mobile Van &amp;
                      <br />
                      Express Dispatch
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Skip Third Mainland &amp; Lekki traffic—we groom at your gate and
                      deliver supplies same-day.
                    </p>
                  </div>
                </div>
              </div>

              {/* Center: Illustration/Featured Image */}
              <div
                className="bg-brand-accent rounded-[32px] overflow-hidden relative min-h-[400px] h-full group"
                data-animation-on-scroll=""
              >
                <img
                  src="https://images.pexels.com/photos/6816858/pexels-photo-6816858.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  alt="Pet Spa Day in Lagos"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/50 to-transparent"></div>
                <div className="absolute bottom-10 left-10 right-10 text-white">
                  <p className="italic-style text-2xl mb-2">
                    Zero stress. Pure pampering.
                  </p>
                  <h3 className="font-display text-4xl font-bold uppercase">
                    The Naija Soft Life Standard
                  </h3>
                </div>
              </div>

              {/* Right: Boutique Shop Highlights */}
              <div className="flex flex-col gap-4 h-full">
                {PRODUCTS.map((product) => (
                  <div
                    key={product.id}
                    className="bg-brand-accent/20 rounded-[24px] p-6 flex items-center gap-6 flex-1 group hover:bg-brand-accent/40 transition-all"
                    data-animation-on-scroll=""
                  >
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-white flex-shrink-0 shadow-md">
                      <img
                        src={product.image}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        alt={product.name}
                      />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold uppercase text-text-primary">
                        {product.name}
                      </h4>
                      <p className="text-xs text-brand-primary font-bold mt-1 tabular-nums">
                        {formatNaira(product.price)}
                      </p>
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        className="text-[10px] uppercase tracking-widest font-bold mt-2 hover:text-brand-primary transition-colors"
                      >
                        Add to Bag +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Innovative Journey Section (Horizontal Scroll) */}
        <section id="journey-section" className="relative bg-white">
          <div
            ref={journeyScrollContainerRef}
            className="journey-scroll-container h-[300vh] relative"
          >
            <div className="sticky top-0 h-screen overflow-hidden flex items-center">
              <div
                ref={journeyTrackRef}
                className="journey-track flex items-center px-[5vw] gap-[10vw] will-change-transform h-full"
              >
                {/* Intro Step */}
                <div className="journey-step flex-shrink-0 w-[70vw] md:w-[45vw] max-w-3xl">
                  <div className="space-y-6">
                    <span className="text-brand-primary font-bold tracking-[0.2em] uppercase text-xs block">
                      Chapter I · Lagos
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary leading-tight">
                      Born in Lekki Phase 1.
                    </h2>
                    <p className="text-text-secondary text-lg md:text-xl leading-relaxed max-w-2xl">
                      In 2016, Dr. Teniola Adeyemi noticed a huge gap for Nigerian pet
                      parents—finding clean, cage-free grooming and trustworthy boarding
                      when traveling out of town. Paws &amp; Whiskers started with one
                      simple promise: our pets are family, and they deserve the soft life
                      too.
                    </p>
                    <div className="flex items-center gap-4 text-brand-primary font-bold">
                      <span className="text-3xl tabular-nums">2016</span>
                      <div className="w-24 h-[2px] bg-brand-primary"></div>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="journey-step flex-shrink-0 w-[75vw] md:w-[55vw] flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-1/2 aspect-square rounded-[32px] overflow-hidden shadow-xl">
                    <img
                      src="https://images.pexels.com/photos/6816858/pexels-photo-6816858.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="Master Grooming in Lagos"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-full md:w-1/2 space-y-4">
                    <span className="text-brand-primary font-bold tracking-[0.2em] uppercase text-xs block">
                      Chapter II · Wellness
                    </span>
                    <h3 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
                      Built for Naija Weather &amp; Coats.
                    </h3>
                    <p className="text-text-secondary text-base leading-relaxed">
                      By 2019, we pioneered our &quot;Calm-First, Zero-Tick&quot; spa
                      protocol. We traded cramped metal cages for 24/7 air-conditioned
                      suites and formulated natural botanical washes that protect coats
                      through Lagos humidity and dry Harmattan dust.
                    </p>
                    <div className="flex items-center gap-4 text-brand-primary font-bold">
                      <span className="text-3xl tabular-nums">2019</span>
                      <div className="w-24 h-[2px] bg-brand-primary"></div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="journey-step flex-shrink-0 w-[75vw] md:w-[55vw] flex flex-col md:flex-row-reverse items-center gap-8">
                  <div className="w-full md:w-1/2 aspect-square rounded-[32px] overflow-hidden shadow-xl">
                    <img
                      src="https://images.pexels.com/photos/5435552/pexels-photo-5435552.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="Boutique Shop"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-full md:w-1/2 space-y-4">
                    <span className="text-brand-primary font-bold tracking-[0.2em] uppercase text-xs block">
                      Chapter III · The Boutique
                    </span>
                    <h3 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
                      No More Waiting on London Luggage.
                    </h3>
                    <p className="text-text-secondary text-base leading-relaxed">
                      Getting authentic, top-grade pet gear in Nigeria used to mean
                      begging a friend flying back from London or Houston. We stocked our
                      boutique with genuine collars, orthopedic beds, and organic
                      supplements ready for same-day dispatch.
                    </p>
                    <div className="flex items-center gap-4 text-brand-primary font-bold">
                      <span className="text-3xl tabular-nums">2022</span>
                      <div className="w-24 h-[2px] bg-brand-primary"></div>
                    </div>
                  </div>
                </div>

                {/* Conclusion Step */}
                <div className="journey-step flex-shrink-0 w-[70vw] md:w-[45vw] pr-[5vw]">
                  <div className="bg-brand-accent p-10 md:p-14 rounded-[32px] boutique-border space-y-6 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl"></div>
                    <span className="text-brand-primary font-bold tracking-[0.2em] uppercase text-xs block">
                      Today · Island, Mainland &amp; Abuja
                    </span>
                    <h3 className="font-display text-3xl md:text-4xl font-bold text-brand-primary">
                      Nigeria&apos;s Premier Pet Circle.
                    </h3>
                    <p className="text-text-secondary text-lg">
                      From Ikoyi and Ikeja GRA to Maitama, thousands of Nigerian homes
                      trust Paws &amp; Whiskers with their Frenchies, Lhasa Apsos,
                      Boerboels, and Persians.
                    </p>
                    <button
                      type="button"
                      onClick={() => openOverlay()}
                      className="inline-flex items-center gap-3 bg-brand-primary text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                    >
                      Join the P&amp;W Family
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Innovative Vertical Testimonials Section */}
        <section
          id="testimonials-section"
          className="py-24 bg-brand-accent/30 overflow-hidden relative"
        >
          {/* Title Area */}
          <div
            className="flex flex-col items-center gap-8 max-w-7xl mx-auto px-6 z-10 text-center mb-16"
            data-animation-on-scroll=""
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-brand-primary/10 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-3.5 h-3.5 text-brand-primary fill-current"
                    viewBox="0 0 256 256"
                  >
                    <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                  </svg>
                ))}
              </div>
              <span className="font-display font-bold text-sm text-text-primary tracking-widest uppercase">
                5.0 Rated · Lagos &amp; Abuja
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-[1.1] tracking-tighter text-text-primary max-w-[700px]">
              Voices from the P&amp;W Family
            </h2>
          </div>

          {/* Vertical Scrolling Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-7xl mx-auto h-[700px] mask-testimonial px-6">
            {/* Column 1 (Scroll Up) */}
            <div className="relative overflow-hidden h-full">
              <ul className="flex flex-col gap-4 animate-scroll-v hover:[animation-play-state:paused]">
                <li className="p-8 bg-white rounded-boutique h-[260px] flex flex-col justify-between shadow-sm border border-brand-primary/5">
                  <p className="text-sm text-text-secondary leading-relaxed italic">
                    &quot;Traveling for December Detty December used to stress me out
                    until I found P&amp;W. They sent me WhatsApp videos of Zoe in her AC
                    suite every single morning!&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.pexels.com/photos/9883386/pexels-photo-9883386.jpeg?w=100&h=100&fit=crop"
                      alt="Chidinma Okonkwo"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-sm text-text-primary">
                        Chidinma Okonkwo
                      </p>
                      <p className="text-xs text-brand-primary font-bold uppercase tracking-widest">
                        Zoe&apos;s Mum · Lekki Phase 1
                      </p>
                    </div>
                  </div>
                </li>
                <li className="p-8 bg-white rounded-boutique h-[260px] flex flex-col justify-between shadow-sm border border-brand-primary/5">
                  <p className="text-sm text-text-secondary leading-relaxed italic">
                    &quot;Finally a pet store in Lagos where the treats and collars are
                    100% genuine. The dispatch rider delivered to my office in VI in under
                    an hour.&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?w=100&h=100&fit=crop"
                      alt="Tunde Bakare"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-sm text-text-primary">Tunde Bakare</p>
                      <p className="text-xs text-brand-primary font-bold uppercase tracking-widest">
                        Simba&apos;s Human · Victoria Island
                      </p>
                    </div>
                  </div>
                </li>
                {/* Loop */}
                <li className="p-8 bg-white rounded-boutique h-[260px] flex flex-col justify-between shadow-sm border border-brand-primary/5">
                  <p className="text-sm text-text-secondary leading-relaxed italic">
                    &quot;Traveling for December Detty December used to stress me out
                    until I found P&amp;W. They sent me WhatsApp videos of Zoe in her AC
                    suite every single morning!&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.pexels.com/photos/9883386/pexels-photo-9883386.jpeg?w=100&h=100&fit=crop"
                      alt="Chidinma Okonkwo"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-sm text-text-primary">
                        Chidinma Okonkwo
                      </p>
                      <p className="text-xs text-brand-primary font-bold uppercase tracking-widest">
                        Zoe&apos;s Mum · Lekki Phase 1
                      </p>
                    </div>
                  </div>
                </li>
                <li className="p-8 bg-white rounded-boutique h-[260px] flex flex-col justify-between shadow-sm border border-brand-primary/5">
                  <p className="text-sm text-text-secondary leading-relaxed italic">
                    &quot;Finally a pet store in Lagos where the treats and collars are
                    100% genuine. The dispatch rider delivered to my office in VI in under
                    an hour.&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?w=100&h=100&fit=crop"
                      alt="Tunde Bakare"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-sm text-text-primary">Tunde Bakare</p>
                      <p className="text-xs text-brand-primary font-bold uppercase tracking-widest">
                        Simba&apos;s Human · Victoria Island
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 2 (Scroll Down / Reverse) */}
            <div className="relative overflow-hidden h-full">
              <ul className="flex flex-col gap-4 animate-scroll-v-reverse hover:[animation-play-state:paused]">
                <li className="p-8 bg-brand-accent rounded-boutique h-[260px] flex flex-col justify-between shadow-sm border border-brand-primary/20">
                  <p className="text-sm text-text-primary leading-relaxed font-bold">
                    &quot;Handling two adult Boerboels is no joke, but P&amp;W&apos;s
                    handlers are calm pros. My boys always come home smelling fresh with
                    zero ticks.&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.pexels.com/photos/1181691/pexels-photo-1181691.jpeg?w=100&h=100&fit=crop"
                      alt="Babajide Balogun"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-sm text-text-primary">
                        Babajide Balogun
                      </p>
                      <p className="text-xs text-brand-primary uppercase font-bold tracking-widest">
                        Duke &amp; Titan · Ikeja GRA
                      </p>
                    </div>
                  </div>
                </li>
                <li
                  onClick={() => openOverlay('grooming')}
                  className="relative rounded-boutique h-[260px] overflow-hidden group"
                >
                  <img
                    src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Ikoyi & VI Pack Club"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-brand-primary/20 flex items-end p-6">
                    <span className="text-white font-display font-bold uppercase tracking-widest text-xs">
                      Ikoyi &amp; VI Pack Club
                    </span>
                  </div>
                </li>
                {/* Loop */}
                <li className="p-8 bg-brand-accent rounded-boutique h-[260px] flex flex-col justify-between shadow-sm border border-brand-primary/20">
                  <p className="text-sm text-text-primary leading-relaxed font-bold">
                    &quot;Handling two adult Boerboels is no joke, but P&amp;W&apos;s
                    handlers are calm pros. My boys always come home smelling fresh with
                    zero ticks.&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.pexels.com/photos/1181691/pexels-photo-1181691.jpeg?w=100&h=100&fit=crop"
                      alt="Babajide Balogun"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-sm text-text-primary">
                        Babajide Balogun
                      </p>
                      <p className="text-xs text-brand-primary uppercase font-bold tracking-widest">
                        Duke &amp; Titan · Ikeja GRA
                      </p>
                    </div>
                  </div>
                </li>
                <li className="relative rounded-boutique h-[260px] overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Ikoyi & VI Pack Club"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </li>
              </ul>
            </div>

            {/* Column 3 (Scroll Up) */}
            <div className="relative overflow-hidden h-full hidden md:block">
              <ul className="flex flex-col gap-4 animate-scroll-v hover:[animation-play-state:paused]">
                <li className="p-8 bg-white rounded-boutique h-[260px] flex flex-col justify-between shadow-sm border border-brand-primary/5">
                  <p className="text-sm text-text-secondary leading-relaxed italic">
                    &quot;Their mobile grooming van pulled up to our estate in Ikoyi on
                    time, full AC running, and pampered our Pomeranian without us fighting
                    traffic.&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=100&h=100&fit=crop"
                      alt="Seyi & Kemi Williams"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-sm text-text-primary">
                        Seyi &amp; Kemi Williams
                      </p>
                      <p className="text-xs text-brand-primary font-bold uppercase tracking-widest">
                        Coco&apos;s Parents · Old Ikoyi
                      </p>
                    </div>
                  </div>
                </li>
                <li className="p-8 bg-brand-primary rounded-boutique h-[260px] flex flex-col justify-center items-center text-center text-white">
                  <span className="italic-style text-3xl mb-3">P&amp;W</span>
                  <p className="font-display font-bold uppercase tracking-widest text-sm">
                    Nigeria&apos;s #1 Luxury Pet Care
                  </p>
                </li>
                {/* Loop */}
                <li className="p-8 bg-white rounded-boutique h-[260px] flex flex-col justify-between shadow-sm border border-brand-primary/5">
                  <p className="text-sm text-text-secondary leading-relaxed italic">
                    &quot;Their mobile grooming van pulled up to our estate in Ikoyi on
                    time, full AC running, and pampered our Pomeranian without us fighting
                    traffic.&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=100&h=100&fit=crop"
                      alt="Seyi & Kemi Williams"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-sm text-text-primary">
                        Seyi &amp; Kemi Williams
                      </p>
                      <p className="text-xs text-brand-primary font-bold uppercase tracking-widest">
                        Coco&apos;s Parents · Old Ikoyi
                      </p>
                    </div>
                  </div>
                </li>
                <li className="p-8 bg-brand-primary h-[260px] rounded-boutique flex items-center justify-center text-white font-display font-bold">
                  SOFT LIFE GENG
                </li>
              </ul>
            </div>

            {/* Column 4 (Scroll Down) */}
            <div className="relative overflow-hidden h-full hidden lg:block">
              <ul className="flex flex-col gap-4 animate-scroll-v-reverse hover:[animation-play-state:paused]">
                <li className="p-8 bg-white rounded-boutique h-[260px] flex flex-col justify-between shadow-sm border border-brand-primary/5">
                  <p className="text-sm text-text-secondary leading-relaxed italic">
                    &quot;The salmon coat chews and cooling bed saved my Lhasa Apso
                    during Harmattan in Abuja. Her coat is super soft and zero
                    scratching.&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.pexels.com/photos/1181682/pexels-photo-1181682.jpeg?w=100&h=100&fit=crop"
                      alt="Zainab Danjuma"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-sm text-text-primary">
                        Zainab Danjuma
                      </p>
                      <p className="text-xs text-brand-primary font-bold uppercase tracking-widest">
                        Bella&apos;s Mum · Maitama, Abuja
                      </p>
                    </div>
                  </div>
                </li>
                <li
                  onClick={() => openOverlay('concierge')}
                  className="relative rounded-boutique h-[260px] overflow-hidden group"
                >
                  <img
                    src="https://images.pexels.com/photos/16623514/pexels-photo-16623514/free-photo-of-cat-in-a-cat-tree.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Lumina Feline Lounge"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex flex-col justify-between p-6">
                    <div className="flex justify-end">
                      <span className="italic-style text-white text-xl">eko.</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Lumina Feline Suite</p>
                      <p className="text-white/70 text-[10px] uppercase font-bold tracking-widest">
                        Persian &amp; Exotic Cat Lounge
                      </p>
                    </div>
                  </div>
                </li>
                {/* Loop */}
                <li className="p-8 bg-white rounded-boutique h-[260px] flex flex-col justify-between shadow-sm border border-brand-primary/5">
                  <p className="text-sm text-text-secondary leading-relaxed italic">
                    &quot;The salmon coat chews and cooling bed saved my Lhasa Apso
                    during Harmattan in Abuja. Her coat is super soft and zero
                    scratching.&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.pexels.com/photos/1181682/pexels-photo-1181682.jpeg?w=100&h=100&fit=crop"
                      alt="Zainab Danjuma"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-sm text-text-primary">
                        Zainab Danjuma
                      </p>
                      <p className="text-xs text-brand-primary font-bold uppercase tracking-widest">
                        Bella&apos;s Mum · Maitama, Abuja
                      </p>
                    </div>
                  </div>
                </li>
                <li className="relative rounded-boutique h-[260px] overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/16623514/pexels-photo-16623514/free-photo-of-cat-in-a-cat-tree.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Lumina Feline Suite"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Integrated Footer & CTA "Canvas" Section */}
      <footer
        id="contact-footer"
        className="bg-neutral-background pt-24 pb-12 md:pt-32 md:pb-16 px-4 md:px-8"
      >
        <div className="max-w-[1200px] mx-auto relative">
          {/* Main Brand Card */}
          <div className="relative w-full bg-brand-primary rounded-[32px] md:rounded-[48px] flex flex-col items-start justify-between px-8 md:px-16 pt-12 md:pt-16 pb-10 md:pb-12 overflow-hidden shadow-2xl z-10 min-h-[400px] md:min-h-[480px]">
            <div className="absolute inset-0 bg-pattern-overlay opacity-10"></div>

            {/* Brand Identity */}
            <div className="w-full flex justify-between items-start relative z-20">
              <div>
                <a
                  href="/"
                  onClick={(e) => scrollToSection(e, '/')}
                  className="block"
                >
                  <div className="font-display text-4xl md:text-5xl font-bold text-white leading-none tracking-tightest uppercase">
                    P&amp;W.
                  </div>
                  <div className="text-[10px] font-bold text-white/70 uppercase tracking-[0.3em] mt-3">
                    LAGOS · ABUJA · EST. MMXVI
                  </div>
                </a>
              </div>
            </div>

            {/* Spacer for height */}
            <div className="flex-grow"></div>

            {/* Giant Jumping Typography */}
            <div className="absolute inset-x-0 bottom-4 md:bottom-6 px-8 md:px-16 pointer-events-none z-0">
              <h1 className="text-[90px] sm:text-[120px] md:text-[clamp(90px,16vw,180px)] font-bold text-white/15 leading-[0.8] tracking-tighter select-none animate-jump flex gap-[0.02em]">
                <span>P</span>
                <span>A</span>
                <span>W</span>
                <span>S</span>
                <span>.</span>
              </h1>
            </div>

            {/* Legal & Copy */}
            <div className="relative z-20 w-full flex flex-col md:flex-row justify-between items-end gap-4 mt-8">
              <p className="text-white/60 text-xs font-medium uppercase tracking-widest">
                © 2026 Paws &amp; Whiskers Nigeria Ltd
              </p>
              <div className="flex gap-6">
                <a
                  href="#services-shop"
                  onClick={(e) => scrollToSection(e, '#services-shop')}
                  className="text-white/60 hover:text-white transition-colors text-xs font-medium uppercase tracking-widest"
                >
                  Lekki Lounge
                </a>
                <a
                  href="#services-shop"
                  onClick={(e) => scrollToSection(e, '#services-shop')}
                  className="text-white/60 hover:text-white transition-colors text-xs font-medium uppercase tracking-widest"
                >
                  Maitama Lounge
                </a>
              </div>
            </div>
          </div>

          {/* Overlapping Floating Contact Card */}
          <div
            data-animation-on-scroll=""
            className="mt-6 md:mt-0 md:absolute md:-top-16 right-4 md:right-8 w-full md:w-[480px] bg-brand-accent rounded-[32px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] p-8 md:p-12 z-40 border border-brand-primary/20"
          >
            <div className="flex flex-col gap-10">
              {/* Navigation Links */}
              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col gap-4">
                  <h5 className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em]">
                    The Circle
                  </h5>
                  <ul className="flex flex-col gap-2.5">
                    <li>
                      <a
                        href="#services-shop"
                        onClick={(e) => scrollToSection(e, '#services-shop')}
                        className="text-sm font-bold text-text-primary hover:text-brand-primary transition-colors"
                      >
                        Spa &amp; Boarding
                      </a>
                    </li>
                    <li>
                      <a
                        href="#services-shop"
                        onClick={(e) => scrollToSection(e, '#services-shop')}
                        className="text-sm font-bold text-text-primary hover:text-brand-primary transition-colors"
                      >
                        Boutique Shop
                      </a>
                    </li>
                    <li>
                      <a
                        href="#journey-section"
                        onClick={(e) => scrollToSection(e, '#journey-section')}
                        className="text-sm font-bold text-text-primary hover:text-brand-primary transition-colors"
                      >
                        Our Naija Story
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-4">
                  <h5 className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em]">
                    Connect
                  </h5>
                  <ul className="flex flex-col gap-2.5">
                    <li>
                      <button
                        type="button"
                        onClick={() => openOverlay('concierge')}
                        className="text-sm font-bold text-text-primary hover:text-brand-primary transition-colors"
                      >
                        WhatsApp Desk
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => openOverlay('concierge')}
                        className="text-sm font-bold text-text-primary hover:text-brand-primary transition-colors"
                      >
                        Instagram (@pawswhiskers.ng)
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => openOverlay('concierge')}
                        className="text-sm font-bold text-text-primary hover:text-brand-primary transition-colors"
                      >
                        Mobile Van Booking
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              {/* CTA Section */}
              <div className="w-full flex flex-col gap-6 border-t border-brand-primary/10 pt-8">
                <h5 className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em]">
                  VIP Inquiries
                </h5>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <p className="text-lg md:text-xl font-display font-bold text-text-primary leading-tight max-w-[210px]">
                    Ready to give your pet the soft life?
                  </p>
                  <button
                    type="button"
                    onClick={() => openOverlay()}
                    className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-full text-sm font-bold shadow-xl hover:brightness-110 hover:-translate-y-1 transition-all duration-300"
                  >
                    Book Visit
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        d="M7 17L17 7M17 7H7M17 7V17"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
