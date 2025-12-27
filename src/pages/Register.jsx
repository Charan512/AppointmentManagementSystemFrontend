import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Calendar, Mail, Lock, User, Phone, Building2, AlertCircle } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        phone: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...registerData } = formData;
            await register(registerData);
            // Navigate based on role
            navigate(formData.role === 'organization' ? '/organization-dashboard' : '/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animated-bg flex items-center justify-center" style={{ minHeight: '100vh', padding: '2rem 0' }}>
            <motion.div
                className="card-glass"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ maxWidth: '500px', width: '100%', margin: '1rem' }}
            >
                {/* Logo */}
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Calendar size={40} style={{ color: 'var(--primary-600)' }} />
                        <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 800 }}>
                            QueueFlow
                        </h1>
                    </div>
                    <p className="text-secondary">Create your account</p>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3"
                        style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}
                    >
                        <AlertCircle size={20} color="#dc2626" />
                        <span style={{ color: '#dc2626', fontSize: '0.875rem' }}>{error}</span>
                    </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Role Selection */}
                    <div className="input-group">
                        <label className="input-label">I am a:</label>
                        <div className="grid grid-cols-2 gap-3">
                            <motion.button
                                type="button"
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setFormData({ ...formData, role: 'user' })}
                                className={formData.role === 'user' ? 'btn-primary' : 'btn-secondary'}
                                style={{ padding: '0.75rem' }}
                            >
                                <User size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                User
                            </motion.button>
                            <motion.button
                                type="button"
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setFormData({ ...formData, role: 'organization' })}
                                className={formData.role === 'organization' ? 'btn-primary' : 'btn-secondary'}
                                style={{ padding: '0.75rem' }}
                            >
                                <Building2 size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                Organization
                            </motion.button>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">
                            <User size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            className="input-field"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">
                            <Mail size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="input-field"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">
                            <Phone size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Phone (Optional)
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            className="input-field"
                            placeholder="Enter your phone number"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">
                            <Lock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="input-field"
                            placeholder="Create a password (min 6 characters)"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">
                            <Lock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="input-field"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                {/* Login Link */}
                <div className="text-center mt-6">
                    <p className="text-secondary">
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
                            Sign in here
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
