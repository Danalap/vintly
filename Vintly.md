## **Product Requirements Document: "Vintly" - Haute Couture Resale Marketplace**

### **1. Project Overview**

A curated peer-to-peer (P2P) marketplace specializing in pre-owned haute couture and luxury designer pieces. Vintly connects discerning collectors with rare, authenticated designer garments from the world's most prestigious fashion houses.

* **Target Platform:** Web/Mobile Web  
* **Tech Stack:** Next.js, Tailwind CSS, Supabase (Auth/Database/Storage), and Stripe (Payments)
* **Market Focus:** High-end designer fashion (Chanel, Dior, Hermès, Valentino, etc.)

---

### **2. User Roles & Core Workflows**

| Feature | Buyer Role | Seller Role |
| :---- | :---- | :---- |
| **Onboarding** | Browse luxury pieces; create account to purchase. | Identity verification; submit pieces for authentication. |
| **Discovery** | Filter by designer, category, condition, and price range ($1K-$50K+). | N/A |
| **Transaction** | Secure payment via Stripe; insured white-glove shipping. | Professional authentication; luxury packaging; payouts. |
| **Interaction** | Follow collectors; "Save" items; Request provenance details. | Manage consignments; Respond to collector inquiries. |

---

### **3. Functional Requirements**

#### **A. Consignment Experience (The Supply)**

* **Professional Photography:** Up to 8 high-resolution photos per piece, including detail shots, labels, and authenticity markers.  
* **Listing Form:** Fields for Fashion House, Category (Gowns, Handbags, Fine Jewelry, Watches, etc.), Size, Condition (New with Tags, Pristine, Excellent, Good), Provenance, and Price.  
* **Authentication Process:** All pieces undergo expert verification before listing.
* **Consignment Dashboard:** Track "Pending Authentication," "Active," "Sold," and "Archived" pieces.  
* **White-Glove Shipping:** Insured shipping with luxury packaging for high-value items.

#### **B. Collector Experience (The Demand)**

* **Curated Discovery:** A refined search experience and "Featured Pieces" showcase.  
* **Advanced Filtering:** Filter by **Designer** (Chanel, Dior, Hermès, etc.), **Category**, **Size**, **Condition**, and **Price Range** ($1K-$50K+).  
* **Product Detail Page:** High-resolution image gallery, authenticity certificate, provenance details, and "Acquire Now" button.  
* **Secure Checkout:** White-glove service with insured delivery and payment protection.

#### **C. Trust & Authentication (The Foundation)**

* **Expert Authentication:** Every piece verified by luxury fashion experts.  
* **Provenance Documentation:** Detailed history and authenticity certificates.  
* **Collector Ratings:** Verified reviews from discerning buyers.  
* **Secure Transactions:** Funds held in escrow until piece is received and inspected.
* **Concierge Service:** Dedicated support for high-value acquisitions.

---

### **4. Technical Data Schema**

**Database Tables:**

* **Profiles:** id, username, bio, avatar_url, collector_rating, verification_status, stripe_connect_id  
* **Products:** id, seller_id, title, description, price, designer, category, size, condition, provenance, authentication_status, status (pending/available/sold)  
* **Images:** id, product_id, url, order_index, image_type (main/detail/label/authenticity)  
* **Orders:** id, buyer_id, product_id, total_amount, status (pending/authenticated/shipped/delivered), tracking_number, insurance_value
* **Authentication_Records:** id, product_id, authenticator_id, verification_date, certificate_url

---

### **5. Success Metrics (KPIs)**

* **Sell-Through Rate:** Percentage of authenticated pieces sold within 60 days.  
* **Average Transaction Value (ATV):** Target: $2,500+ per transaction.  
* **Collector Retention:** Repeat purchases from verified collectors.
* **Authentication Accuracy:** 100% authenticity guarantee.

---

### **6. Brand & Design Direction**

* **The Aesthetic:** Warm, refined, and sophisticated. Image-forward with generous whitespace.
* **Typography:** Elegant serif display fonts paired with clean sans-serif body text.
* **Color Palette:** Warm earth tones (cream, terracotta, sage) conveying approachability with luxury.
* **Mobile-First:** Seamless consignment flow optimized for mobile photography.

---

### **7. Featured Designers**

Initial focus on pieces from:
- Chanel
- Dior  
- Hermès
- Valentino
- Christian Louboutin
- Gucci
- Balmain
- Givenchy
- Saint Laurent
- Oscar de la Renta
- Prada
- Versace

---

### **8. Differentiation**

Unlike general secondhand marketplaces, Vintly specializes exclusively in haute couture and luxury designer pieces, providing:

1. **Expert Authentication** - Every piece verified before listing
2. **Curated Selection** - Only exceptional pieces from top fashion houses
3. **White-Glove Service** - Insured shipping, luxury packaging, concierge support
4. **Collector Community** - Connect with fellow haute couture enthusiasts

