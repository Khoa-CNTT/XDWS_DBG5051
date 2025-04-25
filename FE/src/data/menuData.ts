export interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  popular?: boolean;
}

const menuItems: MenuItem[] = [
  // Thịt bò (Beef)
  {
    id: 1,
    name: 'Nạc Vai & Mông Bò Angus 600gr',
    price: 829000,
    image: 'https://ext.same-assets.com/4045322680/1954679910.jpeg',
    description: 'Thịt bò Angus nhập khẩu, thái lát mỏng, khoảng 600gr',
    category: 'Thịt bò',
    popular: true
  },
  {
    id: 2,
    name: 'Nạc Vai & Nạc Lưng Bò Angus 600gr',
    price: 1079000,
    image: 'https://ext.same-assets.com/4045322680/2687931818.jpeg',
    description: 'Thịt bò Angus nhập khẩu, thái lát mỏng, khoảng 600gr',
    category: 'Thịt bò',
    popular: true
  },
  {
    id: 3,
    name: 'Nạc Vai & Thăn Ngoại Bò Angus 600gr',
    price: 969000,
    image: 'https://ext.same-assets.com/4045322680/796172650.jpeg',
    description: 'Thịt bò Angus nhập khẩu, thái lát mỏng, khoảng 600gr',
    category: 'Thịt bò'
  },
  {
    id: 4,
    name: 'Lõi Vai & Mông Bò Angus 600gr',
    price: 829000,
    image: 'https://ext.same-assets.com/4045322680/3396090845.jpeg',
    description: 'Thịt bò Angus nhập khẩu, thái lát mỏng, khoảng 600gr',
    category: 'Thịt bò'
  },
  {
    id: 5,
    name: 'Lõi Vai & Nạc Lưng Bò Angus 600gr',
    price: 1079000,
    image: 'https://ext.same-assets.com/4045322680/2564745887.jpeg',
    description: 'Thịt bò Angus nhập khẩu, thái lát mỏng, khoảng 600gr',
    category: 'Thịt bò'
  },
  {
    id: 6,
    name: 'Lõi Vai & Thăn Ngoại Bò Angus 600gr',
    price: 969000,
    image: 'https://ext.same-assets.com/4045322680/1502007300.jpeg',
    description: 'Thịt bò Angus nhập khẩu, thái lát mỏng, khoảng 600gr',
    category: 'Thịt bò'
  },
  {
    id: 7,
    name: 'Nạc Vai & Mông Bò Angus 300gr',
    price: 429000,
    image: '',
    description: 'Thịt bò Angus nhập khẩu, thái lát mỏng, khoảng 300gr',
    category: 'Thịt bò'
  },
  {
    id: 8,
    name: 'Nạc Vai & Nạc Lưng Bò Angus 300gr',
    price: 599000,
    image: '',
    description: 'Thịt bò Angus nhập khẩu, thái lát mỏng, khoảng 300gr',
    category: 'Thịt bò'
  },
  {
    id: 9,
    name: 'Nạc Vai & Thăn Ngoại Bò Angus 300gr',
    price: 489000,
    image: '',
    description: 'Thịt bò Angus nhập khẩu, thái lát mỏng, khoảng 300gr',
    category: 'Thịt bò'
  },
  {
    id: 10,
    name: 'Lõi Vai & Mông Bò Angus 300gr',
    price: 429000,
    image: '',
    description: 'Thịt bò Angus nhập khẩu, thái lát mỏng, khoảng 300gr',
    category: 'Thịt bò'
  },

  // Bộ Mặt Nhập Khẩu (Imported Beef Cuts)
  {
    id: 11,
    name: 'Nạc Vai Bò Mỹ Nhập Khẩu',
    price: 169000,
    image: '',
    description: 'Thịt bò Mỹ nhập khẩu, thái lát mỏng',
    category: 'Bộ Mặt Nhập Khẩu'
  },
  {
    id: 12,
    name: 'Lõi Vai Bò Mỹ Nhập Khẩu',
    price: 179000,
    image: '',
    description: 'Thịt bò Mỹ nhập khẩu, thái lát mỏng',
    category: 'Bộ Mặt Nhập Khẩu'
  },
  {
    id: 13,
    name: 'Mông Bò Mỹ Nhập Khẩu',
    price: 219000,
    image: '',
    description: 'Thịt bò Mỹ nhập khẩu, thái lát mỏng',
    category: 'Bộ Mặt Nhập Khẩu'
  },
  {
    id: 14,
    name: 'Nạc Lưng Bò Mỹ Nhập Khẩu',
    price: 279000,
    image: '',
    description: 'Thịt bò Mỹ nhập khẩu, thái lát mỏng',
    category: 'Bộ Mặt Nhập Khẩu'
  },
  {
    id: 15,
    name: 'Thăn Ngoại Bò Mỹ Nhập Khẩu',
    price: 269000,
    image: '',
    description: 'Thịt bò Mỹ nhập khẩu, thái lát mỏng',
    category: 'Bộ Mặt Nhập Khẩu'
  },

  // Thịt Heo (Pork)
  {
    id: 16,
    name: 'Ba Chỉ Heo',
    price: 149000,
    image: '',
    description: 'Thịt ba chỉ heo tươi thái lát mỏng',
    category: 'Thịt Heo',
    popular: true
  },
  {
    id: 17,
    name: 'Sườn Heo',
    price: 169000,
    image: '',
    description: 'Sườn heo tươi thái lát mỏng',
    category: 'Thịt Heo'
  },
  {
    id: 18,
    name: 'Nạc Vai Heo',
    price: 139000,
    image: '',
    description: 'Thịt nạc vai heo tươi thái lát mỏng',
    category: 'Thịt Heo'
  },
  {
    id: 19,
    name: 'Combo Thịt Heo (Ba Chỉ & Nạc Vai)',
    price: 249000,
    image: '',
    description: 'Kết hợp giữa ba chỉ heo và nạc vai heo tươi',
    category: 'Thịt Heo',
    popular: true
  },

  // Salad
  {
    id: 20,
    name: 'Salad Trộn Hàn Quốc',
    price: 55000,
    image: '',
    description: 'Salad rau củ trộn sốt mè kiểu Hàn Quốc',
    category: 'Salad'
  },
  {
    id: 21,
    name: 'Salad Cá Ngừ',
    price: 65000,
    image: '',
    description: 'Salad rau củ trộn cùng cá ngừ và sốt mè',
    category: 'Salad'
  },
  {
    id: 22,
    name: 'Kim Chi Cải Thảo',
    price: 45000,
    image: '',
    description: 'Kim chi cải thảo chua cay truyền thống',
    category: 'Salad',
    popular: true
  },

  // Cơm (Rice)
  {
    id: 23,
    name: 'Cơm Trộn Hàn Quốc',
    price: 85000,
    image: '',
    description: 'Cơm trộn với rau củ và trứng theo phong cách Hàn Quốc',
    category: 'Cơm',
    popular: true
  },
  {
    id: 24,
    name: 'Cơm Trắng',
    price: 25000,
    image: '',
    description: 'Cơm trắng dẻo thơm',
    category: 'Cơm'
  },
  {
    id: 25,
    name: 'Cơm Chiên Kim Chi',
    price: 75000,
    image: '',
    description: 'Cơm chiên với kim chi và các loại rau củ',
    category: 'Cơm'
  },

  // Món Truyền Thống (Traditional Dishes)
  {
    id: 26,
    name: 'Tokbokki - Bánh Gạo Xào Cay',
    price: 95000,
    image: '',
    description: 'Bánh gạo xào cay theo phong cách Hàn Quốc',
    category: 'Món Truyền Thống',
    popular: true
  },
  {
    id: 27,
    name: 'Mandu - Bánh Xếp Hàn Quốc',
    price: 85000,
    image: '',
    description: 'Bánh xếp nhân thịt kiểu Hàn Quốc',
    category: 'Món Truyền Thống'
  },
  {
    id: 28,
    name: 'Miến Trộn Hàn Quốc',
    price: 95000,
    image: '',
    description: 'Miến trộn với rau củ và thịt theo phong cách Hàn Quốc',
    category: 'Món Truyền Thống'
  },

  // Hải Sản (Seafood)
  {
    id: 29,
    name: 'Mực Tươi',
    price: 159000,
    image: '',
    description: 'Mực tươi thái lát mỏng để nướng',
    category: 'Hải Sản'
  },
  {
    id: 30,
    name: 'Tôm Sú',
    price: 189000,
    image: '',
    description: 'Tôm sú tươi để nướng',
    category: 'Hải Sản',
    popular: true
  },
  {
    id: 31,
    name: 'Combo Hải Sản',
    price: 329000,
    image: '',
    description: 'Kết hợp các loại hải sản tươi để nướng: mực, tôm, bạch tuộc',
    category: 'Hải Sản'
  },

  // Canh (Soup)
  {
    id: 32,
    name: 'Canh Kimchi',
    price: 65000,
    image: '',
    description: 'Canh truyền thống Hàn Quốc nấu với kimchi',
    category: 'Canh'
  },
  {
    id: 33,
    name: 'Canh Đậu Hũ',
    price: 55000,
    image: '',
    description: 'Canh đậu hũ với nấm và rong biển',
    category: 'Canh'
  },
  {
    id: 34,
    name: 'Canh Rong Biển',
    price: 55000,
    image: '',
    description: 'Canh rong biển truyền thống của Hàn Quốc',
    category: 'Canh'
  },

  // Lẩu (Hot Pot)
  {
    id: 35,
    name: 'Lẩu Kim Chi',
    price: 299000,
    image: '',
    description: 'Lẩu kim chi cay nồng đặc trưng của Hàn Quốc',
    category: 'Lẩu',
    popular: true
  },
  {
    id: 36,
    name: 'Lẩu Hải Sản',
    price: 359000,
    image: '',
    description: 'Lẩu hải sản với nước dùng đặc biệt',
    category: 'Lẩu'
  },
  {
    id: 37,
    name: 'Lẩu Thái',
    price: 319000,
    image: '',
    description: 'Lẩu Thái chua cay',
    category: 'Lẩu'
  },

  // Đồ Uống (Drinks)
  {
    id: 38,
    name: 'Soju Original',
    price: 120000,
    image: '',
    description: 'Rượu Soju truyền thống Hàn Quốc',
    category: 'Đồ Uống',
    popular: true
  },
  {
    id: 39,
    name: 'Soju Vị Đào',
    price: 130000,
    image: '',
    description: 'Rượu Soju vị đào',
    category: 'Đồ Uống'
  },
  {
    id: 40,
    name: 'Bia Hơi',
    price: 35000,
    image: '',
    description: 'Bia hơi tươi',
    category: 'Đồ Uống'
  },
  {
    id: 41,
    name: 'Coca Cola',
    price: 25000,
    image: '',
    description: 'Nước ngọt Coca Cola',
    category: 'Đồ Uống'
  },
  {
    id: 42,
    name: 'Nước Lọc',
    price: 15000,
    image: '',
    description: 'Nước lọc đóng chai',
    category: 'Đồ Uống'
  },

  // Tráng Miệng (Desserts)
  {
    id: 43,
    name: 'Bingsu Đậu Đỏ',
    price: 95000,
    image: '',
    description: 'Đá bào với đậu đỏ và kem kiểu Hàn Quốc',
    category: 'Tráng Miệng',
    popular: true
  },
  {
    id: 44,
    name: 'Bánh Gạo Ngọt',
    price: 45000,
    image: '',
    description: 'Bánh gạo nhân đậu đỏ ngọt truyền thống',
    category: 'Tráng Miệng'
  },
  {
    id: 45,
    name: 'Kem Matcha',
    price: 55000,
    image: '',
    description: 'Kem trà xanh Matcha',
    category: 'Tráng Miệng'
  }
];

export const categoryOrder = [
  'Thịt bò',
  'Bộ Mặt Nhập Khẩu',
  'Thịt Heo',
  'Hải Sản',
  'Lẩu',
  'Món Truyền Thống',
  'Cơm',
  'Canh',
  'Salad',
  'Đồ Uống',
  'Tráng Miệng'
];

export default menuItems;
