/**
 * KATALOG MA'LUMOTLARI VA TOIFALAR
 * ---------------------------------------------------------------------------
 * Boshqa biznesga moslashtirish uchun `categories`, `specFields` va `products`
 * ro‘yxatini o‘zgartiring. Har bir mahsulot ixtiyoriy ravishda `variants`,
 * `stockQty` (ombordagi qoldiq), `costPrice` (tannarx) va `soldBase` (oldingi
 * sotuvlar soni) maydonlariga ega bo‘lishi mumkin.
 */
const categories = [
  { id: 'all', name: 'Barchasi', icon: 'grid' },
  { id: 'gaming', name: 'Gaming', icon: 'gamepad' },
  { id: 'business', name: 'Biznes', icon: 'briefcase' },
  { id: 'study', name: 'O‘qish uchun', icon: 'cap' },
  { id: 'creative', name: 'Ijod uchun', icon: 'pen' }
];

// Karta va batafsil oynada ko‘rinadigan texnik xususiyatlar tuzilmasi
const specFields = [
  { key: 'cpu', label: 'Protsessor', icon: 'cpu', card: true },
  {
    key: 'ram',
    label: 'Tezkor xotira',
    icon: 'ram',
    card: true,
    format: val => `${val} GB`,
    filterable: true,
    filterLabel: 'Tezkor xotira (RAM)',
    filterUnit: 'GB',
    minSuffix: 'va ko‘proq'
  },
  { key: 'ssd', label: 'Doimiy xotira (SSD)', icon: 'disk', card: true },
  { key: 'screen', label: 'Ekran', icon: 'screen', card: false },
  { key: 'gpu', label: 'Videokarta (GPU)', icon: 'gpu', card: false }
];

// Namunaviy katalog va narxlar (O‘zbek so‘mida)
const products = [
  {
    id: 'rog',
    brand: 'ASUS',
    name: 'ROG Zephyrus G14',
    categories: ['gaming', 'creative'],
    cpu: 'Ryzen 9 8945HS',
    ram: 32,
    ssd: '1 TB',
    screen: '14″ OLED · 120 Hz',
    gpu: 'GeForce RTX 4070',
    price: 24990000,
    old: 27990000,
    costPrice: 21800000,
    stockQty: 3,
    soldBase: 14,
    badge: '−11%',
    tone: 'purple',
    inStock: true,
    warranty: '12 oy rasmiy kafolat',
    desc: 'Yuqori yangilanish chastotali OLED ekran va kuchli RTX 4070 grafika o‘yin, 3D modellashtirish hamda video montajda birdek yuqori tezlik beradi.',
    variants: [
      { id: '16-1tb', label: '16 GB / 1 TB · RTX 4060', ram: 16, ssd: '1 TB', gpu: 'GeForce RTX 4060', price: 21990000, old: 24490000 },
      { id: '32-1tb', label: '32 GB / 1 TB · RTX 4070', ram: 32, ssd: '1 TB', gpu: 'GeForce RTX 4070', price: 24990000, old: 27990000 }
    ]
  },
  {
    id: 'air',
    brand: 'Apple',
    name: 'MacBook Air 13″ M4',
    categories: ['business', 'study'],
    cpu: 'Apple M4',
    ram: 16,
    ssd: '256 GB',
    screen: '13,6″ Liquid Retina',
    gpu: 'Apple 8 yadroli GPU',
    price: 13490000,
    costPrice: 11850000,
    stockQty: 12,
    soldBase: 31,
    badge: 'Yangi',
    tone: 'blue',
    inStock: true,
    warranty: '12 oy Apple kafolati',
    desc: 'Yengil alyuminiy korpus, jim va ventilyatorsiz ishlaydigan M4 chipi hamda 18 soatgacha batareya quvvati o‘qish, safar va ofis ishlari uchun qulay.',
    variants: [
      { id: '16-256', label: '16 GB / 256 GB', ram: 16, ssd: '256 GB', price: 13490000 },
      { id: '16-512', label: '16 GB / 512 GB', ram: 16, ssd: '512 GB', price: 15990000 },
      { id: '24-512', label: '24 GB / 512 GB', ram: 24, ssd: '512 GB', price: 18490000 }
    ]
  },
  {
    id: 'legion',
    brand: 'Lenovo',
    name: 'Legion 5 16IRX9',
    categories: ['gaming', 'creative'],
    cpu: 'Core i7-14650HX',
    ram: 16,
    ssd: '1 TB',
    screen: '16″ WQXGA · 165 Hz',
    gpu: 'GeForce RTX 4060',
    price: 18990000,
    old: 20990000,
    costPrice: 16500000,
    stockQty: 7,
    soldBase: 22,
    badge: '−10%',
    tone: 'slate',
    inStock: true,
    warranty: '12 oy rasmiy kafolat',
    desc: 'Keng 165 Hz ekran, samarali sovitish tizimi va alohida RTX 4060 videokarta zamonaviy o‘yinlar, render va dasturlash loyihalari uchun mos.',
    variants: [
      { id: '16-512', label: '16 GB / 512 GB', ram: 16, ssd: '512 GB', price: 17990000, old: 19990000 },
      { id: '16-1tb', label: '16 GB / 1 TB', ram: 16, ssd: '1 TB', price: 18990000, old: 20990000 },
      { id: '32-1tb', label: '32 GB / 1 TB', ram: 32, ssd: '1 TB', price: 20490000, old: 22490000 }
    ]
  },
  {
    id: 'zenbook',
    brand: 'ASUS',
    name: 'Zenbook 14 OLED',
    categories: ['business', 'creative'],
    cpu: 'Core Ultra 7 155H',
    ram: 16,
    ssd: '1 TB',
    screen: '14″ 3K OLED · 120 Hz',
    gpu: 'Intel Arc Graphics',
    price: 14990000,
    costPrice: 13100000,
    stockQty: 9,
    soldBase: 19,
    badge: 'OLED',
    tone: 'olive',
    inStock: true,
    warranty: '12 oy rasmiy kafolat',
    desc: 'Ranglarga boy 3K OLED displey atigi 1,2 kg og‘irlikdagi metall korpusga joylangan. Dizayn, taqdimot va safarlarda ishlash uchun ajoyib tanlov.'
  },
  {
    id: 'ideapad',
    brand: 'Lenovo',
    name: 'IdeaPad Slim 3',
    categories: ['study', 'business'],
    cpu: 'Core i5-1335U',
    ram: 8,
    ssd: '512 GB',
    screen: '15,6″ Full HD IPS',
    gpu: 'Intel UHD Graphics',
    price: 5990000,
    old: 6490000,
    costPrice: 5150000,
    stockQty: 16,
    soldBase: 28,
    badge: '−8%',
    tone: 'blue',
    inStock: true,
    warranty: '12 oy rasmiy kafolat',
    desc: 'Katta 15,6 dyuymli ekran, raqamli blokli qulay klaviatura va tezkor SSD xotira talabalar, ofis xodimlari hamda kundalik vazifalar uchun maqbul.',
    variants: [
      { id: '8-512', label: '8 GB / 512 GB', ram: 8, ssd: '512 GB', price: 5990000, old: 6490000 },
      { id: '16-512', label: '16 GB / 512 GB', ram: 16, ssd: '512 GB', price: 6490000, old: 6990000 }
    ]
  },
  {
    id: 'pro',
    brand: 'Apple',
    name: 'MacBook Pro 14″ M4',
    categories: ['creative', 'business'],
    cpu: 'Apple M4',
    ram: 16,
    ssd: '512 GB',
    screen: '14,2″ Liquid Retina XDR',
    gpu: 'Apple 10 yadroli GPU',
    price: 22990000,
    costPrice: 20200000,
    stockQty: 5,
    soldBase: 11,
    tone: 'slate',
    inStock: true,
    warranty: '12 oy Apple kafolati',
    desc: 'Yorqin 1600 nitgacha Liquid Retina XDR displey, studio sifatidagi mikrofonlar va faol sovitish tizimi professional montaj va dasturlash uchun.',
    variants: [
      { id: '16-512', label: '16 GB / 512 GB · M4', ram: 16, ssd: '512 GB', price: 22990000 },
      { id: '24-1tb', label: '24 GB / 1 TB · M4 Pro', cpu: 'Apple M4 Pro', ram: 24, ssd: '1 TB', gpu: 'Apple 16 yadroli GPU', price: 29490000 }
    ]
  },
  {
    id: 'thinkpad',
    brand: 'Lenovo',
    name: 'ThinkPad X1 Carbon',
    categories: ['business'],
    cpu: 'Core Ultra 7 155U',
    ram: 32,
    ssd: '1 TB',
    screen: '14″ WUXGA IPS Anti-Glare',
    gpu: 'Intel Graphics',
    price: 19990000,
    costPrice: 17400000,
    stockQty: 2,
    soldBase: 9,
    tone: 'rose',
    inStock: true,
    warranty: '12 oy rasmiy kafolat',
    desc: 'Karbon tolali mustahkam korpus, TrackPoint va dunyoga mashhur qulay klaviatura uzoq vaqt hujjatlar, kod va moliya jadvallari bilan ishlovchilar uchun.'
  },
  {
    id: 'yoga',
    brand: 'Lenovo',
    name: 'Yoga Pro 7',
    categories: ['creative', 'study'],
    cpu: 'Core Ultra 7 155H',
    ram: 16,
    ssd: '1 TB',
    screen: '14,5″ 3K · 120 Hz',
    gpu: 'GeForce RTX 4050',
    price: 15490000,
    costPrice: 13600000,
    stockQty: 6,
    soldBase: 16,
    badge: '3K',
    tone: 'purple',
    inStock: true,
    warranty: '12 oy rasmiy kafolat',
    desc: 'Yuqori aniqlikdagi 3K displey, RTX 4050 grafik tezlatkich va tezkor xotira grafik dizayn, montaj hamda muhandislik dasturlari uchun mo‘ljallangan.'
  }
];
