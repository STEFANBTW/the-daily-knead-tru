export const placeholderImage =
  "https://images.unsplash.com/photo-1544025162-811c75cce87b?q=80&w=800";

const categoryImages = [
  "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=1200", // Proteins
  "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1200", // Soups
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200", // Swallow
  "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?q=80&w=1200", // Rice Dishes
  "https://images.unsplash.com/photo-1604329760661-e71cb83655dc?q=80&w=1200", // Beans
  "https://plus.unsplash.com/premium_photo-1663127043869-906cbba9ff91?q=80&w=1200", // Breakfast
  "https://images.unsplash.com/photo-1626804475297-4160a2ab1c4b?q=80&w=1200", // Small Chops
  "https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=1200", // Drinks
  "https://images.unsplash.com/photo-1544025162-811c75cce87b?q=80&w=1200", // Combos
];

const expandItems = (items: any[], catIdx: number, catName: string) => {
  return items.map((item) => {
    let spiceLevel = "Mild";
    let spiceLevelIndex = 1;
    let nameLower = item.name.toLowerCase();

    if (
      nameLower.includes("pepper") ||
      nameLower.includes("ayamase") ||
      nameLower.includes("suya") ||
      nameLower.includes("spicy")
    ) {
      spiceLevel = "Extra Hot";
      spiceLevelIndex = 3;
    } else if (
      nameLower.includes("jollof") ||
      nameLower.includes("efo") ||
      nameLower.includes("banga") ||
      nameLower.includes("shawarma")
    ) {
      spiceLevel = "Medium";
      spiceLevelIndex = 2;
    }

    return {
      ...item,
      image: categoryImages[catIdx] || placeholderImage,
      description:
        item.description ||
        `Rich, authentic ${item.name} cooked to perfection and bursting with local flavors.`,
      ingredients: item.ingredients || [
        "Premium Base",
        "Local Spices",
        "Aromatics",
        "Signature Seasoning",
        "Palm Oil",
      ],
      portionSize: item.portionSize || "Serves 1 Adult",
      spiceLevel,
      spiceLevelIndex,
      allergens: item.allergens || ["None"],
      prepTime: item.prepTime || "Ready in 10-15 mins",
      popularity: item.popularity || "4.8 ★ (120 reviews)",
      comboLink: item.comboLink,
      customization: item.customization || [
        { name: "Extra Portion", price: "₦1,000" },
        { name: "Add Plantain", price: "₦500" },
        { name: "Extra Protein", price: "₦1,500" },
      ],
      category: catName,
    };
  });
};

export const menuSections = [
  {
    title: "Proteins",
    items: expandItems(
      [
        {
          name: "Beef (regular)",
          price: "₦1,200",
          prepTime: "Ready in 5 mins",
          customization: [{ name: "Extra Beef", price: "₦1,200" }],
        },
        {
          name: "Goat meat",
          price: "₦1,800",
          description:
            "Tender, well-seasoned goat meat chunks with a slight smoky profile.",
        },
        { name: "Chicken (soft)", price: "₦1,600", popularity: "Best Seller" },
        { name: "Chicken (hard)", price: "₦2,000" },
        { name: "Turkey", price: "₦2,800" },
        { name: "Assorted meat", price: "₦1,800" },
        {
          name: "Catfish (portion)",
          price: "₦2,500",
          prepTime: "Grilled fresh — 15 mins",
          allergens: ["Contains fish"],
        },
        { name: "Snail", price: "₦4,500" },
        { name: "Prawns", price: "₦3,500", allergens: ["Contains shellfish"] },
        {
          name: "Grilled tilapia/croaker",
          price: "₦4,500",
          prepTime: "Ready in 20 mins",
          allergens: ["Contains fish"],
        },
        { name: "Fresh fish", price: "₦3,000", allergens: ["Contains fish"] },
      ],
      0,
      "Proteins",
    ),
  },
  {
    title: "Soups (Per Portion, Without Swallow)",
    items: expandItems(
      [
        {
          name: "Egusi",
          price: "₦1,800",
          description:
            "Rich, deeply satisfying Egusi soup prepared with melon seeds, leafy greens, and palm oil.",
          comboLink: "Combo C: Eba + Egusi + Beef",
          ingredients: [
            "Ground melon seeds",
            "Palm oil",
            "Vegetables",
            "Locust beans",
          ],
        },
        {
          name: "Ogbono",
          price: "₦1,800",
          comboLink: "Combo G: Snail + Soup + Swallow",
        },
        { name: "Efo riro", price: "₦2,000" },
        { name: "Okra", price: "₦1,500" },
        { name: "Afang", price: "₦2,000", comboLink: "South-South Combo" },
        { name: "Edikaikong", price: "₦2,500" },
        { name: "Banga", price: "₦2,000" },
        {
          name: "Ayamase stew",
          price: "₦2,500",
          comboLink: "Combo E: Ofada Rice + Ayamase + Assorted",
        },
        { name: "Gbegiri", price: "₦1,000", comboLink: "Yoruba Combo" },
        { name: "Ewedu", price: "₦1,000", comboLink: "Yoruba Combo" },
        { name: "Buka stew", price: "₦1,500" },
        { name: "Oha soup", price: "₦2,000", comboLink: "Igbo Combo" },
        { name: "Bitterleaf soup", price: "₦2,000", comboLink: "Igbo Combo" },
        { name: "Miyan kuka", price: "₦1,800", comboLink: "Hausa Combo" },
        { name: "Miyan taushe", price: "₦1,800", comboLink: "Hausa Combo" },
        {
          name: "Catfish pepper soup",
          price: "₦3,500",
          comboLink: "Combo L: Catfish Pepper Soup + Drink",
        },
      ],
      1,
      "Soups",
    ),
  },
  {
    title: "Swallow",
    items: expandItems(
      [
        { name: "Eba", price: "₦500" },
        { name: "Amala", price: "₦600", comboLink: "Yoruba Combo" },
        { name: "Semo", price: "₦600" },
        { name: "Fufu", price: "₦500" },
        { name: "Pounded yam", price: "₦900" },
        { name: "Tuwo shinkafa", price: "₦800", comboLink: "Hausa Combo" },
        { name: "Garri", price: "₦500" },
      ],
      2,
      "Swallow",
    ),
  },
  {
    title: "Rice Dishes",
    items: expandItems(
      [
        {
          name: "Jollof rice",
          price: "₦1,200",
          popularity: "Number 1 Best Seller",
          description:
            "Rich, smoky party-style jollof cooked with firewood flavor.",
          comboLink: "Combo A: Jollof + Chicken + Drink",
          ingredients: [
            "Long-grain rice",
            "Tomato-pepper base",
            "Aromatics",
            "Firewood smoke",
          ],
        },
        { name: "Fried rice", price: "₦1,300" },
        {
          name: "White rice",
          price: "₦900",
          comboLink: "Combo B: White Rice + Stew + Beef + Plantain",
        },
        { name: "Coconut rice", price: "₦1,400" },
        {
          name: "Ofada rice",
          price: "₦1,800",
          comboLink: "Combo E: Ofada Rice + Ayamase + Assorted",
        },
      ],
      3,
      "Rice Dishes",
    ),
  },
  {
    title: "Beans, Yam & Plantain",
    items: expandItems(
      [
        {
          name: "Beans",
          price: "₦900",
          comboLink: "Combo D: Beans + Plantain + Beef",
        },
        {
          name: "Beans + plantain",
          price: "₦1,600",
          popularity: "Office Worker Favorite",
        },
        { name: "Moi moi", price: "₦600" },
        { name: "Yam porridge", price: "₦1,200" },
        {
          name: "Boiled yam + egg sauce",
          price: "₦1,600",
          comboLink: "Combo J: Yam + Egg Sauce",
        },
        { name: "Fried plantain", price: "₦600" },
      ],
      4,
      "Beans, Yam & Plantain",
    ),
  },
  {
    title: "Breakfast & Fast Foods",
    items: expandItems(
      [
        {
          name: "Stir-fried spaghetti",
          price: "₦1,500",
          comboLink: "Combo I: Spaghetti + Egg + Plantain",
        },
        { name: "Boiled/fried egg", price: "₦500" },
        { name: "Akara", price: "₦600", comboLink: "Combo N: Akara + Pap" },
        { name: "Pap (ogi)", price: "₦400" },
        {
          name: "Bread",
          price: "₦500",
          comboLink: "Combo O: Bread + Egg + Tea",
        },
        { name: "Hot tea", price: "₦500" },
        {
          name: "Indomie (Noodles)",
          price: "₦1,200",
          comboLink: "Combo P: Noodles + Egg + Sausage",
        },
        { name: "Sausage", price: "₦400" },
      ],
      5,
      "Breakfast & Fast Foods",
    ),
  },
  {
    title: "Small Chops & Extras",
    items: expandItems(
      [
        { name: "Puff puff", price: "₦500" },
        { name: "Samosa", price: "₦500" },
        { name: "Spring rolls", price: "₦500" },
        { name: "Shawarma", price: "₦3,000", prepTime: "Ready in 10 mins" },
        { name: "Suya", price: "₦2,000" },
        { name: "Coleslaw", price: "₦500" },
        { name: "French fries (Chips)", price: "₦1,500" },
      ],
      6,
      "Small Chops & Extras",
    ),
  },
  {
    title: "Drinks",
    items: expandItems(
      [
        { name: "Soft drinks", price: "₦500" },
        { name: "Malt", price: "₦700" },
        {
          name: "Zobo",
          price: "₦500",
          description:
            "Vibrant, chilled hibiscus tea infused with pineapple and warming spices.",
        },
        { name: "Smoothies", price: "₦2,500" },
      ],
      7,
      "Drinks",
    ),
  },
  {
    title: "Combos (Guaranteed Movers)",
    items: expandItems(
      [
        {
          name: "Combo A: Jollof + Chicken + Drink",
          price: "₦3,300",
          description:
            "Lagos classic, works for all tribes, office workers love it.",
          ingredients: ["Jollof rice", "1 piece chicken", "1 drink"],
        },
        {
          name: "Combo B: White Rice + Stew + Beef + Plantain",
          price: "₦2,800",
          description: "Cheap to produce, high margin, comfort food.",
          ingredients: [
            "White rice",
            "Tomato stew",
            "1 beef",
            "Fried plantain",
          ],
        },
        {
          name: "Combo C: Eba + Egusi + Beef",
          price: "₦2,500",
          description: "Egusi is the most universally loved Nigerian soup.",
          ingredients: ["Eba", "Egusi soup", "1 beef"],
        },
        {
          name: "Combo D: Beans + Plantain + Beef",
          price: "₦2,200",
          description:
            "Very high profit margin, filling, popular with students & workers.",
          ingredients: ["Ewa riro", "Fried plantain", "1 beef"],
        },
      ],
      8,
      "Combos (Guaranteed Movers)",
    ),
  },
  {
    title: "Premium Combos",
    items: expandItems(
      [
        {
          name: "Combo E: Ofada Rice + Ayamase + Assorted",
          price: "₦4,500",
          description: "Trendy, premium, Yoruba favorite.",
          ingredients: ["Ofada rice", "Ayamase stew", "Assorted meat"],
        },
        {
          name: "Combo F: Grilled Fish + Plantain + Coleslaw",
          price: "₦5,500",
          description: "Perfect for evenings, couples, and weekend customers.",
          ingredients: [
            "Grilled tilapia/croaker",
            "Fried plantain",
            "Coleslaw",
          ],
        },
        {
          name: "Combo G: Snail + Soup + Swallow",
          price: "₦6,000",
          description:
            "Luxury combo, high margin, Igbo & Yoruba customers love it.",
          ingredients: ["Snail", "Any soup", "Any swallow"],
        },
      ],
      8,
      "Premium Combos",
    ),
  },
  {
    title: "Tribal Favorites",
    items: expandItems(
      [
        {
          name: "Yoruba Combo",
          price: "₦3,500",
          description:
            "Amala + Gbegiri + Ewedu + Buka stew + Assorted meat. Yoruba customers will come back daily for this.",
          ingredients: [
            "Amala",
            "Gbegiri",
            "Ewedu",
            "Buka stew",
            "Assorted meat",
          ],
        },
        {
          name: "Igbo Combo",
          price: "₦4,000",
          description:
            "Fufu or pounded yam + Oha or Bitterleaf soup + Goat meat.",
          ingredients: [
            "Fufu or pounded yam",
            "Oha or Bitterleaf soup",
            "Goat meat",
          ],
        },
        {
          name: "Hausa Combo",
          price: "₦3,200",
          description: "Tuwo shinkafa + Miyan kuka or miyan taushe + Beef.",
          ingredients: ["Tuwo shinkafa", "Miyan kuka or miyan taushe", "Beef"],
        },
        {
          name: "South-South Combo",
          price: "₦4,500",
          description:
            "Garri or pounded yam + Afang or Edikaikong + Fresh fish.",
          ingredients: ["Garri or pounded yam", "Afang", "Fresh fish"],
        },
      ],
      8,
      "Tribal Favorites",
    ),
  },
  {
    title: "Office Worker Lunch Packs",
    items: expandItems(
      [
        {
          name: "Combo H: Jollof Mini Pack",
          price: "₦1,500",
          description: "Small jollof + 1 beef. Perfect for tight budgets.",
          ingredients: ["Small jollof", "1 beef"],
        },
        {
          name: "Combo I: Spaghetti + Egg + Plantain",
          price: "₦1,800",
          description: "Cheap, fast, filling lunch.",
          ingredients: [
            "Stir-fried spaghetti",
            "1 boiled/fried egg",
            "Plantain",
          ],
        },
        {
          name: "Combo J: Yam + Egg Sauce",
          price: "₦2,000",
          description: "High margin, very popular in offices.",
          ingredients: ["Boiled yam", "Egg sauce"],
        },
      ],
      8,
      "Office Worker Lunch Packs",
    ),
  },
  {
    title: "Weekend Specials",
    items: expandItems(
      [
        {
          name: "Combo K: Grilled Chicken + Chips",
          price: "₦4,000",
          description: "Perfect for outings and casual dates.",
          ingredients: ["Grilled chicken", "French fries"],
        },
        {
          name: "Combo L: Catfish Pepper Soup + Drink",
          price: "₦4,000",
          description: "Weekend relaxation food.",
          ingredients: ["Catfish pepper soup", "1 drink"],
        },
        {
          name: "Combo M: Family Jollof Pack",
          price: "₦12,000",
          description:
            "4 portions jollof + 4 chicken + 4 drinks. Families love bundle deals.",
          ingredients: ["4 portions jollof", "4 chicken", "4 drinks"],
          portionSize: "Serves 4",
        },
      ],
      8,
      "Weekend Specials",
    ),
  },
  {
    title: "Breakfast Combos",
    items: expandItems(
      [
        {
          name: "Combo N: Akara + Pap",
          price: "₦1,000",
          description: "Cheap, fast, nostalgic breakfast.",
          ingredients: ["Akara", "Pap (ogi)"],
        },
        {
          name: "Combo O: Bread + Egg + Tea",
          price: "₦1,500",
          description: "Office workers love it.",
          ingredients: ["Bread", "Fried egg", "Hot tea"],
        },
        {
          name: "Combo P: Noodles + Egg + Sausage",
          price: "₦1,800",
          description: "Youth favorite.",
          ingredients: ["Indomie", "Egg", "Sausage"],
        },
      ],
      8,
      "Breakfast Combos",
    ),
  },
];
