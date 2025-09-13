import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { User, LogOut, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function Header({ onMobileMenuToggle }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  // Profile menu state and ref for outside click handling
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const onClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener("mousedown", onClickOutside);
    }
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [profileOpen]);

  return (
    <header className="bg-[#050C9C] text-white shadow-lg" data-testid="header-main">
      <div className="flex items-center justify-between px-4 py-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden text-white hover:bg-[#050C9C]/80 p-2"
          onClick={onMobileMenuToggle}
          data-testid="button-mobile-menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo and College Name */}
        <div className="flex-1 flex items-center justify-center gap-4" data-testid="text-college-name">
  <img 
    src="/src/Assets/upescc.jpeg" 
    alt="College Logo" 
    className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-full shadow-md border border-gray-200 bg-white p-1"
    data-testid="college-logo"
  />
  <div className="text-center">
    <h1 className="text-xl lg:text-2xl font-bold">
      {t("header.collegeName")}
    </h1>
    <p className="text-sm opacity-90" data-testid="text-subtitle">
      {t("header.subtitle")}
    </p>
  </div>
</div>


        {/* User Info & Language Toggle */}
        <div className="flex items-center space-x-4">
          {/* Language Toggle */}
          <div className="flex bg-[#050C9C]/80 rounded-lg p-1" data-testid="language-toggle">
            <Button
              variant="ghost"
              size="sm"
              className={`px-3 py-1 rounded text-sm font-medium ${language === "en"
                  ? "bg-white text-[#050C9C]"
                  : "text-white hover:bg-white/20"
                }`}
              onClick={() => setLanguage("en")}
              data-testid="button-language-en"
            >
              EN
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-3 py-1 rounded text-sm font-medium ${language === "hi"
                  ? "bg-white text-[#050C9C]"
                  : "text-white hover:bg-white/20"
                }`}
              onClick={() => setLanguage("hi")}
              data-testid="button-language-hi"
            >
              हिं
            </Button>
          </div>

          {/* User Info and Profile Menu */}
          {isAuthenticated && user && (
            <div className="hidden sm:flex items-center space-x-3 relative" data-testid="user-info" ref={profileRef}>
              <button
                type="button"
                className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"
                onClick={() => setProfileOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                data-testid="button-profile"
              >
                <User className="h-4 w-4" />
              </button>
              <div className="text-sm select-none">
                <div className="font-medium" data-testid="text-user-name">
                  {user.firstName} {user.lastName}
                </div>
                <div className="opacity-75" data-testid="text-user-email">
                  {user.email}
                </div>
              </div>

              {/* Dropdown Menu */}
              {profileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-11 w-40 bg-white text-gray-800 rounded-md shadow-lg ring-1 ring-black/5 overflow-hidden z-20"
                  data-testid="dropdown-profile"
                >
                  <button
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                    onClick={handleLogout}
                    role="menuitem"
                    data-testid="dropdown-logout"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}