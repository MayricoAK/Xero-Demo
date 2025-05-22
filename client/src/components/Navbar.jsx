import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, User, X, ChevronDown } from "lucide-react";
// import { authService } from "../services/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserInitials } from "@/utils";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [educationDropdownOpen, setEducationDropdownOpen] = useState(false);
  const [setupDropdownOpen, setSetupDropdownOpen] = useState(false);
  //   const userData = authService.getUserInfo();

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // authService.removeToken();
    navigate("/login");
  };

  const navItems = [
    { path: "/home", label: "Home" },
    {
      label: "Setup",
      dropdown: [
        { path: "/setup/menu1", label: "Menu 1" },
        { path: "/setup/menu2", label: "Menu 2" },
        { path: "/setup/menu3", label: "Menu 3" },
      ],
    },
  ];

  return (
    <nav className="bg-gradient-to-r from-black to-black border-b border-gray-800 shadow-xl">
      <div className="max-w-[1920px] mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 transition-transform hover:scale-105">
            {/* <img src={Logo} alt="Tatheer Logo" className="h-10 md:h-12 w-auto" /> */}
            <span className="text-2xl font-bold text-emerald-400">Logo</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 ml-auto">
            {navItems.map((item) =>
              item.dropdown ? (
                <div className="relative group" key={item.label}>
                  <button
                    className={`flex items-center space-x-1 px-4 py-2 rounded-md text-md font-medium transition-all duration-200 ${
                      location.pathname.startsWith(
                        item.dropdown[0].path.split("/").slice(0, -1).join("/")
                      )
                        ? "text-emerald-400 bg-black"
                        : "text-gray-200 hover:text-emerald-400"
                    }`}
                    onClick={() =>
                      item.label === "Education"
                        ? setEducationDropdownOpen(!educationDropdownOpen)
                        : setSetupDropdownOpen(!setupDropdownOpen)
                    }
                  >
                    <span>{item.label}</span>
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                  <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 right-0 mt-1 w-48 bg-black rounded-md shadow-lg transition-all duration-200 z-50">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={`block px-4 py-2 text-md transition-colors rounded-md duration-200 ${
                          location.pathname === subItem.path
                            ? "text-emerald-400 bg-black"
                            : "text-gray-200 hover:text-emerald-400"
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 rounded-md text-md font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? "text-emerald-400 bg-black"
                      : "text-gray-200 hover:text-emerald-400"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}

            {/* Profile Section */}
            <div className="relative ml-4">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Avatar className="h-8 w-8 ring-2 ring-gray-800 hover:ring-emerald-400 transition-all duration-200">
                  <AvatarImage src="/api/placeholder/32/32" alt="Profile" />
                  <AvatarFallback className="bg-black text-gray-200">
                    {/* {getUserInitials(userData?.userName)} */}
                    {getUserInitials("ADMIN")}
                  </AvatarFallback>
                </Avatar>
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-black rounded-md shadow-lg z-50 border border-gray-800">
                  <Button
                    variant="ghost"
                    className="w-full flex items-center space-x-2 justify-start text-gray-200 hover:text-emerald-400"
                    onClick={() => navigate("/dashboard/profile")}
                  >
                    <User size={16} className="shrink-0" />
                    <span>Profile</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full flex items-center space-x-2 justify-start text-gray-200 hover:text-red-400"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="shrink-0" />
                    <span>Logout</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-200 hover:text-emerald-400 hover:bg-black hover:rounded-md transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "text-emerald-400 bg-black"
                    : "text-gray-200 hover:text-emerald-400"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-gray-800 pt-2">
              <Button
                variant="ghost"
                className="w-full flex items-center space-x-2 justify-start text-gray-200 hover:text-emerald-400 hover:bg-black hover:rounded-md"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/dashboard/profile");
                }}
              >
                <User size={16} className="shrink-0" />
                <span>Profile</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full flex items-center space-x-2 justify-start text-gray-200 hover:text-red-400 hover:bg-black hover:rounded-md"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
              >
                <LogOut size={16} className="shrink-0" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
