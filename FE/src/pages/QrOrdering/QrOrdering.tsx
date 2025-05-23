import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import FloatingCart from '../../components/FloatingCart/FloatingCart';
import { Toast } from '../../components/Toast/Toast';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import { getImageUrl } from '../../components/Manage/Menu/Menu.tsx';
import { qrOrderService, MenuItem, CartItem } from '../../services/qrOrderService';
import { api } from '../../Api/AxiosIntance';
import './QrOrdering.scss';


const QrOrdering = () => {
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [note, setNote] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [showCartSection, setShowCartSection] = useState(false);
  const [showAddedAnimation, setShowAddedAnimation] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const cartSectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [placedOrderItems, setPlacedOrderItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Bỏ console.log
  }, [tableNumber]);

  const showToastMessage = useCallback((message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
      .replace('₫', 'đ').replace('.', '.');
  };

  // Fetch menu data
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        const [menuData, categoryData] = await Promise.all([
          qrOrderService.getMenuItems(),
          qrOrderService.getCategories()
        ]);

        if (Array.isArray(menuData) && Array.isArray(categoryData)) {
          setMenuItems(menuData);
          setCategories(['all', 'popular', ...categoryData.map(cat => cat.name)]);
        } else {
          throw new Error('Dữ liệu menu không đúng định dạng');
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
        showToastMessage("Không thể tải thực đơn");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [showToastMessage]);

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      if (!tableNumber) return;
      
      try {
        // Kiểm tra trạng thái bàn trước
        const tableStatus = await qrOrderService.checkTableStatus(tableNumber);
        
        if (tableStatus.status !== 'occupied') {
          showToastMessage(`Bàn ${tableNumber} không khả dụng. Vui lòng chọn bàn khác.`);
          return;
        }

        const cartData = await qrOrderService.getCart();
        
        if (Array.isArray(cartData)) {
          setCart(cartData);
        } else {
          setCart([]);
        }
      } catch (error) {
        showToastMessage("Không thể tải giỏ hàng");
        setCart([]);
      }
    };

    fetchCart();
  }, [tableNumber, showToastMessage]);

  // Filter menu items based on selected category
  const filteredMenuItems = useCallback(() => {
    if (selectedCategory === 'all') {
      return menuItems;
    }
    if (selectedCategory === 'popular') {
      return menuItems.filter(item => item.popular);
    }
    return menuItems.filter(item => item.category.name === selectedCategory);
  }, [menuItems, selectedCategory]);

  // Xử lý thêm vào giỏ hàng
  const addToCart = useCallback(async (menuId: number) => {
    if (orderPlaced || !tableNumber) return;

    try {
      // Thêm hiệu ứng ngay lập tức để người dùng thấy phản hồi
      setShowAddedAnimation(menuId);
      setTimeout(() => setShowAddedAnimation(null), 500);

      // Thêm vào giỏ hàng
      const response = await qrOrderService.addToCart(menuId);
      
      if (response.message === 'Thêm vào giỏ hàng thành công!') {
        // Sau khi thêm thành công, lấy lại giỏ hàng mới
        const cartData = await qrOrderService.getCart();
        
        if (Array.isArray(cartData)) {
          setCart(cartData);
        } else {
          showToastMessage("Lỗi khi cập nhật giỏ hàng");
        }
      } else {
        showToastMessage("Không thể thêm món vào giỏ hàng");
      }
    } catch (error) {
      showToastMessage("Không thể thêm món vào giỏ hàng");
    }
  }, [orderPlaced, tableNumber, showToastMessage]);

  // Remove from cart handler
  const removeFromCart = useCallback(async (menuId: number) => {
    if (orderPlaced || !tableNumber) return;

    try {
      // Cập nhật UI ngay lập tức để tạo cảm giác phản hồi nhanh
      const updatedCart = cart.map(item => {
        if (item.menu.id === menuId) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      }).filter(item => item.quantity > 0);
      
      setCart(updatedCart);
      
      // Gửi yêu cầu giảm số lượng lên server
      await qrOrderService.decreaseCartItem(menuId);
      
      // Cập nhật lại giỏ hàng từ server
      const cartData = await qrOrderService.getCart();
      
      if (Array.isArray(cartData)) {
        setCart(cartData);
      }
    } catch (error) {
      showToastMessage("Không thể xóa món khỏi giỏ hàng");
      
      // Nếu có lỗi, lấy lại giỏ hàng từ server để đảm bảo dữ liệu chính xác
      const cartData = await qrOrderService.getCart();
      if (Array.isArray(cartData)) {
        setCart(cartData);
      }
    }
  }, [orderPlaced, tableNumber, showToastMessage, cart]);

  // Calculate total
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.menu.price * item.quantity), 0);
  };

  // Get total items in cart
  const getCartItemCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Render cart items
  const renderCartItems = () => {
    return cart.map(item => (
      <div key={item.menu.id} className="cart-item">
        <div className="item-info">
          <h3>{item.menu.name}</h3>
          <p className="item-price">{formatCurrency(item.menu.price)}</p>
        </div>
        <div className="item-actions">
          <button onClick={() => removeFromCart(item.menu.id)}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => addToCart(item.menu.id)}>+</button>
        </div>
        <div className="item-total">
          {formatCurrency(item.menu.price * item.quantity)}
        </div>
      </div>
    ));
  };

  // Xử lý đặt món
  const handleOrder = useCallback(async () => {
    if (!tableNumber || cart.length === 0) return;

    try {
      // Hiển thị trạng thái đang xử lý
      setLoading(true);
      
      // Lưu thông tin giỏ hàng trước khi xóa để hiển thị chi tiết đơn hàng
      setPlacedOrderItems([...cart]);
      
      // Lấy danh sách bàn để tìm ID của bàn dựa trên table_number
      const tables = await api.get('/table');
      const table = tables.data.data.find((t: any) => t.table_number === tableNumber);
      
      if (!table) {
        throw new Error(`Không tìm thấy bàn ${tableNumber}`);
      }
      
      // Tiến hành đặt món
      const orderData = {
        table_id: table.id
      };
      
      const response = await qrOrderService.placeOrder(orderData);
      
      setOrderStatus('pending');
      setOrderPlaced(true);
      showToastMessage(`Đặt món thành công! Bàn số ${tableNumber}. Nhân viên sẽ mang món ăn đến cho bạn trong giây lát.`);
      
      // Xóa giỏ hàng sau khi đặt hàng thành công
      setCart([]);
    } catch (error: any) {
      if (error.response) {
        showToastMessage(`Không thể đặt món: ${error.response.data.message || 'Vui lòng thử lại sau'}`);
      } else {
        const errorMessage = error.message || 'Lỗi không xác định';
        showToastMessage(`Không thể đặt món: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  }, [tableNumber, cart, showToastMessage]);

  // Handle new order creation
  const handleNewOrder = useCallback(() => {
    setCart([]);
    setPlacedOrderItems([]);
    setNote('');
    setOrderPlaced(false);
    setOrderStatus(null);
  }, []);


  // Toggle cart section visibility
  const toggleCartSection = useCallback(() => {
    setShowCartSection(prev => !prev);
  }, []);

  // Render order status
  const renderOrderStatus = useCallback(() => {
    if (!orderStatus) return null;

    let statusText = '';
    let statusClass = '';

    switch (orderStatus) {
      case 'pending':
        statusText = 'Đang chờ xử lý';
        statusClass = 'status-pending';
        break;
      case 'preparing':
        statusText = 'Đang chuẩn bị';
        statusClass = 'status-preparing';
        break;
      case 'ready':
        statusText = 'Sẵn sàng phục vụ';
        statusClass = 'status-ready';
        break;
      case 'delivered':
        statusText = 'Đã phục vụ';
        statusClass = 'status-delivered';
        break;
      case 'cancelled':
        statusText = 'Đã hủy';
        statusClass = 'status-cancelled';
        break;
      default:
        statusText = 'Không xác định';
        statusClass = '';
    }

    return (
      <div className={`order-status ${statusClass}`}>
        <h3>Trạng thái đơn hàng</h3>
        <p className="status-text">{statusText}</p>
        <button className="new-order-btn" onClick={handleNewOrder}>
          Đặt món mới
        </button>
      </div>
    );
  }, [orderStatus, handleNewOrder]);

  // Handle missing tableNumber
  if (!tableNumber) {
    return (
      <div className="error-page">
        <div className="container">
          <h1>Lỗi: Không tìm thấy mã bàn</h1>
          <p>Vui lòng quét mã QR hợp lệ để đặt món.</p>
          <button onClick={() => navigate('/')}>Quay lại trang chủ</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="qr-ordering-page">
        <div className="qr-header">
          <div className="container">
            <img src="/src/assets/logo-smartorder.png" alt="Smart Order" className="logo" />
            <h1>Đặt món trực tiếp</h1>
            <p>Bàn số: {tableNumber}</p>
          </div>
        </div>

        <div className="qr-content">
          <div className="container">
            <LoadingSpinner 
              loadingText="Đang tải danh sách món ăn..." 
              showDots={true}
              showSkeleton={true}
              skeletonCount={4}
              className="embedded"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="qr-ordering-page">
      <div className="qr-header">
        <div className="container">
          <img src="/src/assets/logo-smartorder.png" alt="Smart Order" className="logo" />
          <h1>Đặt món trực tiếp</h1>
          <p>Bàn số: {tableNumber}</p>
        </div>
      </div>

      <div className="qr-content">
        <div className="container">
          {orderPlaced ? (
            <div className="order-placed-container">
              {renderOrderStatus()}

              <div className="order-details">
                <h3>Chi tiết đơn hàng</h3>
                <div className="order-items">
                  {placedOrderItems.map(item => (
                    <div key={item.menu.id} className="order-item">
                      <div className="item-name-quantity">
                        <span className="quantity">{item.quantity}x</span>
                        <span className="name">{item.menu.name}</span>
                      </div>
                      <span className="price">{formatCurrency(item.menu.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                {note && (
                  <div className="order-note-display">
                    <h4>Ghi chú:</h4>
                    <p>{note}</p>
                  </div>
                )}
                <div className="order-total">
                  <span>Tổng tiền:</span>
                  <span>{formatCurrency(placedOrderItems.reduce((total, item) => total + (item.menu.price * item.quantity), 0))}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="qr-ordering-layout">
              <div className={`menu-section ${showCartSection ? 'menu-collapsed' : ''}`}>
                {!showCartSection && (
                  <div className="ordering-instructions">
                    <h3>Hướng dẫn đặt món</h3>
                    <p>Chọn món ăn từ thực đơn bên dưới để thêm vào giỏ hàng. Khi hoàn tất, nhấn "Đặt món ngay" để gửi đơn hàng đến nhà bếp.</p>
                  </div>
                )}

                <div className="category-tabs">
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category === 'all' ? 'Tất cả' : 
                       category === 'popular' ? 'Món phổ biến' : 
                       category}
                    </button>
                  ))}
                </div>

                <div className="menu-items">
                  {filteredMenuItems().map(item => (
                    <div
                      key={item.id}
                      className={`menu-item ${showAddedAnimation === item.id ? 'item-added' : ''}`}
                    >
                      {item.image && (
                        <div className="item-image">
                          <img src={getImageUrl(item.image)} alt={item.name} />
                        </div>
                      )}
                      <div className="item-details">
                        <h3 className="item-name">{item.name}</h3>
                        <p className="item-price">{formatCurrency(item.price)}</p>
                        <button 
                          className="add-to-cart-btn"
                          onClick={() => addToCart(item.id)}
                        >
                          Thêm vào giỏ
                        </button>
                        {item.popular && selectedCategory !== 'popular' && (
                          <span className="popular-badge">Phổ biến</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={`cart-section ${showCartSection ? 'cart-expanded' : ''}`}
                ref={cartSectionRef}
              >
                <div className="cart-container">
                  <h2>Giỏ hàng của bạn</h2>

                  {cart.length === 0 ? (
                    <div className="empty-cart">
                      <p>Giỏ hàng của bạn đang trống</p>
                      <p>Vui lòng chọn món ăn từ thực đơn</p>
                    </div>
                  ) : (
                    <div className="cart-items">
                      {renderCartItems()}
                    </div>
                  )}

                  <div className="order-note">
                    <label htmlFor="note">Ghi chú đặc biệt:</label>
                    <textarea
                      id="note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ghi chú về món ăn (không cay, ít muối, ...)"
                    />
                  </div>

                  <div className="cart-total">
                    <div className="total-row">
                      <span>Tổng tiền:</span>
                      <span>{formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>

                  <button
                    className="order-button"
                    onClick={handleOrder}
                    disabled={cart.length === 0}
                  >
                    Đặt món ngay
                  </button>

                  {showCartSection && (
                    <button
                      className="back-to-menu-btn"
                      onClick={toggleCartSection}
                    >
                      Quay lại thực đơn
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating cart button */}
      {!orderPlaced && (
        <FloatingCart
          itemCount={getCartItemCount()}
          onCartClick={toggleCartSection}
        />
      )}

      {/* Toast notification */}
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
};

export default QrOrdering;
