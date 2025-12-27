import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Moon, Sun, Calendar, Building2, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout, isOrganization } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="bg-primary border-b border-border-color"
            style={{
                background: 'linear-gradient(135deg, var(--primary-600), var(--primary-700))',
                boxShadow: 'var(--shadow-lg)',
            }}
        >
            <div className="container">
                <div className="flex items-center justify-between" style={{ padding: '1rem 0' }}>
                    {/* Logo */}
                    <Link to={isOrganization ? '/organization-dashboard' : '/dashboard'} className="flex items-center gap-2">
                        <Calendar size={32} color="white" />
                        <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>
                            QueueFlow
                        </span>
                    </Link>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        {/* User Info */}
                        <div className="flex items-center gap-2" style={{ color: 'white' }}>
                            {isOrganization ? <Building2 size={20} /> : <User size={20} />}
                            <span style={{ fontWeight: 600 }}>{user?.name}</span>
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="btn-secondary"
                            style={{
                                padding: '0.5rem',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: 'none',
                                color: 'white',
                            }}
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="btn-secondary flex items-center gap-2"
                            style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: 'none',
                                color: 'white',
                            }}
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
