import { Link, useNavigate } from 'react-router-dom'
import { Anchor, Ship, LogIn, LogOut } from 'lucide-react'
import { isAuthenticated, logout } from '../utils/auth'

const Navbar = ({ title = "ADYK Online", showBackButton = false }) => {
  const navigate = useNavigate()
  const authenticated = isAuthenticated()

  const handleLogout = () => {
    logout()
    navigate('/')
    window.location.reload()
  }

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

          {/* Navigation Links */}
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
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500/80 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-all duration-200 font-medium text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Çıkış</span>
              </button>
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
              <button
                onClick={handleLogout}
                className="flex items-center bg-red-500/80 hover:bg-red-600 text-white px-2 py-1.5 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
              </button>
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
