# Product Seeding Guide

This guide explains how to seed your Backlog streetwear store with 12-15 products using Unsplash placeholder images.

## Quick Start

Use the admin API to create products. You'll need an admin account and token.

### 1. Create Admin Account (if needed)

First, check if you have an admin account. If not, create one directly in the database or ask your backend to create a seed admin.

### 2. Login as Admin

```bash
curl -X POST http://localhost:5001/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@backlog.com",
    "password": "your_password"
  }'
```

Copy the `accessToken` from the response.

### 3. Create Products

Use the token to create products:

```bash
TOKEN="your_access_token_here"

# Example: Essential Black Tee
curl -X POST http://localhost:5001/api/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "ESSENTIAL BLACK TEE",
    "description": "Heavyweight 100% cotton tee. Oversized fit with dropped shoulders. Screen-printed logo. The foundation of any rotation.",
    "basePrice": 35,
    "category": "T-SHIRTS",
    "isActive": true,
    "variants": [
      {"sku": "EBT-S-BLK", "size": "S", "colorName": "Black", "colorHexCode": "#000000", "stockQuantity": 50},
      {"sku": "EBT-M-BLK", "size": "M", "colorName": "Black", "colorHexCode": "#000000", "stockQuantity": 75},
      {"sku": "EBT-L-BLK", "size": "L", "colorName": "Black", "colorHexCode": "#000000", "stockQuantity": 75},
      {"sku": "EBT-XL-BLK", "size": "XL", "colorName": "Black", "colorHexCode": "#000000", "stockQuantity": 50},
      {"sku": "EBT-XXL-BLK", "size": "XXL", "colorName": "Black", "colorHexCode": "#000000", "stockQuantity": 25}
    ],
    "images": [
      {"imageUrl": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800", "altText": "Essential Black Tee Front", "displayOrder": 1},
      {"imageUrl": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800", "altText": "Essential Black Tee Detail", "displayOrder": 2}
    ]
  }'
```

## Complete Product List

Here are 12 streetwear products to seed your store:

### T-Shirts (6 products)

#### 1. ESSENTIAL BLACK TEE
- **Price**: $35
- **Description**: Heavyweight 100% cotton tee. Oversized fit with dropped shoulders. Screen-printed logo. The foundation of any rotation.
- **Images**:
  - https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800
  - https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800
- **Variants**: S, M, L, XL, XXL in Black (#000000)
- **SKU Format**: EBT-{SIZE}-BLK

#### 2. WHITE NOISE TEE
- **Price**: $38
- **Description**: Premium heavyweight cotton with distressed graphic print. Relaxed fit. Limited edition design inspired by urban chaos.
- **Images**:
  - https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800
  - https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800
- **Variants**: S, M, L, XL, XXL in White (#FFFFFF)
- **SKU Format**: WNT-{SIZE}-WHT

#### 3. NEON DRIP TEE
- **Price**: $40
- **Description**: Black tee with neon green screen print. Glow-in-dark elements. Cropped boxy fit. Stand out in the dark.
- **Images**:
  - https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800
  - https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800
- **Variants**: S, M, L, XL, XXL in Black with Green Print (#000000)
- **SKU Format**: NDT-{SIZE}-BLK

#### 4. URBAN LEGEND TEE
- **Price**: $42
- **Description**: Vintage wash graphic tee. Faded print aesthetic. Pre-shrunk cotton. Lived-in feel from day one.
- **Images**:
  - https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800
  - https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800
- **Variants**: S, M, L, XL, XXL in Gray (#808080)
- **SKU Format**: ULT-{SIZE}-GRY

#### 5. MINIMAL LOGO TEE
- **Price**: $35
- **Description**: Clean minimal design. Small logo chest print. Regular fit. Everyday essential that speaks volumes.
- **Images**:
  - https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800
  - https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9e?w=800
- **Variants**: S, M, L, XL, XXL in White (#FFFFFF) and Black (#000000)
- **SKU Format**: MLT-{SIZE}-{COLOR}

#### 6. BLOCK LETTER TEE
- **Price**: $38
- **Description**: Bold block typography. Statement piece. Heavyweight cotton. Oversized cut. Make noise without saying a word.
- **Images**:
  - https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800
  - https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800
- **Variants**: S, M, L, XL, XXL in Black (#000000)
- **SKU Format**: BLT-{SIZE}-BLK

### Hoodies (6 products)

#### 7. SHADOW HOODIE
- **Price**: $85
- **Description**: All black everything. 400GSM heavyweight fleece. Kangaroo pocket. Drawstring hood. Built for the culture.
- **Images**:
  - https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800
  - https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800
- **Variants**: S, M, L, XL, XXL in Black (#000000)
- **SKU Format**: SHD-{SIZE}-BLK

#### 8. CONTRAST HOODIE
- **Price**: $88
- **Description**: Black body with white drawstrings and details. Premium French terry. Embroidered logo. Attention to detail.
- **Images**:
  - https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=800
  - https://images.unsplash.com/photo-1620799140116-491cf4e7be58?w=800
- **Variants**: S, M, L, XL, XXL in Black/White
- **SKU Format**: CHD-{SIZE}-BWH

#### 9. OVERSIZED ZIP HOODIE
- **Price**: $95
- **Description**: Dropped shoulder oversized fit. YKK zip. Side pockets. Ribbed cuffs and hem. Street luxury redefined.
- **Images**:
  - https://images.unsplash.com/photo-1620799140116-491cf4e7be58?w=800
  - https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800
- **Variants**: S, M, L, XL, XXL in Black (#000000) and Gray (#808080)
- **SKU Format**: OZH-{SIZE}-{COLOR}

#### 10. ESSENTIAL CREWNECK
- **Price**: $75
- **Description**: Classic crewneck sweatshirt. No hood, all attitude. Brushed fleece interior. Timeless silhouette.
- **Images**:
  - https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800
  - https://images.unsplash.com/photo-1614676471928-2ed0ad1061d4?w=800
- **Variants**: S, M, L, XL, XXL in Black (#000000), White (#FFFFFF), Gray (#808080)
- **SKU Format**: ECN-{SIZE}-{COLOR}

#### 11. GRAPHIC PULLOVER
- **Price**: $90
- **Description**: Bold front graphic. Pullover hoodie. Premium weight fleece. Limited release. Wear your statement.
- **Images**:
  - https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800
  - https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=800
- **Variants**: S, M, L, XL, XXL in Black (#000000)
- **SKU Format**: GPL-{SIZE}-BLK

#### 12. TECH FLEECE HOODIE
- **Price**: $110
- **Description**: Modern technical fabric. Lightweight warmth. Water-resistant coating. Zippered pockets. Future-forward design.
- **Images**:
  - https://images.unsplash.com/photo-1614676471928-2ed0ad1061d4?w=800
  - https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=800
- **Variants**: S, M, L, XL, XXL in Black (#000000), Navy (#000080)
- **SKU Format**: TFH-{SIZE}-{COLOR}

## Unsplash Image URLs

All images are from Unsplash (free to use). Format: `https://images.unsplash.com/photo-{ID}?w=800`

**Recommended searches on Unsplash for more images:**
- "black t-shirt mockup"
- "streetwear hoodie"
- "minimal clothing"
- "urban fashion"
- "black hoodie"

## Automation Script (Optional)

Create a Node.js script to seed all products:

```javascript
// seed-products.js
const products = [ /* array of product objects */ ];

async function seedProducts() {
  const token = 'YOUR_ADMIN_TOKEN';

  for (const product of products) {
    const response = await fetch('http://localhost:5001/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(product)
    });

    const result = await response.json();
    console.log(`Created: ${product.name}`, result.success);
  }
}

seedProducts();
```

## Verification

After seeding, verify products appear:
1. Visit http://localhost:3000
2. Check homepage shows featured products
3. Visit /shop to see all products
4. Click on products to verify images and variants load
5. Try adding to cart and checkout flow

## Notes

- All prices are in USD
- Stock quantities can be adjusted per your needs
- Color hex codes for variant filtering
- SKU format follows: {PRODUCT_CODE}-{SIZE}-{COLOR}
- Main image is first in images array
