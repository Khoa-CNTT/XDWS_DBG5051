import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../Api/AxiosIntance';
import './Menu.scss';
import LoadingSpinner from '../../components/Loading/LoadingSpinner.tsx';
import { getImageUrl } from '../../components/Manage/Menu/Menu.tsx';
// API Constants
const API_ENDPOINTS = {
  MENU: '/list-menu',
  CATEGORIES: '/cate',
  POPULAR_DISHES: '/popular-dishes'
};

// Define menu item type
type MenuItem = {
  category_id: any;
  id: string | number;
  name: string;
  price: number;
  category: {
    id: number;
    name: string;
  };
  image?: string;
  popular?: boolean;
  status: boolean;
};

const Menu = () => {
  // Thêm state để lưu trữ dữ liệu từ API
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categoryOrder, setCategoryOrder] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);

  // Search state
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [searchResults, setSearchResults] = useState<MenuItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);

  // Price filter state
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [isPriceFiltering, setIsPriceFiltering] = useState<boolean>(false);
  const [priceFilterPerformed, setPriceFilterPerformed] = useState<boolean>(false);
  const [priceFilterError, setPriceFilterError] = useState<string>('');

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Gọi cả ba API cùng lúc
        const [menuResponse, categoryResponse, popularResponse] = await Promise.all([
          api.get(API_ENDPOINTS.MENU),
          api.get(API_ENDPOINTS.CATEGORIES),
          api.get(API_ENDPOINTS.POPULAR_DISHES)
        ]);

        // Lấy dữ liệu từ API (kiểm tra xem có phải mảng không)
        const menuData = menuResponse.data.data;
        const categoryData = categoryResponse.data.data;
        const popularData = popularResponse.data;

        if (!Array.isArray(menuData) || !Array.isArray(categoryData)) {
          throw new Error('Dữ liệu API không đúng định dạng');
        }

        // Cập nhật danh sách món ăn
        setMenuItems(menuData);

        // Cập nhật danh mục (lấy từ API danh mục thay vì từ danh sách món)
        setCategoryOrder(categoryData.map(category => category.name));

        // Cập nhật danh sách món ăn phổ biến
        if (Array.isArray(popularData)) {
          setPopularItems(popularData);
        } else if (popularData && popularData.data && Array.isArray(popularData.data)) {
          setPopularItems(popularData.data);
        } else {
          console.error('Dữ liệu món phổ biến không đúng định dạng', popularData);
          // Fallback: nếu API trả về không đúng định dạng, sử dụng những món có flag popular = true
          setPopularItems(menuData.filter(item => item.popular).slice(0, 8));
        }

        setLoading(false);
      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        setLoading(false);
        console.error('Lỗi khi gọi API:', err);
      }
    };

    fetchData();
  }, []);

  // Helper functions using the state instead of imported data
  const groupMenuItemsByCategory = () => {
    const grouped: Record<string, MenuItem[]> = {};

    menuItems.forEach(item => {
      // Sử dụng item.category.name thay vì item.category
      const categoryName = item.category?.name || 'Khác';

      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(item);
    });

    return grouped;
  };

  const getPopularItems = () => {
    // Sử dụng danh sách phổ biến từ API thay vì lọc từ menuItems
    return popularItems;
  };

  const getAllItems = () => {
    return menuItems;
  };

  // Search function to filter items by keyword
  const searchMenuItems = (keyword: string): MenuItem[] => {
    if (!keyword.trim()) return [];

    const normalizedKeyword = keyword.toLowerCase().trim();
    return menuItems.filter(item =>
      item.name.toLowerCase().includes(normalizedKeyword)
    );
  };

  // Filter by price function
  const filterByPrice = (minPrice: number, maxPrice: number): MenuItem[] => {
    return menuItems.filter(item =>
      item.price >= minPrice && item.price <= maxPrice
    );
  };

  // Move this inside the component to ensure it's recalculated on re-renders
  const groupedMenu = groupMenuItemsByCategory();

  // Update filteredItems when data is loaded
  useEffect(() => {
    if (!loading && menuItems.length > 0) {
      if (selectedCategory === 'popular') {
        setFilteredItems(getPopularItems());
      } else if (selectedCategory === 'all') {
        setFilteredItems(getAllItems());
      } else {
        setFilteredItems(groupedMenu[selectedCategory] || []);
      }
    }
  }, [loading, menuItems, selectedCategory, popularItems]);

  // Handle normal category filtering
  useEffect(() => {
    if (!isSearching && !isPriceFiltering && !loading && menuItems.length > 0) {
      if (selectedCategory === 'popular') {
        setFilteredItems(getPopularItems());
      } else if (selectedCategory === 'all') {
        setFilteredItems(getAllItems());
      } else {
        setFilteredItems(groupedMenu[selectedCategory] || []);
      }
    }
  }, [selectedCategory, isSearching, isPriceFiltering, loading, menuItems.length, popularItems]);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear price filter if active
    if (isPriceFiltering) {
      clearPriceFilter();
    }

    if (!searchKeyword.trim()) {
      setIsSearching(false);
      setSearchPerformed(false);
      return;
    }

    const results = searchMenuItems(searchKeyword);
    setSearchResults(results);
    setFilteredItems(results);
    setIsSearching(true);
    setSearchPerformed(true);
  };

  // Clear search
  const clearSearch = () => {
    setSearchKeyword('');
    setIsSearching(false);
    setSearchPerformed(false);

    // Restore original category view
    if (selectedCategory === 'popular') {
      setFilteredItems(getPopularItems());
    } else if (selectedCategory === 'all') {
      setFilteredItems(getAllItems());
    } else {
      setFilteredItems(groupedMenu[selectedCategory] || []);
    }
  };

  // Handle price filter submission
  const handlePriceFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setPriceFilterError('');

    // Clear search if active
    if (isSearching) {
      clearSearch();
    }

    // Validate inputs
    const minPriceNum = minPrice ? parseInt(minPrice, 10) : 0;
    const maxPriceNum = maxPrice ? parseInt(maxPrice, 10) : Number.MAX_SAFE_INTEGER;

    if (minPriceNum < 0 || maxPriceNum < 0) {
      setPriceFilterError('Giá không được là số âm');
      return;
    }

    if (minPriceNum > maxPriceNum) {
      setPriceFilterError('Giá tối thiểu không được lớn hơn giá tối đa');
      return;
    }

    try {
      const results = filterByPrice(minPriceNum, maxPriceNum);
      setFilteredItems(results);
      setIsPriceFiltering(true);
      setPriceFilterPerformed(true);

      if (results.length === 0) {
        setPriceFilterError('Không tìm thấy món ăn nào trong khoảng giá này');
      }
    } catch (error) {
      setPriceFilterError('Đã xảy ra lỗi khi lọc giá. Vui lòng thử lại sau.');
    }
  };

  // Clear price filter
  const clearPriceFilter = () => {
    setMinPrice('');
    setMaxPrice('');
    setIsPriceFiltering(false);
    setPriceFilterPerformed(false);
    setPriceFilterError('');

    // Restore original category view
    if (selectedCategory === 'popular') {
      setFilteredItems(getPopularItems());
    } else if (selectedCategory === 'all') {
      setFilteredItems(getAllItems());
    } else {
      setFilteredItems(groupedMenu[selectedCategory] || []);
    }
  };

  // Handle category click while filtering
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    if (isSearching) {
      clearSearch();
    }
    if (isPriceFiltering) {
      clearPriceFilter();
    }
  };

  if (loading) {
    return <LoadingSpinner
      loadingText="Đang tải thực đơn..."
      showDots={true}
      showSkeleton={true}
      skeletonCount={2}
    />;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="menu-page">
      <div className="container">
        <div className="menu-header">
          <h1>Thực Đơn</h1>
          <div className="breadcrumb">
            <Link to="/">Trang chủ</Link> {'>'} <span>Thực đơn</span> {'>'}
            <span>
              {isSearching ? 'Kết quả tìm kiếm' :
                (selectedCategory === 'popular' ? 'Món phổ biến' :
                  (selectedCategory === 'all' ? 'Tất cả món ăn' : selectedCategory))}
            </span>
          </div>

          {/* Search Box */}
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Tìm kiếm món ăn..."
                className="search-input"
              />
              <button type="submit" className="search-button">
                Tìm kiếm
              </button>
              {isSearching && (
                <button type="button" onClick={clearSearch} className="clear-search-button">
                  Xóa
                </button>
              )}
            </form>
          </div>

          <div className="price-filter-container">
            <form onSubmit={handlePriceFilter} className="price-filter-form">
              <div className="price-inputs">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Giá tối thiểu"
                  className="price-input"
                  min="0"
                />
                <span className="price-separator">-</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Giá tối đa"
                  className="price-input"
                  min="0"
                />
              </div>
              <button type="submit" className="price-filter-button">
                Lọc giá
              </button>
              {isPriceFiltering && (
                <button type="button" onClick={clearPriceFilter} className="clear-filter-button">
                  Xóa bộ lọc
                </button>
              )}
            </form>
            {priceFilterError && (
              <div className="price-filter-error">
                {priceFilterError}
              </div>
            )}
          </div>
        </div>

        <div className="menu-container">
          <div className="menu-sidebar">
            <ul className="category-list">
              <li
                className={selectedCategory === 'all' && !isSearching ? 'active' : ''}
                onClick={() => handleCategoryClick('all')}
              >
                Tất cả món ăn
              </li>
              <li
                className={selectedCategory === 'popular' && !isSearching ? 'active' : ''}
                onClick={() => handleCategoryClick('popular')}
              >
                Món phổ biến
              </li>
              {categoryOrder.map(category => (
                <li
                  key={category}
                  className={selectedCategory === category && !isSearching ? 'active' : ''}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>

          <div className="menu-content">
            {/* Search Results Message */}
            {searchPerformed && (
              <div className="search-results-header">
                {searchResults.length > 0 ? (
                  <h2>Kết quả tìm kiếm cho "{searchKeyword}" ({searchResults.length})</h2>
                ) : (
                  <div className="no-results">
                    <h2>Không tìm thấy sản phẩm nào phù hợp với từ khóa "{searchKeyword}"</h2>
                    <p>Vui lòng thử lại với từ khóa khác hoặc xem các món ăn phổ biến của chúng tôi.</p>
                    <button onClick={clearSearch} className="return-button">
                      Quay lại menu
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Price Filter Results Message */}
            {priceFilterPerformed && !priceFilterError && (
              <div className="filter-results-header">
                <h2>
                  {filteredItems.length > 0 ?
                    `Món ăn trong khoảng giá ${minPrice || '0'}đ - ${maxPrice || 'không giới hạn '}0đ (${filteredItems.length})` :
                    'Không tìm thấy món ăn nào trong khoảng giá này'}
                </h2>
                {filteredItems.length === 0 && (
                  <div className="no-results">
                    <p>Vui lòng thử lại với khoảng giá khác hoặc xem tất cả các món ăn.</p>
                    <button onClick={clearPriceFilter} className="return-button">
                      Quay lại menu
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Menu Items */}
            {(!searchPerformed || searchResults.length > 0) && (
              <div className="menu-items">
                {filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <div key={item.id} className="menu-item">
                      {item.image && (
                        <div className="item-image">
                          <div className="item-image-wrapper">
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.name}
                            />
                            {item?.status === false && (
                              <div className="sold-out-overlay">
                                Hết hàng
                              </div>
                            )}
                          </div>

                        </div>
                      )}
                      <div className="item-details">
                        <h3 className="item-name">{item.name}</h3>
                        <p className="item-price">{parseFloat(item.price.toString()).toLocaleString()}đ</p>
                        {item.popular && <span className="popular-badge">Phổ biến</span>}
                        {selectedCategory === 'popular' && !item.popular && (
                          <span className="recommended-badge">Đề xuất</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  !searchPerformed && !priceFilterPerformed && (
                    <div className="no-items">
                      <p>Không có món ăn trong danh mục này.</p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;