import { Link } from 'react-router-dom'
import { Anchor, Ship } from 'lucide-react'

const Navbar = ({ title = "ADYK", showBackButton = false }) => {
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
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Link
              to="/ais"
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-2 py-1.5 rounded-lg transition-all duration-200"
            >
              <Ship className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
