import React from 'react';
import { Search, Plus, User, LogOut } from 'lucide-react'; // Using lucide-react for clean icons
import axios from 'axios';
import {useNavigate} from 'react-router-dom';


const Navbar = () => {
  const url = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    try {
      await axios.get(`${url}/auth/logout`, { withCredentials: true });
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
      
      {/* Left Side: Rounded Search Button/Bar */}
      <div className="flex items-center flex-1">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-5 h-5 text-gray-400" />
          </span>
          <input
            type="text"
            className="block w-full py-2 pl-10 pr-4 bg-gray-100 border-transparent rounded-full focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="Search forms..."
          />
        </div>
      </div>

      {/* Right Side: Action Button and Profile */}
      <div className="flex items-center space-x-4">
        <button 
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors"
          onClick={() => navigate("/form-builder")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Form
        </button>

        <div className='flex gap-3 items-center px-4 py-2 rounded-full border border-gray-200'>
          <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all">
            <User className="w-6 h-6 text-gray-600" /> 
          </div>
          <div>
            <p>{user?.name}</p>
            <p className='text-gray-500 text-sm'>{user?.email}</p>

          </div>
        </div>

        <LogOut className="w-6 h-6 text-gray-600 cursor-pointer hover:text-red-600 transition-colors" onClick={handleLogout} />
      </div>

    </nav>
  );
};

export default Navbar;