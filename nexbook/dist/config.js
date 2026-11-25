/**
 * BIZNES SOZLAMALARI (WHITE-LABEL CONFIGURATION)
 * ---------------------------------------------------------------------------
 * Ushbu faylni tahrirlash orqali saytni istalgan do'kon yoki biznesga
 * (noutbuklar, telefonlar, texnika, aksessuarlar va b.) moslashtirish mumkin.
 * Mahsulotlar va toifalar esa `store.js` faylida saqlanadi.
 */
window.STORE_CONFIG = {
  brand: {
    name: 'NEXBOOK',
    siteTitle: 'Nexbook — Noutbuklar do‘koni',
    description: 'Nexbook noutbuklar do‘koni. O‘yin, ish, o‘qish va ijod uchun noutbuklarning xususiyatlari, narxlari va muddatli to‘lov shartlarini ko‘ring.',
    tagline: 'O‘yin, biznes, o‘qish va ijod uchun tekshirilgan noutbuklar. Rasmiy kafolat va tezkor yetkazib berish.',
    logoMark: 'assets/mark.svg',
    accentColor: '#c1f950', // Asosiy urg‘u rangi (CSS --lime)
    storageKey: 'nexbook-store-v2', // Boshqa biznes uchun noyob nom qo‘ying
    copyright: '© Nexbook 2026',
    footerNote: 'Namunaviy katalog va narxlar'
  },

  contact: {
    phone: '+998 90 123 45 67',
    phoneHref: 'tel:+998901234567',
    telegram: 'nexbook_uz', // @ belgisiz Telegram username (1-klik buyurtma uchun)
    instagram: 'https://instagram.com/nexbook.uz',
    address: 'Toshkent sh., Shayxontohur tumani, B-12 showroom',
    hours: 'Har kuni 09:00 — 21:00',
    deliverySummary: 'Toshkent bo‘ylab 2 soatda bepul yetkazib berish',
    warrantySummary: '12 oy rasmiy do‘kon va servis kafolati',

    // Ixtiyoriy: Telegram Bot API yoki backend Webhook orqali buyurtma yuborish.
    // Eslatma: Ochiq internet saytida bot tokenni brauzerda qoldirmaslik uchun
    // ishlab chiqarish (production) muhitida `webhookUrl` (server/Worker) tavsiya etiladi.
    telegramBotToken: '',
    telegramChatId: '',
    webhookUrl: ''
  },

  currency: {
    label: 'so‘m',
    position: 'after', // 'after' (13 490 000 so‘m) yoki 'before' ($999)
    thousandSep: ' '
  },

  installment: {
    enabled: true,
    months: [3, 6, 12],
    defaultMonths: 12,
    // Har bir muddat uchun ustama foizi (0 = foizsiz muddatli to‘lov)
    markupPercent: {
      3: 0,
      6: 8,
      12: 18
    },
    label: 'Muddatli to‘lov'
  },

  // Savatchadagi promo-kodlar (kod: chegirma foizi)
  promoCodes: {
    NEXBOOK5: 5,
    YANGI10: 10
  },

  deliveryOptions: [
    {
      id: 'courier',
      label: 'Kuryer orqali yetkazib berish',
      note: 'Toshkent bo‘ylab 2 soatda bepul',
      price: 0,
      requiresAddress: true
    },
    {
      id: 'pickup',
      label: 'Do‘kondan olib ketish',
      note: 'Showroomdan tekshirib olib ketish',
      price: 0,
      requiresAddress: false
    },
    {
      id: 'region',
      label: 'Viloyatlarga yetkazib berish',
      note: '1–2 ish kuni ichida ekspress pochta',
      price: 70000,
      requiresAddress: true
    }
  ],

  paymentMethods: [
    'Naqd pul (yetkazilganda)',
    'Click / Payme / Uzcard / Humo',
    'Muddatli to‘lov (Nasiya)'
  ],

  features: {
    compare: true,
    maxCompare: 3,
    autoplaySlidesMs: 6500,
    maxCartQty: 99,
    introAnimation: true
  },

  admin: {
    enabled: true,
    pin: '1234', // Boshqa biznesga berishdan oldin PIN kodni o‘zgartiring
    showFooterLink: true // Footerda "Admin panel" tugmasini ko‘rsatish (Ctrl+Shift+A ham ishlaydi)
  },

  ui: {
    catalogTitle: 'Noutbuklar katalogi',
    searchPlaceholder: 'Brend, model, protsessor yoki xususiyat…',
    orderFilePrefix: 'Nexbook-buyurtma',
    inStockLabel: 'Sotuvda mavjud',
    outOfStockLabel: 'Buyurtma asosida'
  },

  benefits: [
    {
      icon: 'shield',
      title: '12 oylik kafolat',
      desc: 'Har bir qurilma tekshirilgan va rasmiy kafolat bilan beriladi.'
    },
    {
      icon: 'truck',
      title: 'Tezkor yetkazish',
      desc: 'Toshkent bo‘ylab 2 soatda, viloyatlarga 1–2 kunda yetkazib beramiz.'
    },
    {
      icon: 'percent',
      title: 'Qulay bo‘lib to‘lash',
      desc: '3, 6 yoki 12 oylik shaffof muddatli to‘lov rejalari mavjud.'
    },
    {
      icon: 'chat',
      title: 'Bepul maslahat',
      desc: 'Vazifangiz va byudjetingizga mos modelni tanlashda yordam beramiz.'
    }
  ],

  slides: [
    {
      label: 'Yangi kolleksiya',
      title: 'Yangi avlod',
      accent: 'noutbuklari.',
      copy: 'O‘yin, ish va ijod uchun kuchli noutbuklar.\nO‘zingizga mos modelni toping.',
      image: 'assets/hero.webp',
      alt: 'Yashil nurli ekranga ega zamonaviy gaming noutbuk',
      blend: 'lighten',
      category: 'all',
      cta: 'Katalogni ko‘rish'
    },
    {
      label: 'Gaming kolleksiyasi',
      title: 'O‘yin uchun',
      accent: 'kuchli tanlov.',
      copy: 'Tezkor OLED ekran va RTX grafika bilan\nsevimli o‘yinlaringizga sho‘ng‘ing.',
      image: 'assets/rog.webp',
      alt: 'ASUS ROG Zephyrus G14 gaming noutbuki',
      blend: 'normal',
      category: 'gaming',
      cta: 'Gaming modellar'
    },
    {
      label: 'Biznes kolleksiyasi',
      title: 'Yengil korpus.',
      accent: 'Katta quvvat.',
      copy: 'Uchrashuv, safar va ofis uchun\nixcham ish hamrohingizni tanlang.',
      image: 'assets/air.webp',
      alt: 'Yengil va yupqa Apple MacBook Air',
      blend: 'normal',
      category: 'business',
      cta: 'Biznes uchun'
    }
  ]
};
