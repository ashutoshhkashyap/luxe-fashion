import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService, categoryService } from '../services/api';
import ProductCard from '../components/ProductCard';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
};

// ── Hero Section ─────────────────────────────────────────────
const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-obsidian">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600"
          alt="Hero"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/60 via-obsidian/40 to-obsidian/80" />
        {/* Gold accent lines */}
        <div className="absolute left-0 top-0 h-full w-1 bg-gold-gradient opacity-60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, letterSpacing: '0.4em' }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-gold text-xs font-body tracking-[0.4em] uppercase mb-6"
        >
          New Collection 2026
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="font-display text-6xl md:text-8xl lg:text-[100px] font-bold text-ivory leading-none mb-6"
        >
          Dress to
          <span className="block italic text-gold">Impress</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-ivory/60 text-lg md:text-xl font-body font-light max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Discover premium fashion crafted for those who demand the extraordinary.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => navigate('/products')}
            className="btn-gold text-sm !py-4 !px-10"
          >
            Shop the Collection
          </button>
          <button
            onClick={() => navigate('/products?trending=true')}
            className="btn-outline text-sm !py-4 !px-10 border-white/30 text-ivory hover:bg-white hover:text-obsidian"
          >
            View Trending
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
          className="flex items-center justify-center gap-8 mt-20 text-ivory/40"
        >
          {[['500+', 'Products'], ['50K+', 'Customers'], ['4.9★', 'Rating']].map(([val, label]) => (
            <div key={label} className="text-center">
              <div className="font-display text-2xl font-bold text-ivory">{val}</div>
              <div className="text-xs tracking-widest uppercase mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-ivory/30"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M19 9l-7 7-7-7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </section>
  );
};

// ── Category Cards ────────────────────────────────────────────
const CategorySection = ({ categories }) => (
  <section className="py-20 md:py-28 px-6 max-w-7xl mx-auto">
    <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
      <motion.div variants={fadeUp} className="text-center mb-12">
        <p className="text-[11px] tracking-[0.4em] text-gold uppercase font-body mb-3">Browse by</p>
        <h2 className="section-title">Shop Categories</h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categories.map((cat, i) => (
          <motion.div key={cat.id} variants={fadeUp}>
            <Link
              to={`/products?category=${cat.slug}`}
              className="group relative block overflow-hidden aspect-[3/4] bg-gray-100"
            >
              <img
                src={cat.image_url}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent group-hover:from-obsidian/90 transition-all duration-300" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-xl md:text-2xl font-semibold text-ivory">{cat.name}</h3>
                <p className="text-gold text-xs font-body tracking-widest uppercase mt-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Explore <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </section>
);

// ── Product Grid Section ──────────────────────────────────────
const ProductSection = ({ title, subtitle, products, linkTo }) => (
  <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto">
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
      <motion.div variants={fadeUp} className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[11px] tracking-[0.4em] text-gold uppercase font-body mb-2">{subtitle}</p>
          <h2 className="section-title">{title}</h2>
        </div>
        <Link to={linkTo} className="text-xs font-body font-medium tracking-widest uppercase text-obsidian/60 hover:text-gold transition-colors hidden md:flex items-center gap-1.5 group">
          View All
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>

      <motion.div variants={fadeUp} className="text-center mt-10 md:hidden">
        <Link to={linkTo} className="btn-outline text-xs !py-3 !px-8">View All</Link>
      </motion.div>
    </motion.div>
  </section>
);

// ── Banner Section ────────────────────────────────────────────
const MidBanner = () => (
  <section className="relative py-0 overflow-hidden">
    <div className="grid md:grid-cols-2 min-h-[400px]">
      <div className="relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=800" alt="Women" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-obsidian/40 flex items-center justify-center">
          <div className="text-center">
            <p className="font-display text-4xl font-bold text-ivory mb-4">Women's Edit</p>
            <Link to="/products?category=clothing" className="btn-gold text-xs !py-3 !px-8">Shop Now</Link>
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800" alt="Men" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-obsidian/40 flex items-center justify-center">
          <div className="text-center">
            <p className="font-display text-4xl font-bold text-ivory mb-4">Men's Edit</p>
            <Link to="/products?category=shoes" className="btn-gold text-xs !py-3 !px-8">Shop Now</Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ── Testimonials ──────────────────────────────────────────────
const TESTIMONIALS = [
  { name: 'Priya S.',  rating: 5, text: 'Absolutely love the quality! The oversized hoodie is exactly what I was looking for — premium fabric, great fit.', location: 'Mumbai' },
  { name: 'Rohan M.', rating: 5, text: 'The watches collection is stunning. Got the minimalist automatic and it\'s been getting compliments everywhere.', location: 'Delhi' },
  { name: 'Ananya K.',rating: 5, text: 'Super fast delivery and the packaging was beautiful. The tote bag is even more gorgeous in person!', location: 'Bangalore' },
];

const Testimonials = () => (
  <section className="py-20 md:py-28 bg-ivory">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
        <motion.div variants={fadeUp} className="text-center mb-12">
          <p className="text-[11px] tracking-[0.4em] text-gold uppercase font-body mb-3">What They Say</p>
          <h2 className="section-title">Customer Love</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} variants={fadeUp} className="bg-white p-8 shadow-card">
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, s) => (
                  <svg key={s} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-sm text-obsidian/70 leading-relaxed font-body mb-5 italic">"{t.text}"</p>
              <div>
                <p className="font-body font-semibold text-obsidian text-sm">{t.name}</p>
                <p className="text-xs text-gray-400 font-body">{t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// ── Main Home Component ───────────────────────────────────────
const Home = () => {
  const [featured,   setFeatured]   = useState([]);
  const [trending,   setTrending]   = useState([]);
  const [bestsellers,setBestsellers]= useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [featRes, trendRes, bestRes, catRes] = await Promise.all([
          productService.getAll({ featured: true, limit: 4 }),
          productService.getAll({ trending: true, limit: 4 }),
          productService.getAll({ bestseller: true, limit: 4 }),
          categoryService.getAll(),
        ]);
        setFeatured(featRes.data.products   || []);
        setTrending(trendRes.data.products  || []);
        setBestsellers(bestRes.data.products || []);
        setCategories(catRes.data.categories || []);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <Hero />
      <CategorySection categories={categories} />

      {featured.length > 0 && (
        <div className="bg-ivory">
          <ProductSection
            title="Featured Picks"
            subtitle="Editor's Choice"
            products={featured}
            linkTo="/products?featured=true"
          />
        </div>
      )}

      <MidBanner />

      {trending.length > 0 && (
        <ProductSection
          title="Trending Now"
          subtitle="What's Hot"
          products={trending}
          linkTo="/products?trending=true"
        />
      )}

      {bestsellers.length > 0 && (
        <div className="bg-ivory">
          <ProductSection
            title="Best Sellers"
            subtitle="Most Loved"
            products={bestsellers}
            linkTo="/products?bestseller=true"
          />
        </div>
      )}

      <Testimonials />

      {/* CTA Banner */}
      <section className="bg-obsidian py-20 text-center px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          <motion.p variants={fadeUp} className="text-[11px] tracking-[0.4em] text-gold uppercase font-body mb-4">Limited Time</motion.p>
          <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-6xl font-bold text-ivory mb-4">
            Get <span className="text-gold italic">15% Off</span> Your First Order
          </motion.h2>
          <motion.p variants={fadeUp} className="text-ivory/50 font-body mb-8">Use code <strong className="text-gold">LUXE15</strong> at checkout</motion.p>
          <motion.div variants={fadeUp}>
            <Link to="/register" className="btn-gold text-sm !py-4 !px-12">Create Account & Save</Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
