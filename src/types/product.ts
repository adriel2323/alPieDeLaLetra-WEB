export type ProductCategory = 'agendas' | 'cuadernos' | 'recetarios' | 'libretas';

export type ProductSize = 'A5' | 'A4' | 'A4.5' | 'Pocket';

export type InteriorType = 
  | 'semanal' 
  | 'dos-por-hoja' 
  | 'universitaria' 
  | 'docente' 
  | 'perpetua'
  | 'rayado'
  | 'liso'
  | 'cuadriculado'
  | 'recetas';

export type CoverType = 'dura' | 'blanda';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  description: string;
  basePrice: number;
  sizes: ProductSize[];
  interiors: InteriorType[];
  coverTypes: CoverType[];
  images: string[];
  materials: string[];
  includes: string[];
  productionTime: string;
  inStock: boolean;
  weeklyQuota: number;
  remainingQuota: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: ProductSize;
  selectedInterior: InteriorType;
  selectedCover: CoverType;
  personalization?: string;
  price: number;
}
