import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import menuItems, { categoryOrder, MenuItem } from '../../data/menuData';
import { useOrders, OrderItem } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import FloatingCart from '../../components/FloatingCart/FloatingCart';
import { Toast } from '../../components/Toast/Toast'; // Giả định component này tồn tại
import './QrOrdering.scss';

// Constants
const LOGO_URL = "https://ext.same-assets.com/0/1160240166.svg";

const QrOrdering = () => {
  // Use proper type for useParams
  const { tableId } = useParams<{ tableId?: string }>();
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [note, setNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('popular');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [showCartSection, setShowCartSection] = useState(false);
  const [showAddedAnimation, setShowAddedAnimation] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const cartSectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Get order functions from context
  const {
    addOrder,
    getActiveOrderForTable,
    orders
  } = useOrders();

  // Get auth functions
  const { isAuthenticated, currentUser, updateUserOrders } = useAuth();

  // Memoize the grouped menu items
  const groupedMenu = useMemo(() => {
    const grouped: Record<string, MenuItem[]> = {};

    menuItems.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    return grouped;
  }, []);

  // Memoize popular items
  const popularItems = useMemo(() => {
    return menuItems.filter(item => item.popular);
  }, []);
  
  // Categories array
  const categories = useMemo(() => ['popular', ...categoryOrder], []);

  // State to display items based on selected category
  const [displayedItems, setDisplayedItems] = useState<MenuItem[]>([]);

  // Check for active order when component mounts
  useEffect(() => {
    if (tableId) {
      try {
        const activeOrder = getActiveOrderForTable(tableId);
        if (activeOrder) {
          // Store the active order ID and status
          setOrderStatus(activeOrder.status);
          setOrderPlaced(true);

          // Set cart items from the active order for display
          setCart(activeOrder.items);
          setNote(activeOrder.note || '');
        }
      } catch (error) {
        console.error("Error fetching active order:", error);
        showToastMessage("Không thể tải thông tin đơn hàng hiện tại");
      }
    }
  }, [tableId, getActiveOrderForTable, orders]);

  // Update displayed items when category changes
  useEffect(() => {
    try {
      if (selectedCategory === 'popular') {
        setDisplayedItems(popularItems);
      } else {
        setDisplayedItems(groupedMenu[selectedCategory] || []);
      }
    } catch (error) {
      console.error("Error updating displayed items:", error);
      setDisplayedItems([]);
    }
  }, [selectedCategory, groupedMenu, popularItems]);

  // Scroll to cart section when it becomes visible
  useEffect(() => {
    if (showCartSection && cartSectionRef.current) {
      cartSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showCartSection]);

  // Show toast message helper
  const showToastMessage = useCallback((message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, []);

  // Add to cart handler
  const addToCart = useCallback((item: MenuItem) => {
    if (orderPlaced) return; // Don't allow adding to cart if order is already placed

    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);

      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...prevCart, { ...item, quantity: 1 }];
    });

    // Show animation feedback
    setShowAddedAnimation(item.id);
    setTimeout(() => setShowAddedAnimation(null), 500);
  }, [orderPlaced]);

  // Remove from cart handler
  const removeFromCart = useCallback((id: number) => {
    if (orderPlaced) return; // Don't allow removing from cart if order is already placed

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === id);

      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }

      return prevCart.filter(item => item.id !== id);
    });
  }, [orderPlaced]);

  // Calculate total
  const calculateTotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  // Handle order submission
  const handleOrder = useCallback(() => {
    if (!tableId || cart.length === 0) return;

    try {
      // Add the order using the context
      const newOrderId = addOrder({
        tableId,
        items: cart,
        total: calculateTotal(),
        note: note || undefined,
        timestamp: new Date().toISOString()
      });

      setOrderStatus('pending');
      setOrderPlaced(true);

      // If user is authenticated, add the order to their profile
      if (isAuthenticated && currentUser) {
        updateUserOrders(newOrderId);
      }

      showToastMessage(`Đặt món thành công! Bàn số ${tableId}. Nhân viên sẽ mang món ăn đến cho bạn trong giây lát.`);
    } catch (error) {
      console.error("Error placing order:", error);
      showToastMessage("Không thể đặt món. Vui lòng thử lại sau.");
    }
  }, [tableId, cart, note, addOrder, calculateTotal, isAuthenticated, currentUser, updateUserOrders, showToastMessage]);

  // Handle new order creation
  const handleNewOrder = useCallback(() => {
    // Reset the form to create a new order
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

  // Get total items in cart
  const getCartItemCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

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
        {orderStatus === 'preparing' && tableId && (
          <p className="estimated-time">
            Thời gian dự kiến: {getActiveOrderForTable(tableId)?.estimatedTime || '10-15'} phút
          </p>
        )}

        <button className="new-order-btn" onClick={handleNewOrder}>
          Đặt món mới
        </button>
      </div>
    );
  }, [orderStatus, tableId, getActiveOrderForTable, handleNewOrder]);

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

  // Click handler for menu item
  const handleMenuItemClick = useCallback((item: MenuItem) => {
    addToCart(item);
  }, [addToCart]);

  // Handler for quantity adjustment
  const handleQuantityAdjust = useCallback((e: React.MouseEvent, item: MenuItem, action: 'add' | 'remove') => {
    e.stopPropagation();
    if (action === 'add') {
      addToCart(item);
    } else {
      removeFromCart(item.id);
    }
  }, [addToCart, removeFromCart]);

  return (
    <div className="qr-ordering-page">
      <div className="qr-header">
        <div className="container">
          {/* Use constant instead of process.env */}
          <img 
            src={LOGO_URL} 
            alt="Smart Order" 
            className="logo" 
          />
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
                        <span className="name">{item.name}</span>
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
                      {category === 'popular' ? 'Món phổ biến' : category}
                    </button>
                  ))}
                </div>

                <div className="menu-items">
                  {displayedItems.map(item => (
                    <div
                      key={item.id}
                      className={`menu-item ${showAddedAnimation === item.id ? 'item-added' : ''}`}
                      onClick={() => handleMenuItemClick(item)}
                    >
                      {item.image && (
                        <div className="item-image">
                          <img src={item.image} alt={item.name} />
                        </div>
                      )}
                      <div className="item-details">
                        <h3 className="item-name">{item.name}</h3>
                        <p className="item-description">{item.description}</p>
                        <p className="item-price">{item.price.toLocaleString()}đ</p>
                        <button className="add-to-cart-btn">Thêm vào giỏ</button>
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
                      {cart.map(item => (
                        <div key={item.id} className="cart-item">
                          <div className="item-info">
                            <h3>{item.name}</h3>
                            <p className="item-price">{item.price.toLocaleString()}đ</p>
                          </div>
                          <div className="item-actions">
                            <button onClick={(e) => handleQuantityAdjust(e, item, 'remove')}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={(e) => handleQuantityAdjust(e, item, 'add')}>+</button>
                          </div>
                          <div className="item-total">
                            {(item.price * item.quantity).toLocaleString()}đ
                          </div>
                        </div>
                      ))}
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

                  {!isAuthenticated && cart.length > 0 && (
                    <div className="auth-prompt">
                      <p>Đăng nhập để lưu đơn hàng vào lịch sử</p>
                      <button className="login-btn" onClick={handleLogin}>
                        Đăng nhập
                      </button>
                    </div>
                  )}

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
      {!orderPlaced && !showCartSection && (
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