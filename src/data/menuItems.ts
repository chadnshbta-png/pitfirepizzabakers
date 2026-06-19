export type MenuCategory =
  | 'All'
  | 'Pizza'
  | 'Melts'
  | 'Pasta'
  | 'Wings'
  | 'Sides'
  | 'Desserts'

export interface MenuItem {
  id: string
  name: string
  category: Exclude<MenuCategory, 'All'>
  image: string
  description: string
  tag?: string
}

/* ──────────────────────────────────────────────────────────────────────
   Pizza Hut Jeddah catalogue — real product imagery in /public/Menu/*
   ────────────────────────────────────────────────────────────────────── */
export const menuItems: MenuItem[] = [
  // ── Pizzas ──────────────────────────────────────────────────────────
  {
    id: 'super-supreme',
    name: 'Super Supreme',
    category: 'Pizza',
    image: '/Menu/pizza/super-supreme-ph5775.png',
    description: 'Pepperoni, beef, chicken, peppers & mushrooms — the everything pizza.',
    tag: 'Bestseller',
  },
  {
    id: 'chicken-supreme',
    name: 'Chicken Supreme',
    category: 'Pizza',
    image: '/Menu/pizza/chicken-supreme-ph6545.png',
    description: 'Tender chicken, onions, peppers and mushrooms on signature sauce.',
    tag: 'Signature',
  },
  {
    id: 'supreme',
    name: 'Supreme',
    category: 'Pizza',
    image: '/Menu/pizza/supreme-ph6232.png',
    description: 'A bold layering of meats and garden vegetables on every slice.',
  },
  {
    id: 'pepperoni',
    name: 'Classic Pepperoni',
    category: 'Pizza',
    image: '/Menu/pizza/pepproni-ph1818.png',
    description: 'Generous pepperoni over melted mozzarella — a timeless favourite.',
    tag: 'Classic',
  },
  {
    id: 'margherita',
    name: 'Classic Margherita',
    category: 'Pizza',
    image: '/Menu/pizza/margarita8289.png',
    description: 'Rich tomato sauce and a blanket of stretchy mozzarella. Pure.',
    tag: 'Classic',
  },
  {
    id: 'hawaiian',
    name: 'Hawaiian',
    category: 'Pizza',
    image: '/Menu/pizza/hawaiin-ph9500.png',
    description: 'Sweet pineapple and savoury chicken in perfect island balance.',
  },
  {
    id: 'very-veggie',
    name: 'Very Veggie',
    category: 'Pizza',
    image: '/Menu/pizza/vegetarian-ph3596.png',
    description: 'Peppers, onions, mushrooms and olives — a garden on a crust.',
  },
  {
    id: 'spicy-hot-chicken',
    name: 'Spicy Hot Chicken',
    category: 'Pizza',
    image: '/Menu/pizza/spicy-hot-chicken-ph9004.png',
    description: 'Fiery chicken with a slow, building heat for the bold.',
    tag: 'Spicy',
  },
  {
    id: 'spicy-chicken-ranch',
    name: 'Spicy Chicken Ranch',
    category: 'Pizza',
    image: '/Menu/pizza/spicy-chicken-ranch4791.png',
    description: 'Spiced chicken cooled by a creamy house ranch drizzle.',
    tag: 'Spicy',
  },
  {
    id: 'spicy-hot-beef',
    name: 'Spicy Hot Beef',
    category: 'Pizza',
    image: '/Menu/pizza/spicy-hot-beef2638.png',
    description: 'Seasoned beef with chillies that bite back — unapologetically.',
    tag: 'Spicy',
  },
  {
    id: 'seafood-supreme',
    name: 'Seafood Supreme',
    category: 'Pizza',
    image: '/Menu/pizza/seafood-ph9375.png',
    description: 'A premium catch of the sea over rich tomato and mozzarella.',
    tag: 'Premium',
  },
  {
    id: 'prawn-special',
    name: 'Prawn Special',
    category: 'Pizza',
    image: '/Menu/pizza/prawn-ph2344.png',
    description: 'Plump prawns and aromatics for a refined seafood indulgence.',
    tag: 'Premium',
  },
  {
    id: 'tuna',
    name: 'Tuna Delight',
    category: 'Pizza',
    image: '/Menu/pizza/tuna8738.png',
    description: 'Flaked tuna, onions and a whisper of the Mediterranean.',
  },

  // ── Melts ───────────────────────────────────────────────────────────
  {
    id: 'melts-pepperoni',
    name: 'Pepperoni Lovers Melt',
    category: 'Melts',
    image: '/Menu/meal/melts-pepperoni-lovers4673.png',
    description: 'Folded, loaded and melted — pepperoni in every single bite.',
    tag: 'New',
  },
  {
    id: 'melts-meat',
    name: 'Meat Lovers Melt',
    category: 'Melts',
    image: '/Menu/meal/melts-meat-lovers2353.png',
    description: 'A carnivore’s pocket of pepperoni, beef and molten cheese.',
  },
  {
    id: 'melts-chicken-ranch',
    name: 'Chicken Spicy Ranch Melt',
    category: 'Melts',
    image: '/Menu/meal/melts-chicken-spicy-ranch6459.png',
    description: 'Spiced chicken and cool ranch sealed in a crisp golden fold.',
    tag: 'Spicy',
  },

  // ── Pasta ───────────────────────────────────────────────────────────
  {
    id: 'chicken-alfredo-bake',
    name: 'Chicken Alfredo Bake',
    category: 'Pasta',
    image: '/Menu/pasta/chicken-alfredo-bake-5248.png',
    description: 'Creamy alfredo and chicken baked under a bubbling cheese crust.',
    tag: 'Baked',
  },
  {
    id: 'beef-lasagna',
    name: 'Beef Lasagna',
    category: 'Pasta',
    image: '/Menu/pasta/beef-lasagna9434.png',
    description: 'Layered pasta, rich beef ragù and slow-melted mozzarella.',
  },
  {
    id: 'spaghetti-bolognaise',
    name: 'Spaghetti Bolognaise',
    category: 'Pasta',
    image: '/Menu/pasta/spaghetti-bolognaise9232.png',
    description: 'Classic spaghetti tangled in a deep, slow-cooked beef sauce.',
    tag: 'Classic',
  },
  {
    id: 'chicken-mushroom-fettuccine',
    name: 'Chicken Mushroom Fettuccine',
    category: 'Pasta',
    image: '/Menu/pasta/chicken-mushroom-fetuccine5392.png',
    description: 'Silky fettuccine, sautéed mushrooms and tender chicken.',
  },
  {
    id: 'shrimp-fusilli',
    name: 'Shrimp Fusilli',
    category: 'Pasta',
    image: '/Menu/pasta/shrimp-fusili3905.png',
    description: 'Spiralled fusilli and sweet shrimp in a delicate cream sauce.',
    tag: 'Premium',
  },
  {
    id: 'vegetable-baked-pasta',
    name: 'Vegetable Baked Pasta',
    category: 'Pasta',
    image: '/Menu/pasta/vegetable-baked-pasta9117.png',
    description: 'Garden vegetables baked into a comforting cheesy gratin.',
  },

  // ── Wings ───────────────────────────────────────────────────────────
  {
    id: 'bone-in-wings',
    name: 'Bone-In Wings',
    category: 'Wings',
    image: '/Menu/wing/bone-in9399.png',
    description: 'Juicy, glazed and fire-kissed — wings the way they should be.',
    tag: 'Fan Favourite',
  },
  {
    id: 'boneless-wings',
    name: 'Boneless Wings',
    category: 'Wings',
    image: '/Menu/wing/bone-out5685.png',
    description: 'All the flavour, none of the bones. Crisp, saucy, addictive.',
  },

  // ── Sides ───────────────────────────────────────────────────────────
  {
    id: 'garlic-bread-supreme',
    name: 'Garlic Bread Supreme',
    category: 'Sides',
    image: '/Menu/Sides/garlic-bread-supreme5549.png',
    description: 'Toasted garlic bread crowned with a layer of melted cheese.',
    tag: 'Sharing',
  },
  {
    id: 'garlic-bread',
    name: 'Garlic Bread',
    category: 'Sides',
    image: '/Menu/Sides/garlic-bread-plain3586.png',
    description: 'Warm, buttery, herb-dusted — the perfect opening act.',
  },
  {
    id: 'cheesy-pops',
    name: 'Cheesy Pops',
    category: 'Sides',
    image: '/Menu/Sides/cheesy-pops9498.png',
    description: 'Golden bites with a molten cheese centre. One is never enough.',
  },
  {
    id: 'mozzarella-sticks',
    name: 'Mozzarella Sticks',
    category: 'Sides',
    image: '/Menu/Sides/mozzarella-sticks7643.png',
    description: 'Crisp on the outside, endlessly stretchy on the inside.',
  },
  {
    id: 'potato-wedges',
    name: 'Potato Wedges',
    category: 'Sides',
    image: '/Menu/Sides/potato-wedges4985.png',
    description: 'Thick-cut, seasoned and roasted to a golden crunch.',
  },
  {
    id: 'wedges-bbq-cheese',
    name: 'BBQ Cheese Wedges',
    category: 'Sides',
    image: '/Menu/Sides/wedges-bbq-and-cheese5066.png',
    description: 'Wedges loaded with smoky BBQ and a generous cheese melt.',
  },
  {
    id: 'wedges-buffalo-cheese',
    name: 'Buffalo Cheese Wedges',
    category: 'Sides',
    image: '/Menu/Sides/wedges-buffalo-and-cheese1067.png',
    description: 'Spicy buffalo heat blanketed in cooling melted cheese.',
    tag: 'Spicy',
  },
  {
    id: 'chicken-bbq-rolls',
    name: 'Chicken BBQ Rolls',
    category: 'Sides',
    image: '/Menu/Sides/chicken-bbq-rolls3108.png',
    description: 'Soft rolls stuffed with smoky BBQ chicken and cheese.',
  },
  {
    id: 'trio-platter',
    name: 'Trio Platter',
    category: 'Sides',
    image: '/Menu/Sides/trio-platter5084.png',
    description: 'Three of our best starters on one irresistible sharing board.',
    tag: 'Sharing',
  },

  // ── Desserts ────────────────────────────────────────────────────────
  {
    id: 'chocolate-cake',
    name: 'Chocolate Fudge Cake',
    category: 'Desserts',
    image: '/Menu/desserts/chocolate-cake1055.png',
    description: 'Deep, dark and decadent — fudge cake for the chocolate devout.',
  },
  {
    id: 'berry-cheesecake',
    name: 'Berry Cheesecake',
    category: 'Desserts',
    image: '/Menu/desserts/berry-cheesecake1308.png',
    description: 'Velvet cheesecake crowned with a bright berry compote.',
  },
  {
    id: 'strawberry-cheesecake',
    name: 'Strawberry Cheesecake',
    category: 'Desserts',
    image: '/Menu/desserts/strawberry-cheesecake9783.png',
    description: 'Creamy classic cheesecake swirled with ripe strawberry.',
  },
  {
    id: 'hershey-cookie',
    name: "Hershey's Choco Cookie",
    category: 'Desserts',
    image: '/Menu/desserts/hershey-choco-cookie5059.png',
    description: 'A warm, gooey cookie studded with melting Hershey’s chocolate.',
    tag: 'New',
  },
]

export const categories: MenuCategory[] = [
  'All',
  'Pizza',
  'Melts',
  'Pasta',
  'Wings',
  'Sides',
  'Desserts',
]

/* A few hero shots reused across cinematic sections */
export const heroPizza = '/Menu/pizza/super-supreme-ph5775.png'
export const signaturePizza = '/Menu/pizza/chicken-supreme-ph6545.png'
