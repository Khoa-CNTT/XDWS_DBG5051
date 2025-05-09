

export interface FoodItem {
  id: number;
  name: string;
  category_id: number;
  image: string | null;
  price: number;
  // status?: StatusTypeFood;
}

export type StatusTypeFood = 'Còn' | 'Hết';


