/* SpoonUp catalogue — mirrored from the live store (spoonupfoods.com) */
export const IMG_BASE = 'https://storage.googleapis.com/spoonup-508319-product-images/products/';

export const SPOONUP = {
  logo: 'https://spoonupfoods.com/SpoonUp_Official_Logo_Transparent.png',
  heroBenefits: 'https://spoonupfoods.com/images/home/hero-benefits.jpg',
  happier: 'https://spoonupfoods.com/images/home/healthier-happier.jpg',
  gst: 0.05,
  freeDeliveryAt: 499,
  categories: ['Snacks', 'Desserts', 'Beverages', 'Healthy Sweets', 'Kashmiri Dry Fruits', 'Healthy Breakfast', 'Food'],
  products: [
    {
      id: 'tikki',
      name: 'Crispy Sabudana Sweet Potato Tikki',
      sub: 'with coriander-mint chutney',
      cat: 'Snacks',
      price: 120,
      unit: 'per plate',
      mode: 'now',
      img: IMG_BASE + 'catalog-prod-4.jpg',
      tint: '#F2A33A',
      desc: 'Golden-crisp sabudana and sweet potato tikkis served with fresh coriander-mint chutney.'
    },
    {
      id: 'fries',
      name: 'Peri Peri Healthy House Fries',
      sub: 'with house special sauce',
      cat: 'Snacks',
      price: 150,
      unit: 'per plate',
      mode: 'now',
      img: IMG_BASE + 'catalog-prod-5.jpg',
      tint: '#E4572E',
      desc: 'Crispy house-cut healthy sabudana fries tossed in aromatic peri-peri spices with house special dip.'
    },
    {
      id: 'chia',
      name: 'Chocolate Protein Chia Pudding',
      sub: 'no added sugar',
      cat: 'Desserts',
      price: 320,
      unit: 'per jar',
      mode: 'now',
      img: IMG_BASE + '1789197852770-76cfebe3-5724-409b-b56b-062e4aa55b33.jpg',
      tint: '#6B3F2A',
      desc: 'Have a dessert without guilt. Fulfil your daily protein intake with a dessert. Chia seeds, skyr, cocoa, almonds, cashew, whey protein, dates and vanilla.'
    },
    {
      id: 'dragon',
      name: 'Dragon Fruit Smoothie',
      sub: 'zero added sugar',
      cat: 'Beverages',
      price: 180,
      unit: 'per bottle',
      mode: 'now',
      img: IMG_BASE + '1789196981574-9775dbb9-ef35-4098-bcc7-e36802135ff3.jpg',
      tint: '#D63A7A',
      desc: 'Vibrant, antioxidant-rich dragon fruit smoothie with zero added sugar, banana and a chia seed topping.'
    },
    {
      id: 'modak',
      name: 'Paan Dry Fruit Gulkand Modak',
      sub: 'guilt-free mithai',
      cat: 'Healthy Sweets',
      price: 120,
      unit: 'per piece',
      mode: 'now',
      img: IMG_BASE + 'catalog-prod-1.jpg',
      tint: '#5E8C3A',
      desc: 'Nutritious, delicious and guilt-free modak stuffed with aromatic paan, gulkand and rich dry fruits.'
    },
    {
      id: 'blackberry',
      name: 'Kashmir ke Blackberries',
      sub: '100% pure, sun-dried',
      cat: 'Kashmiri Dry Fruits',
      price: 1400,
      unit: 'per kg',
      mode: 'now',
      img: IMG_BASE + 'catalog-prod-10.jpg',
      tint: '#4B2449',
      desc: 'Sun-dried, handpicked pure Kashmiri blackberries, rich in natural antioxidants.'
    },
    {
      id: 'muesli',
      name: 'Kashmiri Muesli',
      sub: 'no added sugar',
      cat: 'Healthy Breakfast',
      price: 300,
      unit: 'per 100 g',
      mode: 'later',
      img: IMG_BASE + 'catalog-prod-6.jpg',
      tint: '#C08A3E',
      desc: 'Crunchy, tasty, snackable and great with milk. 100% natural, no added sugar.'
    },
    {
      id: 'almond',
      name: 'Kashmir ke Almonds',
      sub: 'badam giri, 100% pure',
      cat: 'Kashmiri Dry Fruits',
      price: 480,
      unit: 'per 100 g',
      mode: 'later',
      img: IMG_BASE + 'catalog-prod-7.jpg',
      tint: '#A9683A',
      desc: '100% pure premium Kashmiri almonds (badam giri), rich in natural oils and sweetness.'
    },
    {
      id: 'walnut',
      name: 'Kashmir ke Walnuts',
      sub: 'kernels, 100% pure',
      cat: 'Kashmiri Dry Fruits',
      price: 480,
      unit: 'per 100 g',
      mode: 'later',
      img: IMG_BASE + 'catalog-prod-9.jpg',
      tint: '#7A5230',
      desc: '100% pure premium Kashmiri walnut kernels, rich in omega-3. Brought directly from the farms of Kashmir.'
    },
    {
      id: 'sauf',
      name: 'Sauf',
      sub: 'after-meal fennel',
      cat: 'Food',
      price: 180,
      unit: 'per 100 g',
      mode: 'later',
      img: IMG_BASE + '1789298594795-56f77e01-5e72-4d22-941e-0d044e8a595a.png',
      tint: '#7FA64B',
      desc: 'Fragrant fennel for the end of a good meal.'
    }
  ]
};

export const formatRupee = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
