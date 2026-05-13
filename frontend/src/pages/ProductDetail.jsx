import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await productService.getOne(slug);
        setProduct(data.product);
        if (data.product.sizes?.length > 0) setSelectedSize(data.product.sizes[0]);
        if (data.product.colors?.length > 0) setSelectedColor(data.product.colors[0]);
      } catch {
        toast.error('Product not found.');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-24">
      <span className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return null;

  const price = product.discount_price || product.price;
  const original = product.discount_price ? product.price : null;
  const discountPct = original ? Math.round((1 - price / original) * 100) : 0;
  const images = product.images || [];
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please login to add items to cart.'); return; }
    if (product.stock < 1) { toast.error('Out of stock.'); return; }
    await addToCart(product.id, quantity, selectedSize, selectedColor);
  };

  const handleBuyNow = async () => {
    if (!user) { navigate('/login'); return; }
    await addToCart(product.id, quantity, selectedSize, selectedColor);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 font-body mb-8">
          <button onClick={() => navigate('/')} className="hover:text-gold transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/products')} className="hover:text-gold transition-colors">Products</button>
          <span>/</span>
          <span className="text-obsidian">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* Images */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex flex-col gap-3 w-16 flex-shrink-0">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-gold' : 'border-transparent'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="flex-1 relative aspect-[3/4] overflow-hidden bg-gray-50">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={images[selectedImage] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discountPct > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1">-{discountPct}%</span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {product.brand && (
              <p className="text-xs font-body font-medium tracking-[0.2em] text-gold uppercase mb-2">{product.brand}</p>
            )}
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-obsidian mb-4">{product.name}</h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-display text-3xl font-bold text-obsidian">
                ₹{parseFloat(price).toLocaleString('en-IN')}
              </span>
              {original && (
                <span className="text-lg text-gray-400 line-through font-body">
                  ₹{parseFloat(original).toLocaleString('en-IN')}
                </span>
              )}
              {discountPct > 0 && (
                <span className="text-sm text-green-600 font-body font-medium">{discountPct}% off</span>
              )}
            </div>

            {/* Stock */}
            <p className={`text-sm font-body mb-6 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </p>

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-body font-semibold uppercase tracking-widest text-obsidian mb-3">
                  Size: <span className="text-gold">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-xs font-body border transition-colors ${
                        selectedSize === size
                          ? 'bg-obsidian text-ivory border-obsidian'
                          : 'border-gray-200 hover:border-gold hover:text-gold'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-body font-semibold uppercase tracking-widest text-obsidian mb-3">
                  Color: <span className="text-gold">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-xs font-body border transition-colors ${
                        selectedColor === color
                          ? 'bg-obsidian text-ivory border-obsidian'
                          : 'border-gray-200 hover:border-gold hover:text-gold'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-xs font-body font-semibold uppercase tracking-widest text-obsidian mb-3">Quantity</p>
              <div className="flex items-center gap-0 border border-gray-200 w-fit">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-lg"
                >−</button>
                <span className="w-12 text-center text-sm font-body font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-lg"
                >+</button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock < 1}
                className="btn-primary flex-1 !py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.stock < 1 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock < 1}
                className="btn-gold flex-1 !py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-14 h-14 border flex items-center justify-center transition-colors ${
                  inWishlist ? 'border-red-400 text-red-500' : 'border-gray-200 hover:border-gold hover:text-gold'
                }`}
              >
                <svg className={`w-5 h-5 ${inWishlist ? 'fill-red-500' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="1.5"/>
                </svg>
              </button>
            </div>

            {/* Description */}
            {product.description && (
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-xs font-body font-semibold uppercase tracking-widest text-obsidian mb-3">Description</h3>
                <p className="text-sm text-gray-600 font-body leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Category */}
            <div className="border-t border-gray-100 pt-4 mt-4">
              <p className="text-xs text-gray-400 font-body">
                Category: <span className="text-obsidian">{product.category_name}</span>
              </p>
              {product.sku && (
                <p className="text-xs text-gray-400 font-body mt-1">
                  SKU: <span className="text-obsidian">{product.sku}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
