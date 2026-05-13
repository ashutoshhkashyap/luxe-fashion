import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productService, categoryService } from '../services/api';
import ProductCard from '../components/ProductCard';

const Skeleton = () => (
  <div className="group">
    <div className="aspect-[3/4] skeleton mb-3" />
    <div className="h-3 skeleton w-1/3 mb-2" />
    <div className="h-4 skeleton w-2/3 mb-2" />
    <div className="h-3 skeleton w-1/4" />
  </div>
);

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [pagination,  setPagination]  = useState({});
  const [loading,     setLoading]     = useState(true);
  const [filterOpen,  setFilterOpen]  = useState(false);

  const category   = searchParams.get('category')   || '';
  const search     = searchParams.get('search')     || '';
  const sort       = searchParams.get('sort')       || 'created_at';
  const order      = searchParams.get('order')      || 'desc';
  const featured   = searchParams.get('featured')   || '';
  const trending   = searchParams.get('trending')   || '';
  const bestseller = searchParams.get('bestseller') || '';
  const page       = parseInt(searchParams.get('page') || '1');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (category)   params.category   = category;
      if (search)     params.search     = search;
      if (sort)       params.sort       = sort;
      if (order)      params.order      = order;
      if (featured)   params.featured   = featured;
      if (trending)   params.trending   = trending;
      if (bestseller) params.bestseller = bestseller;

      const { data } = await productService.getAll(params);
      setProducts(data.products || []);
      setPagination(data.pagination || {});
    } catch {}
    finally { setLoading(false); }
  }, [category, search, sort, order, featured, trending, bestseller, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => {
    categoryService.getAll().then(({ data }) => setCategories(data.categories || []));
  }, []);

  const updateParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const clearFilters = () => setSearchParams({});

  const sortOptions = [
    { label: 'Newest',        sort: 'created_at', order: 'desc' },
    { label: 'Price: Low',    sort: 'price',       order: 'asc'  },
    { label: 'Price: High',   sort: 'price',       order: 'desc' },
    { label: 'Top Rated',     sort: 'rating',      order: 'desc' },
    { label: 'Name A–Z',      sort: 'name',        order: 'asc'  },
  ];

  const activeFiltersCount = [category, featured, trending, bestseller].filter(Boolean).length;

  const Filters = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="text-xs font-body font-semibold uppercase tracking-widest text-obsidian mb-4">Category</h3>
        <div className="space-y-2">
          <button
            onClick={() => updateParam('category', '')}
            className={`block w-full text-left text-sm font-body py-1.5 px-3 transition-colors ${!category ? 'bg-obsidian text-ivory' : 'hover:bg-gray-50 text-obsidian/70'}`}
          >
            All Products
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => updateParam('category', cat.slug)}
              className={`block w-full text-left text-sm font-body py-1.5 px-3 transition-colors ${category === cat.slug ? 'bg-obsidian text-ivory' : 'hover:bg-gray-50 text-obsidian/70'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-xs font-body font-semibold uppercase tracking-widest text-obsidian mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {[['Featured', 'featured', featured], ['Trending', 'trending', trending], ['Best Sellers', 'bestseller', bestseller]].map(([label, key, val]) => (
            <button
              key={key}
              onClick={() => updateParam(key, val === 'true' ? '' : 'true')}
              className={`text-xs font-body border px-3 py-1.5 transition-colors ${val === 'true' ? 'bg-gold text-obsidian border-gold' : 'border-gray-200 text-obsidian/60 hover:border-gold hover:text-gold'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const getTitle = () => {
    if (search)    return `Search: "${search}"`;
    if (category)  return categories.find(c => c.slug === category)?.name || category;
    if (featured === 'true')   return 'Featured Products';
    if (trending === 'true')   return 'Trending Products';
    if (bestseller === 'true') return 'Best Sellers';
    return 'All Products';
  };

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-obsidian">{getTitle()}</h1>
            {!loading && <p className="text-sm text-gray-400 font-body mt-1">{pagination.total || 0} products</p>}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <select
              value={`${sort}-${order}`}
              onChange={e => {
                const [s, o] = e.target.value.split('-');
                const p = new URLSearchParams(searchParams);
                p.set('sort', s); p.set('order', o); p.delete('page');
                setSearchParams(p);
              }}
              className="input-field !py-2 !px-3 text-xs w-36 md:w-44 cursor-pointer"
            >
              {sortOptions.map(o => (
                <option key={o.label} value={`${o.sort}-${o.order}`}>{o.label}</option>
              ))}
            </select>

            {/* Filter toggle (mobile) */}
            <button
              onClick={() => setFilterOpen(v => !v)}
              className="lg:hidden flex items-center gap-2 text-xs font-body font-medium border border-gray-200 px-3 py-2 hover:border-gold hover:text-gold transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Filter {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
          </div>
        </div>

        <div className="flex gap-8 lg:gap-12">
          {/* Sidebar filters - desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-semibold tracking-widest uppercase">Filters</h2>
                {activeFiltersCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-gold hover:underline">Clear all</button>
                )}
              </div>
              <Filters />
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {[...Array(12)].map((_, i) => <Skeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="py-24 text-center">
                <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 13h6m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="1.2"/>
                </svg>
                <h3 className="font-display text-xl text-obsidian mb-2">No Products Found</h3>
                <p className="text-sm text-gray-400 mb-6">Try adjusting your filters or search term.</p>
                <button onClick={clearFilters} className="btn-outline text-xs !py-2.5 !px-6">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                  {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    {[...Array(pagination.pages)].map((_, i) => {
                      const pg = i + 1;
                      return (
                        <button
                          key={pg}
                          onClick={() => { const p = new URLSearchParams(searchParams); p.set('page', pg); setSearchParams(p); }}
                          className={`w-9 h-9 text-sm font-body transition-colors ${pg === page ? 'bg-obsidian text-ivory' : 'border border-gray-200 hover:border-gold hover:text-gold'}`}
                        >
                          {pg}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setFilterOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-body font-semibold text-sm uppercase tracking-widest">Filters</h2>
                <button onClick={() => setFilterOpen(false)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <Filters />
              <button onClick={() => setFilterOpen(false)} className="btn-primary w-full mt-8 text-xs !py-3">Apply Filters</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;
