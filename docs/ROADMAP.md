# Roadmap

## ✅ Phase 0 — Foundation (this commit)
- Category templates, selling modes, rules engine
- Storefront: home (seasonal hero), category with generated filters, product page with adaptive buy box, search
- Idol pre-booking with advance split and size visualiser
- Construction storefront with brick/cement/sand calculator
- Multi-item quote requests with distance-based delivery estimate
- Cart grouped by selling mode, WhatsApp ordering
- Drizzle schema for orders, quotes, customers, campaigns, artisans, delivery rates
- Unit tests + CI

## ✅ Phase 0.5 — Product-grade storefront
- White-label store config (brand, colours, campaign, feature switches)
- Photo-led design, gallery, ratings & reviews, MRP / % off, sort & price filters
- Wishlist, recently viewed, pincode delivery check, mobile bottom nav, SEO structured data

## Phase 1 — Take real orders
- [ ] Phone OTP login (Auth.js + MSG91 / WhatsApp OTP)
- [ ] Checkout: address, pincode serviceability, delivery fee
- [ ] Razorpay: UPI, cards, partial (advance) payments, webhooks → order status
- [ ] Order creation from cart (one order per selling mode), GST invoice PDF
- [ ] WhatsApp notifications: order placed, idol ready, out for delivery
- [ ] Image uploads (Cloudinary / S3)
- [ ] Delivery trips per vehicle capacity (currently uses product per-trip load)

## Phase 2 — Admin panel
- [ ] Category builder UI (edit attribute templates, modes, rules — no code)
- [ ] Product editor generated from the template
- [ ] Bookings calendar & production capacity for idols
- [ ] Quotes inbox: price, send on WhatsApp, convert to order
- [ ] Daily rate updates for bricks/sand/cement
- [ ] Contractor credit accounts

## Phase 3 — Growth
- [ ] Campaigns: festival banners, early-bird discounts, bundles (Diwali kit)
- [ ] Telugu UI toggle (names already stored)
- [ ] Reviews with photos, breakage claims with photo upload
- [ ] Artisan pages & GI-tag story pages (SEO)
- [ ] Mobile app (Expo / React Native) on `/api/catalog`
- [ ] Export / NRI shipping for Etikoppaka
- [ ] Multi-vendor: let other artisans list products
