export type MenuCategory = 'All' | 'Pizza' | 'Pasta' | 'Starters' | 'Desserts'

export interface MenuItem {
  id: string
  name: string
  category: Exclude<MenuCategory, 'All'>
  image: string
  description: string
  tag?: string
}

export const menuItems: MenuItem[] = [
  // Signature Pizzas
  {
    id: 'pitfire-primo',
    name: 'Pitfire Primo',
    category: 'Pizza',
    image: '/Menu/pitfire-primo-600x566.png',
    description: 'Our flagship creation — the one that started it all',
    tag: 'Signature',
  },
  {
    id: 'five-star',
    name: 'Five Star',
    category: 'Pizza',
    image: '/Menu/five-star-600x581.png',
    description: 'Five premium ingredients, one unforgettable pizza',
    tag: 'Signature',
  },
  {
    id: 'hells-kitchen',
    name: "Hell's Kitchen",
    category: 'Pizza',
    image: '/Menu/hells-kitchen-600x579.png',
    description: 'Bold, fiery, unapologetic — not for the faint of heart',
    tag: 'Spicy',
  },
  {
    id: 'truff-daddy',
    name: 'Truff Daddy',
    category: 'Pizza',
    image: '/Menu/truff-dadddy-600x589.png',
    description: 'Black truffle luxury on a 72-hour fermented crust',
    tag: 'Premium',
  },
  {
    id: 'hipster',
    name: 'Hipster',
    category: 'Pizza',
    image: '/Menu/hipster-600x584.png',
    description: 'Artisanal toppings, handcrafted with intention',
    tag: 'Fan Favourite',
  },
  {
    id: 'stube-special',
    name: 'Stube Special',
    category: 'Pizza',
    image: '/Menu/stube-special-600x560.png',
    description: 'A timeless recipe, refined over decades of craft',
  },
  {
    id: 'the-palm',
    name: 'The Palm',
    category: 'Pizza',
    image: '/Menu/the-palm-600x570.png',
    description: "Inspired by Dubai's iconic spirit — vibrant and bold",
  },
  {
    id: 'bills-special',
    name: "Bill's Special",
    category: 'Pizza',
    image: '/Menu/bills-special-600x578.png',
    description: 'A legendary creation born from passion and curiosity',
  },
  {
    id: 'pepp-primo',
    name: 'Pepp Primo',
    category: 'Pizza',
    image: '/Menu/pepp-primo-600x579.png',
    description: 'Premium pepperoni stacked high on silky tomato',
  },
  {
    id: 'spicy-salami',
    name: 'Spicy Salami',
    category: 'Pizza',
    image: '/Menu/spicy-salami-600x577.png',
    description: 'Italian salami with a slow, building heat',
    tag: 'Spicy',
  },
  {
    id: 'blonde-bombshell',
    name: 'Blonde Bombshell',
    category: 'Pizza',
    image: '/Menu/blonde-bombshell-600x300.png',
    description: 'Golden, crispy, irresistibly light — a white pizza revelation',
  },
  {
    id: 'breasola-rocket',
    name: 'Bresaola Rocket',
    category: 'Pizza',
    image: '/Menu/breasola-rocket-600x591.png',
    description: 'Silky bresaola, peppery wild rocket, shaved parmesan',
    tag: 'Premium',
  },
  {
    id: 'buffalo-chicken',
    name: 'Buffalo Chicken',
    category: 'Pizza',
    image: '/Menu/buffalo-chicken-2-600x557.png',
    description: 'Pulled chicken tossed in house-made buffalo sauce',
    tag: 'Spicy',
  },
  {
    id: 'fresh-veggie',
    name: 'Fresh Veggie',
    category: 'Pizza',
    image: '/Menu/fresh-veggie-600x594.png',
    description: 'Seasonal garden vegetables, locally sourced daily',
  },
  {
    id: 'hawaii-five-oh',
    name: 'Hawaii Five-Oh',
    category: 'Pizza',
    image: '/Menu/hawaii-five-oh-600x566.png',
    description: 'Tropical flavors that transport you to the islands',
  },
  {
    id: 'royal-hawaiian',
    name: 'Royal Hawaiian',
    category: 'Pizza',
    image: '/Menu/royal-hawaiian-600x594.png',
    description: 'Our elevated take on the classic — a royal upgrade',
    tag: 'Premium',
  },
  {
    id: 'margherita',
    name: 'Margherita',
    category: 'Pizza',
    image: '/Menu/margherita-2-600x580.png',
    description: 'Italian tomatoes, fresh local mozzarella, basil — perfection',
    tag: 'Classic',
  },
  {
    id: 'plain-jane',
    name: 'Plain Jane',
    category: 'Pizza',
    image: '/Menu/plain-jane-597x600.png',
    description: 'Beautifully simple — when the craft speaks for itself',
    tag: 'Classic',
  },
  {
    id: 'white-pie',
    name: 'White Pie',
    category: 'Pizza',
    image: '/Menu/white-pie-600x572.png',
    description: 'Béchamel base, fresh mozzarella, a touch of garlic',
  },
  {
    id: 'veggie-primo',
    name: 'Veggie Primo',
    category: 'Pizza',
    image: '/Menu/veggie-primo-600x523.png',
    description: 'A garden of flavors on our artisan crust',
  },
  {
    id: 'veggie-rainbow',
    name: 'Veggie Rainbow',
    category: 'Pizza',
    image: '/Menu/veggie-rainbow-600x600.png',
    description: 'Vibrant, colorful, and bursting with freshness',
  },
  {
    id: 'spudnik',
    name: 'Spudnik',
    category: 'Pizza',
    image: '/Menu/spudnick-2-600x598.png',
    description: 'Potato, caramelized onion, rosemary, sea salt — earthy bliss',
  },
  // Pasta
  {
    id: 'black-truffle-linguine',
    name: 'Black Truffle Linguine',
    category: 'Pasta',
    image: '/Menu/black-truffle-cream-linguine-600x600.png',
    description: 'Silky cream sauce infused with black truffle',
    tag: 'Premium',
  },
  {
    id: 'penne-alfredo',
    name: 'Penne Alfredo',
    category: 'Pasta',
    image: '/Menu/penne-alfredo-600x600.png',
    description: 'Classic Alfredo, made from scratch every day',
    tag: 'Classic',
  },
  {
    id: 'penne-arrabiata',
    name: 'Penne Arrabbiata',
    category: 'Pasta',
    image: '/Menu/penne-arrabiata-600x600.png',
    description: 'Spicy crushed tomato sauce, al dente perfection',
    tag: 'Spicy',
  },
  {
    id: 'sausage-penne',
    name: 'Sausage Penne',
    category: 'Pasta',
    image: '/Menu/Sausage-Penne-new-600x600.png',
    description: 'House-made Italian sausage in rich tomato sauce',
  },
  {
    id: 'mac-cheese',
    name: 'Mac & Cheese',
    category: 'Pasta',
    image: '/Menu/mac-cheese-600x600.png',
    description: 'Creamy, indulgent, house-made — a comfort classic',
  },
  // Starters
  {
    id: 'buffalo-wings',
    name: 'Buffalo Wings',
    category: 'Starters',
    image: '/Menu/buffalo-wings-600x600.png',
    description: 'Crispy wings tossed in our signature buffalo sauce',
    tag: 'Spicy',
  },
  {
    id: 'garlic-knots',
    name: 'Garlic Knots',
    category: 'Starters',
    image: '/Menu/garlic-knots-600x600.png',
    description: 'Butter-basted, herb-dusted, irresistibly pillowy',
  },
  {
    id: 'caesar',
    name: 'Caesar Salad',
    category: 'Starters',
    image: '/Menu/ceaser-600x600.png',
    description: 'House dressing made fresh, crisp romaine, aged parmesan',
    tag: 'Classic',
  },
  // Desserts
  {
    id: 'cookie-brownie',
    name: 'Cookie Brownie',
    category: 'Desserts',
    image: '/Menu/Chocolate-Chip-Cookie-Brownie-600x300.png',
    description: 'Chocolate chip cookie meets brownie — house-made daily',
  },
  {
    id: 'apple-pie',
    name: "Michele's Apple Pie",
    category: 'Desserts',
    image: '/Menu/Micheles-Apple-Pie-600x300.png',
    description: 'A cherished family recipe, baked with love every day',
  },
]

export const categories: MenuCategory[] = ['All', 'Pizza', 'Pasta', 'Starters', 'Desserts']
