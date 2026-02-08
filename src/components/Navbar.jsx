import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Anchor, Ship, LogIn, LogOut, User, Smartphone, CreditCard, ChevronDown } from 'lucide-react'
import { isAuthenticated, logout, getUser } from '../utils/auth'

const Navbar = ({ title = "ADYK Online", showBackButton = false }) => {
  const navigate = useNavigate()
  const authenticated = isAuthenticated()
  const user = getUser()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef(null)

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setShowMenu(false)
    navigate('/')
    window.location.reload()
  }

  const displayName = user?.fullName || user?.name || user?.phone || ''
  const initial = displayName ? displayName.charAt(0).toUpperCase() : '?'

  return (
    <nav className="bg-slate-700 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Anchor className="w-6 h-6 text-white transform group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-full blur-md transition-opacity duration-300"></div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-wide">
                {title}
              </h1>
              <p className="text-[10px] text-gray-300 -mt-0.5">
                Türk Denizcilik Derneği
              </p>
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-white hover:text-gray-300 transition-colors duration-200 font-medium text-sm"
            >
              Ana Sayfa
            </Link>
            <Link
              to="/ais"
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-all duration-200 font-medium text-sm backdrop-blur-sm"
            >
              <Ship className="w-4 h-4" />
              <span>AIS Takip</span>
            </Link>
            {authenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-all duration-200 font-medium text-sm"
                >
                  <div className="w-6 h-6 bg-adyk-ocean rounded-full flex items-center justify-center text-xs font-bold">
                    {initial}
                  </div>
                  <span className="max-w-[120px] truncate">{displayName}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg py-2 z-50">
                    <Link
                      to="/profile"
                      onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      Profilim
                    </Link>
                    <Link
                      to="/my-devices"
                      onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      <Smartphone className="w-4 h-4 text-gray-500" />
                      Cihazlarım
                    </Link>
                    <Link
                      to="/my-subscriptions"
                      onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      Aboneliklerim
                    </Link>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 bg-adyk-ocean hover:bg-adyk-accent text-white px-3 py-1.5 rounded-lg transition-all duration-200 font-medium text-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Giriş Yap</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <Link
              to="/ais"
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-2 py-1.5 rounded-lg transition-all duration-200"
            >
              <Ship className="w-4 h-4" />
            </Link>
            {authenticated ? (
              <div className="relative" ref={!showMenu ? undefined : menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center bg-white/10 hover:bg-white/20 text-white px-2 py-1.5 rounded-lg transition-all duration-200"
                >
                  <div className="w-6 h-6 bg-adyk-ocean rounded-full flex items-center justify-center text-xs font-bold">
                    {initial}
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg py-2 z-50">
                    <Link
                      to="/profile"
                      onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      Profilim
                    </Link>
                    <Link
                      to="/my-devices"
                      onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      <Smartphone className="w-4 h-4 text-gray-500" />
                      Cihazlarım
                    </Link>
                    <Link
                      to="/my-subscriptions"
                      onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      Aboneliklerim
                    </Link>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center bg-adyk-ocean hover:bg-adyk-accent text-white px-2 py-1.5 rounded-lg transition-all duration-200"
              >
                <LogIn className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
