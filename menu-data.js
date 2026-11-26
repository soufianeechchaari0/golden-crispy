// ============================================================
//  GOLDEN CRISPY — données du menu + configuration
//  Modifiez ce fichier à la main, ou utilisez admin.html pour
//  en générer une version à jour, puis re-déployez sur Vercel.
// ============================================================

const CONFIG = {
  name: "Golden Crispy",
  nameAr: "غولدن كريسبي",
  tagline: "Poulet croustillant, boxes, burgers, wraps et tacos faits pour les gourmands.",
  // ⚠️ À remplacer par les vraies informations
  whatsapp: "212680590041",            // format international, sans + ni espaces
  phoneDisplay: "+212 6 00 00 00 00",
  address: "4RQQ+8RP, Laayoune 70000",
  hours: "13:00–02:00",
  mapUrl: "https://maps.app.goo.gl/k6KYxkzbBkVmoYhm7",                          // lien Google Maps (optionnel)
  instagram: "goldenn_crispy",
  currency: "DH",
  // Chiffres du bandeau d'accueil. "to": un nombre, ou "plats" / "categories" (calculé automatiquement)
  stats: [
    { to: 100, suffix: "%", label: "Croustillant" },
    { to: "plats", label: "Plats au menu" },
    { to: 7, suffix: "j/7", label: "Service" }
  ],
  // Crédit développeur affiché en bas de page (laissez name vide pour le masquer)
  developer: { name: "SCH Solution", url: "https://www.instagram.com/invites/contact/?utm_content=nz16mu1&dmpr=3a0u7k750bl2" }   // ← mettez ici le lien de votre site web, ex : "https://sch-solutions.com"
};

// "img" (catégorie ou plat) est optionnel : chemin d'une photo dans le dossier images/
const MENU = [
  {
    id: "boxes", name: "Boxes", icon: "🍗", img: "images/boxes.jpg",
    items: [
      { id: "box-crispy-classique", name: "Box Crispy Classique", price: 28 },
      { id: "box-crispy-royal",     name: "Box Crispy Royal",     price: 30 },
      { id: "box-golden-crispy",    name: "Box Golden Crispy",    price: 30 },
      { id: "box-nuggets",          name: "Box Nuggets",          price: 25 }
    ]
  },
  {
    id: "burgers", name: "Burgers", icon: "🍔", img: "images/burgers.jpg",
    items: [
      { id: "burger-classique", name: "Burger Classique", price: 18 },
      { id: "burger-royal",     name: "Burger Royal",     price: 29 }
    ]
  },
  {
    id: "wraps", name: "Wraps", icon: "🌯", img: "images/wraps.jpg",
    items: [
      { id: "wrap-poulet-avocat", name: "Wrap Poulet Avocat", price: 27 },
      { id: "wrap-royal",         name: "Wrap Royal",         price: 27 },
      { id: "wrap-classique",     name: "Wrap Classique",     price: 25 }
    ]
  },
  {
    id: "tacos", name: "Tacos", icon: "🌮", img: "images/tacos.jpg",
    items: [
      { id: "tacos-classique",   name: "Tacos Classique",   price: 25 },
      { id: "tacos-royal",       name: "Tacos Royal",       price: 30 },
      { id: "tacos-mixte",       name: "Tacos Mixte",       price: 30 },
      { id: "tacos-cordon-bleu", name: "Tacos Cordon Bleu", price: 30 },
      { id: "tacos-nuggets",     name: "Tacos Nuggets",     price: 24 }
    ]
  },
  {
    id: "sandwiches", name: "Sandwiches", icon: "🥪", img: "images/sandwiches.jpg",
    items: [
      { id: "sandwich-crispy",      name: "Sandwich Crispy",      price: 18 },
      { id: "sandwich-royal",       name: "Sandwich Royal",       price: 23 },
      { id: "sandwich-cordon-bleu", name: "Sandwich Cordon Bleu", price: 20 },
      { id: "sandwich-nuggets",     name: "Sandwich Nuggets",     price: 20 }
    ]
  },
  {
    id: "extras", name: "Extras", icon: "🍟", img: "images/extras.jpg",
    items: [
      { id: "frites-golden-crispy", name: "Frites Golden Crispy", price: 10 }
    ]
  }
];
