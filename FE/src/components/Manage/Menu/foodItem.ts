export interface FoodItem {
  id: number;
  name: string;
  image: string;
  price: number;
  type: string;
  status: StatusTypeFood;
}

export type StatusTypeFood = 'Còn' | 'Hết';

export const foodItem: FoodItem[] = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    name: "Phở Bò",
    price: 50000,
    type: "Khai Vị",
    status: 'Còn',
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1606857521015-7f2a06dc0a6d",
    name: "Bún Chả",
    price: 45000,
    type: "Thịt Bò",
    status: 'Còn',
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1631515243341-cb5eec36f2e3",
    name: "Gỏi Cuốn",
    price: 30000,
    type: "Thịt Heo",
    status: 'Còn',
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1585238341986-8b0f2b4f5f04",
    name: "Cơm Tấm",
    price: 55000,
    type: "Thịt Gà",
    status: 'Còn',
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f",
    name: "Bún Bò Huế",
    price: 60000,
    type: "Thịt Bò",
    status: 'Còn',
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1613141411444-29248a6ec632",
    name: "Mì Quảng",
    price: 45000,
    type: "Thịt Gà",
    status: 'Còn',
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1590080878457-c9c9b70c6c37",
    name: "Cháo Lòng",
    price: 40000,
    type: "Nội Tạng",
    status: 'Còn',
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85",
    name: "Canh Chua Cá",
    price: 50000,
    type: "Hải Sản",
    status: 'Còn',
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    name: "Cá Kho Tộ",
    price: 60000,
    type: "Hải Sản",
    status: 'Còn',
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1601050690590-34b4c5c9cc20",
    name: "Bánh Xèo",
    price: 35000,
    type: "Ăn Vặt",
    status: 'Còn',
  },
];
