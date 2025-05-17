import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Menu from './pages/Menu/Menu'
import Booking from './pages/Booking/Booking'
import QrOrdering from './pages/QrOrdering/QrOrdering'
import Admin from './pages/Admin/Admin'
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import LoginForm from './components/Login/LoginForm'

import GuestRoute from './components/Router/GuestRoute'
import PrivateRoute from './components/Router/PrivateRoute'
import FeedbackForm from './components/FeedBack/FeedBackForm'
function App() {
  return (
    <div className="app">
        <ScrollToTop />
        <div className="app">
        <Routes>
          
          <Route path="/login" element={
            <GuestRoute>
              <LoginForm />
            </GuestRoute>
          } />


          {/* <Route path="/staff" element={
            <PrivateRoute>
              <Staff />
            </PrivateRoute>
          } /> */}


          <Route path="/admin" element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          } />

          <Route path="/list-menu" element={<QrOrdering />} />
          <Route path="/feedback" element={<FeedbackForm />} />
          <Route
            path="*"
            element={
              <>
                <Header />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/thuc-don" element={<Menu />} />
                    <Route path="/dat-ban" element={<Booking />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </div> 
    </div>
  )
}

export default App
