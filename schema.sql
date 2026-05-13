-- ============================================================
-- LUXE FASHION - Complete MySQL Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS luxe_fashion CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE luxe_fashion;

-- ============================================================
-- TABLE: categories
-- ============================================================
CREATE TABLE categories (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url   VARCHAR(500),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: users
-- ============================================================
CREATE TABLE users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone         VARCHAR(20),
  address       TEXT,
  avatar_url    VARCHAR(500),
  is_active     TINYINT(1) DEFAULT 1,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: admin
-- ============================================================
CREATE TABLE admin (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('super_admin','admin') DEFAULT 'admin',
  is_active     TINYINT(1) DEFAULT 1,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: products
-- ============================================================
CREATE TABLE products (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id   INT UNSIGNED NOT NULL,
  name          VARCHAR(255) NOT NULL,
  slug          VARCHAR(255) NOT NULL UNIQUE,
  description   TEXT,
  price         DECIMAL(10,2) NOT NULL,
  discount_price DECIMAL(10,2),
  stock         INT UNSIGNED DEFAULT 0,
  brand         VARCHAR(100),
  sku           VARCHAR(100) UNIQUE,
  images        JSON,
  sizes         JSON,
  colors        JSON,
  rating        DECIMAL(3,2) DEFAULT 0.00,
  review_count  INT UNSIGNED DEFAULT 0,
  is_featured   TINYINT(1) DEFAULT 0,
  is_trending   TINYINT(1) DEFAULT 0,
  is_bestseller TINYINT(1) DEFAULT 0,
  is_active     TINYINT(1) DEFAULT 1,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_category (category_id),
  INDEX idx_price (price),
  INDEX idx_featured (is_featured),
  INDEX idx_trending (is_trending),
  INDEX idx_active (is_active),
  FULLTEXT INDEX ft_search (name, description, brand)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: wishlist
-- ============================================================
CREATE TABLE wishlist (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  product_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_product (user_id, product_id),
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: cart
-- ============================================================
CREATE TABLE cart (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: cart_items
-- ============================================================
CREATE TABLE cart_items (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cart_id    INT UNSIGNED NOT NULL,
  product_id INT UNSIGNED NOT NULL,
  quantity   INT UNSIGNED DEFAULT 1,
  size       VARCHAR(20),
  color      VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_cart_product_variant (cart_id, product_id, size, color),
  FOREIGN KEY (cart_id)    REFERENCES cart(id)     ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_cart (cart_id)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: orders
-- ============================================================
CREATE TABLE orders (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_number    VARCHAR(20) NOT NULL UNIQUE,
  user_id         INT UNSIGNED NOT NULL,
  total_amount    DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  shipping_amount DECIMAL(10,2) DEFAULT 0.00,
  final_amount    DECIMAL(10,2) NOT NULL,
  status          ENUM('ordered','packed','shipped','delivered','cancelled') DEFAULT 'ordered',
  payment_method  ENUM('cod','online') DEFAULT 'cod',
  payment_status  ENUM('pending','paid','failed','refunded') DEFAULT 'pending',
  shipping_name   VARCHAR(150),
  shipping_phone  VARCHAR(20),
  shipping_address TEXT,
  shipping_city   VARCHAR(100),
  shipping_state  VARCHAR(100),
  shipping_pincode VARCHAR(10),
  notes           TEXT,
  ordered_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_user    (user_id),
  INDEX idx_status  (status),
  INDEX idx_ordered (ordered_at)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: order_items
-- ============================================================
CREATE TABLE order_items (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id     INT UNSIGNED NOT NULL,
  product_id   INT UNSIGNED NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_image VARCHAR(500),
  brand        VARCHAR(100),
  size         VARCHAR(20),
  color        VARCHAR(50),
  quantity     INT UNSIGNED NOT NULL,
  unit_price   DECIMAL(10,2) NOT NULL,
  total_price  DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  INDEX idx_order   (order_id),
  INDEX idx_product (product_id)
) ENGINE=InnoDB;

-- ============================================================
-- SEED DATA — Categories
-- ============================================================
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Clothing',     'clothing',     'Premium fashion clothing for men and women', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600'),
  ('Shoes',        'shoes',        'Designer footwear for every occasion',       'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'),
  ('Watches',      'watches',      'Luxury timepieces and smartwatches',         'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'),
  ('Accessories',  'accessories',  'Fashion bags, belts, scarves and more',      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600');

-- ============================================================
-- SEED DATA — Default Admin
-- Password: Admin@1234  (bcrypt hash)
-- ============================================================
INSERT INTO admin (name, email, password_hash, role) VALUES
  ('Super Admin', 'admin@luxefashion.com',
   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBpj2sLuH1j0m.',
   'super_admin');

-- ============================================================
-- SEED DATA — Sample Products
-- ============================================================
INSERT INTO products (category_id, name, slug, description, price, discount_price, stock, brand, sku, images, sizes, colors, rating, review_count, is_featured, is_trending, is_bestseller) VALUES
(1,'Premium Oversized Hoodie','premium-oversized-hoodie','Ultra-soft cotton blend oversized hoodie with minimalist design. Perfect for casual everyday wear.',2999.00,2199.00,50,'LUXE','LX-CLT-001','["https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600","https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600"]','["XS","S","M","L","XL","XXL"]','["Black","White","Grey","Olive"]',4.5,128,1,1,1),
(1,'Slim Fit Denim Jacket','slim-fit-denim-jacket','Classic slim-fit denim jacket with a modern cut. Versatile layering piece for all seasons.',3499.00,NULL,35,'LUXE','LX-CLT-002','["https://images.unsplash.com/photo-1544441893-675973e31985?w=600"]','["S","M","L","XL"]','["Blue","Dark Blue","Black"]',4.3,89,1,0,1),
(1,'Linen Wide-Leg Trousers','linen-wide-leg-trousers','Breathable linen wide-leg trousers with an elegant drape. Summer essential.',2499.00,1999.00,40,'LUXE','LX-CLT-003','["https://images.unsplash.com/photo-1594938298603-c8148c4b4087?w=600"]','["XS","S","M","L","XL"]','["Beige","White","Black","Navy"]',4.6,67,0,1,0),
(2,'Classic White Leather Sneakers','classic-white-leather-sneakers','Timeless leather sneakers with cushioned sole. Minimal design, maximum comfort.',4999.00,3999.00,60,'LUXE','LX-SHO-001','["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600","https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"]','["38","39","40","41","42","43","44","45"]','["White","Black","Grey"]',4.7,203,1,1,1),
(2,'Suede Chelsea Boots','suede-chelsea-boots','Premium suede chelsea boots with elastic side panels. Sophisticated yet effortless.',6999.00,NULL,25,'LUXE','LX-SHO-002','["https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600"]','["38","39","40","41","42","43","44"]','["Tan","Black","Dark Brown"]',4.8,156,1,0,1),
(2,'Chunky Platform Sandals','chunky-platform-sandals','Bold platform sandals with adjustable straps. A fashion-forward statement piece.',3499.00,2799.00,30,'LUXE','LX-SHO-003','["https://images.unsplash.com/photo-1583241800698-e8ab01830a24?w=600"]','["36","37","38","39","40","41"]','["Black","White","Nude","Red"]',4.2,74,0,1,0),
(3,'Minimalist Automatic Watch','minimalist-automatic-watch','Swiss-movement automatic watch with sapphire crystal glass. Timeless elegance on your wrist.',18999.00,15999.00,15,'LUXE','LX-WCH-001','["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600","https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600"]','["One Size"]','["Silver","Gold","Rose Gold","Black"]',4.9,312,1,1,1),
(3,'Sport Chronograph','sport-chronograph','High-performance chronograph with tachymeter bezel. Built for the active lifestyle.',12999.00,NULL,20,'LUXE','LX-WCH-002','["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600"]','["One Size"]','["Black","Blue","Red"]',4.6,189,0,1,0),
(4,'Structured Tote Bag','structured-tote-bag','Premium vegan leather structured tote with gold hardware. Perfect for work and weekend.',5499.00,4299.00,45,'LUXE','LX-ACC-001','["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600","https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600"]','["One Size"]','["Black","Camel","White","Burgundy"]',4.7,245,1,1,1),
(4,'Silk Paisley Scarf','silk-paisley-scarf','100% mulberry silk scarf with classic paisley print. A versatile luxury accessory.',2999.00,NULL,55,'LUXE','LX-ACC-002','["https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600"]','["90x90cm","70x180cm"]','["Blue","Red","Green","Multicolor"]',4.5,98,0,0,1),
(4,'Woven Leather Belt','woven-leather-belt','Hand-stitched genuine leather woven belt with brushed metal buckle.',1999.00,1599.00,70,'LUXE','LX-ACC-003','["https://images.unsplash.com/photo-1624222247344-550fb60fe8ff?w=600"]','["S","M","L","XL"]','["Black","Tan","Brown"]',4.4,112,0,0,0),
(1,'Cashmere Blend Turtleneck','cashmere-blend-turtleneck','Luxuriously soft cashmere blend turtleneck sweater. The ultimate winter wardrobe staple.',4999.00,3999.00,28,'LUXE','LX-CLT-004','["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600"]','["XS","S","M","L","XL"]','["Cream","Camel","Grey","Navy","Black"]',4.8,167,1,0,1);
