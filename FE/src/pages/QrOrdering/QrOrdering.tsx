import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FloatingCart from '../../components/FloatingCart/FloatingCart';
import { Toast } from '../../components/Toast/Toast';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import { qrOrderService, MenuItem, CartItem } from '../../services/qrOrderService';
import './QrOrdering.scss';

const QrOrdering = () => {
  const { tableId } = useParams<{ tableId?: string }>();
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

  // Show toast message helper
  const showToastMessage = useCallback((message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, []);

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
      if (!tableId) return;
      
      try {
        // Kiểm tra trạng thái bàn trước
        const tableStatus = await qrOrderService.checkTableStatus(parseInt(tableId));
        console.log('Table status:', tableStatus);
        
        if (tableStatus.status !== 'available') {
          showToastMessage(`Bàn ${tableId} không khả dụng. Vui lòng chọn bàn khác.`);
          return;
        }

        console.log('Fetching cart for table:', tableId);
        const cartData = await qrOrderService.getCart(parseInt(tableId));
        console.log('Cart data:', cartData);
        
        if (Array.isArray(cartData)) {
          console.log('Setting cart with data:', cartData);
          setCart(cartData);
        } else {
          console.error('Invalid cart data format:', cartData);
          setCart([]);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        showToastMessage("Không thể tải giỏ hàng");
        setCart([]);
      }
    };

    fetchCart();
  }, [tableId, showToastMessage]);

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

  // Add to cart handler
  const addToCart = useCallback(async (menuId: number) => {
    if (orderPlaced || !tableId) return;

    try {
      // Kiểm tra trạng thái bàn trước
      const tableStatus = await qrOrderService.checkTableStatus(parseInt(tableId));
      console.log('Table status:', tableStatus);
      
      if (tableStatus.status !== 'available') {
        showToastMessage(`Bàn ${tableId} không khả dụng. Vui lòng chọn bàn khác.`);
        return;
      }

      console.log('Adding item to cart:', { menuId, tableId });
      const response = await qrOrderService.increaseCartItem(menuId, parseInt(tableId));
      console.log('Increase cart response:', response);
      
      if (response.status === 'success') {
        // Sau khi tăng số lượng thành công, lấy lại giỏ hàng mới
        const cartData = await qrOrderService.getCart(parseInt(tableId));
        console.log('Updated cart data:', cartData);
        
        if (Array.isArray(cartData)) {
          console.log('Setting cart with updated data:', cartData);
          setCart(cartData);
          setShowAddedAnimation(menuId);
          setTimeout(() => setShowAddedAnimation(null), 500);
        } else {
          console.error('Invalid cart data format:', cartData);
          showToastMessage("Lỗi khi cập nhật giỏ hàng");
        }
      } else {
        console.error('Failed to add item to cart:', response);
        showToastMessage("Không thể thêm món vào giỏ hàng");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToastMessage("Không thể thêm món vào giỏ hàng");
    }
  }, [orderPlaced, tableId, showToastMessage]);

  // Remove from cart handler
  const removeFromCart = useCallback(async (menuId: number) => {
    if (orderPlaced || !tableId) return;

    try {
      console.log('Removing item from cart:', { menuId, tableId });
      const response = await qrOrderService.decreaseCartItem(menuId, parseInt(tableId));
      console.log('Decrease cart response:', response);
      
      if (response.status === 'success') {
        // Sau khi giảm số lượng thành công, lấy lại giỏ hàng mới
        const cartData = await qrOrderService.getCart(parseInt(tableId));
        console.log('Updated cart data:', cartData);
        
        if (Array.isArray(cartData)) {
          console.log('Setting cart with updated data:', cartData);
          setCart(cartData);
        } else {
          console.error('Invalid cart data format:', cartData);
          showToastMessage("Lỗi khi cập nhật giỏ hàng");
        }
      } else {
        console.error('Failed to remove item from cart:', response);
        showToastMessage("Không thể xóa món khỏi giỏ hàng");
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      showToastMessage("Không thể xóa món khỏi giỏ hàng");
    }
  }, [orderPlaced, tableId, showToastMessage]);

  // Calculate total
  const calculateTotal = useCallback(() => {
    console.log('Current cart items:', cart);
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  // Get total items in cart
  const getCartItemCount = useCallback(() => {
    const count = cart.reduce((count, item) => count + item.quantity, 0);
    console.log('Cart item count:', count, 'Cart items:', cart);
    return count;
  }, [cart]);

  // Render cart items
  const renderCartItems = () => {
    return cart.map(item => (
      <div key={item.id} className="cart-item">
        <div className="item-info">
          <h3>{item.menu.name}</h3>
          <p className="item-price">{item.price.toLocaleString()}đ</p>
        </div>
        <div className="item-actions">
          <button onClick={() => removeFromCart(item.menu_id)}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => addToCart(item.menu_id)}>+</button>
        </div>
        <div className="item-total">
          {(item.price * item.quantity).toLocaleString()}đ
        </div>
      </div>
    ));
  };

  // Handle order submission
  const handleOrder = useCallback(async () => {
    if (!tableId || cart.length === 0) return;

    try {
      console.log('Placing order:', { tableId, cart });
      const orderData = {
        number_table: parseInt(tableId),
        items: cart.map(item => ({
          menu_id: item.menu_id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await qrOrderService.placeOrder(orderData);
      console.log('Place order response:', response);
      setOrderStatus('pending');
      setOrderPlaced(true);
      showToastMessage(`Đặt món thành công! Bàn số ${tableId}. Nhân viên sẽ mang món ăn đến cho bạn trong giây lát.`);
    } catch (error) {
      console.error("Error placing order:", error);
      showToastMessage("Không thể đặt món. Vui lòng thử lại sau.");
    }
  }, [tableId, cart, showToastMessage]);

  // Handle new order creation
  const handleNewOrder = useCallback(() => {
    setCart([]);
    setNote('');
    setOrderPlaced(false);
    setOrderStatus(null);
  }, []);

  // Handle login navigation
  const handleLogin = useCallback(() => {
    navigate('/login', { state: { from: { pathname: `/order/${tableId}` } } });
  }, [navigate, tableId]);

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

  // Handle missing tableId
  if (!tableId) {
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
      <LoadingSpinner 
        loadingText="Đang tải thực đơn..." 
        showDots={true}
        showSkeleton={true}
        skeletonCount={4}
      />
    );
  }

  return (
    <div className="qr-ordering-page">
      <div className="qr-header">
        <div className="container">
          <img src="/src/assets/logo-smartorder.png" alt="Smart Order" className="logo" />
          <h1>Đặt món trực tiếp</h1>
          <p>Bàn số: {tableId}</p>
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
                  {cart.map(item => (
                    <div key={item.id} className="order-item">
                      <div className="item-name-quantity">
                        <span className="quantity">{item.quantity}x</span>
                        <span className="name">{item.menu.name}</span>
                      </div>
                      <span className="price">{(item.price * item.quantity).toLocaleString()}đ</span>
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
                  <span>{calculateTotal().toLocaleString()}đ</span>
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
                          <img src={item.image} alt={item.name} />
                        </div>
                      )}
                      <div className="item-details">
                        <h3 className="item-name">{item.name}</h3>
                        <p className="item-price">{item.price.toLocaleString()}đ</p>
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
                      <span>{calculateTotal().toLocaleString()}đ</span>
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

                  {cart.length > 0 && (
                    <div className="auth-prompt">
                      <p>Đăng nhập để lưu đơn hàng vào lịch sử</p>
                      <button className="login-btn" onClick={handleLogin}>
                        Đăng nhập
                      </button>
                    </div>
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