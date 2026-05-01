export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: "comida", name: "Comida", emoji: "🍔", color: "#FF8A65" },
  { id: "transporte", name: "Transporte", emoji: "🚗", color: "#64B5F6" },
  { id: "hogar", name: "Hogar", emoji: "🏠", color: "#81C784" },
  { id: "entretenimiento", name: "Entretenimiento", emoji: "🎮", color: "#CE93D8" },
  { id: "compras", name: "Compras", emoji: "🛒", color: "#FFD54F" },
  { id: "salud", name: "Salud", emoji: "💊", color: "#EF5350" },
  { id: "educacion", name: "Educación", emoji: "📚", color: "#4FC3F7" },
  { id: "mascotas", name: "Mascotas", emoji: "🐱", color: "#E8A87C" },
  { id: "servicios", name: "Servicios", emoji: "📱", color: "#90A4AE" },
  { id: "otros", name: "Otros", emoji: "✨", color: "#B0BEC5" },
];

export const getCategoryById = (id: string): Category => {
  return CATEGORIES.find((cat) => cat.id === id) || CATEGORIES[CATEGORIES.length - 1];
};
