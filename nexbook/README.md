# Nexbook — Bizneslar uchun tayyor onlayn do‘kon shabloni

Ushbu loyiha hech qanday murakkab server yoki build-jarayonsiz (`dist/` papkasining o‘zini istalgan hostingga joylash orqali) ishlaydigan professional internet-do‘kon shablonidir.

## Asosiy imkoniyatlar
- **To‘liq white-label moslashuv**: Brend nomi, urg‘u rangi, kontaktlar, valyuta, yetkazib berish va muddatli to‘lov shartlari bitta `dist/config.js` faylidan boshqariladi.
- **Katalog va konfiguratsiyalar**: `dist/store.js` orqali toifalar, texnik xususiyatlar va mahsulot variantlari (masalan, `16 GB / 256 GB` yoki `16 GB / 512 GB`) qo‘shiladi.
- **Aqlli filtrlar va tezkor qidiruv (`Ctrl+K` yoki `/`)**: Brend, narx chegarasi, asosiy xususiyat (RAM), chegirma va mavjudlik bo‘yicha avtomatik filtrlar.
- **Taqqoslash (Compare)**: Xaridorlar 3 tagacha modelni yonma-yon jadvalda solishtirishi mumkin (eng arzon narx va eng yuqori RAM avtomatik ajratiladi).
- **Muddatli to‘lov kalkulyatori**: Har bir mahsulot sahifasida 3, 6 va 12 oylik to‘lov hisoblagichi.
- **Savatcha, promo-kodlar va to‘liq buyurtma formasi**: Telefon raqami formatlash (`+998`), yetkazish usuli tanlovi, promo-kod (`NEXBOOK5`, `YANGI10`), buyurtma tarixi (`Buyurtmalarim`), 1-klik Telegramga yuborish va `.txt` chek yuklab olish.
- **O‘rnatilgan Admin Panel (`Ctrl+Shift+A` yoki footer / menyudan `Admin panel`)**:
  - Standart demo PIN: `1234` (`config.js` ichidagi `admin.pin` orqali yoki Admin Panelning o‘zidan o‘zgartiriladi).
  - **Analitika va Statistika**: Umumiy savdo, taxminiy sof foyda, o‘rtacha chek, eng zo‘r sotilgan tovarlar (Top 5), toifalar/brendlar taqsimoti, to‘lov usullari va kam qolgan tovarlar ogohlantirishlari.
  - **Ombor (Inventory)**: Har bir model qoldig‘i, ombor qiymati (sotuv va tannarxda), tugagan/kam qolgan tovarlar filtri, `−1/+1/+5` tezkor kirim-chiqim hamda buyurtma tasdiqlanganda ombordan avtomatik ayirish (bekor qilinganda qaytarish).
  - **Buyurtmalar & So‘rovlar**: Kelib tushgan buyurtmalar statusini o‘zgartirish (`Yangi`, `Tasdiqlangan`, `Yetkazildi`, `Bekor qilindi`) va maslahat so‘rovlarini boshqarish.
  - **Mahsulotlar va Sozlamalar**: Mahsulot qo‘shish/tahrirlash, rasm yuklash (`WebP`), do‘kon nomi, rang (`accentColor`), kontaktlar, valyuta va promo-kodlarni jonli tahrirlash hamda `config.js` / `store.js` eksporti.

---

## Boshqa biznesga moslashtirish (3 qadam)

### 1. Biznes va dizayn sozlamalari (`dist/config.js`)
- `brand.name`, `brand.siteTitle`, `brand.tagline`: Do‘kon nomini va tavsifini yozing.
- `brand.accentColor`: Istalgan HEX rangni kiriting (masalan `#c1f950`, `#38bdf8`, `#ff6b35`) — saytdagi barcha tugmalar va urg‘ular avtomatik o‘zgaradi.
- `brand.storageKey`: Har bir mijoz/biznes uchun noyob kalit nomini qo‘ying.
- `contact`: Telefon raqami, Telegram username (`telegram`), Instagram, manzil va ish vaqtini kiriting.
- `currency`, `installment`, `promoCodes`, `deliveryOptions`, `paymentMethods`: Narx birligi (`so‘m` yoki `$`), bo‘lib to‘lash foizlari, chegirma promo-kodlari va yetkazib berish narxlarini o‘zingizga moslang.
- `slides` va `benefits`: Bosh sahifa karuseli va do‘kon afzalliklarini yangilang.

### 2. Mahsulotlar va toifalar (`dist/store.js`)
- `categories`: Do‘kon toifalarini o‘zgartiring.
- `specFields`: Karta va batafsil oynada ko‘rinadigan xususiyatlar nomini yozing (noutbukdan boshqa mahsulotlar — telefon, televizor, maishiy texnika uchun ham moslashadi).
- `products`: Rasmlarni `dist/assets/` papkasiga joylab, mahsulotlar ro‘yxatini yangilang.

### 3. Saytni internetga joylash (Deploy)
Faqat `nexbook/dist/` papkasini istalgan statik hostingga yuklang:
- **Netlify / Vercel / Cloudflare Pages**: `dist` papkasini yuklang (drag & drop ham ishlaydi).
- **Oddiy hosting (cPanel / Nginx)**: `dist` ichidagi fayllarni `public_html` ga ko‘chiring.
- **Lokal tekshirish**: `python -m http.server 8780 --directory nexbook/dist` komandasini ishga tushiring.

> **Xavfsizlik eslatmasi:** Ochiq internet saytida Telegram bot tokenini brauzer kodida saqlamang. Buyurtmalarni avtomatik qabul qilish uchun `contact.telegram` (mijozning tayyor xabar bilan Telegramga o‘tishi) yoki server/Cloudflare Worker orqali `contact.webhookUrl` dan foydalaning.
