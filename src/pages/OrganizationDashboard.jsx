import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    TrendingUp,
    Users,
    Settings,
    Plus,
    Trash2,
    Save,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import AppointmentCard from '../components/AppointmentCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { organizationService } from '../services/organizationService';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';

const OrganizationDashboard = () => {
    const { user } = useAuth();
    const [organization, setOrganization] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Get organization by user ID
            const orgData = await organizationService.getOrganizationByUserId(user.id);
            setOrganization(orgData.data.organization);
            setFormData(orgData.data.organization);

            // Get appointments and analytics
            const [appointmentsData, analyticsData] = await Promise.all([
                appointmentService.getOrganizationAppointments(orgData.data.organization._id),
                organizationService.getAnalytics(orgData.data.organization._id),
            ]);

            setAppointments(appointmentsData.data.appointments);
            setAnalytics(analyticsData.data.analytics);
        } catch (error) {
            console.error('Error fetching data:', error);
            // Organization might not exist yet
            if (error.response?.status === 404) {
                setEditMode(true);
                setFormData({
                    organizationName: '',
                    description: '',
                    category: 'Hospital',
                    address: '',
                    phone: '',
                    appointmentDuration: 30,
                    workingHours: [],
                    experts: [],
                    weeklyDaysOff: [],
                    isCurrentlyOpen: true,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (appointmentId, newStatus) => {
        try {
            await appointmentService.updateAppointmentStatus(appointmentId, newStatus);
            fetchData();
        } catch (error) {
            alert('Failed to update appointment status');
        }
    };

    const handleSaveProfile = async () => {
        try {
            if (organization) {
                await organizationService.updateOrganization(organization._id, formData);
            } else {
                await organizationService.createOrganization(formData);
            }
            setEditMode(false);
            fetchData();
        } catch (error) {
            alert('Failed to save organization profile');
        }
    };

    const addWorkingHour = () => {
        setFormData({
            ...formData,
            workingHours: [
                ...(formData.workingHours || []),
                { day: 'Monday', startTime: '09:00', endTime: '17:00', isOpen: true },
            ],
        });
    };

    const removeWorkingHour = (index) => {
        const newHours = [...formData.workingHours];
        newHours.splice(index, 1);
        setFormData({ ...formData, workingHours: newHours });
    };

    const updateWorkingHour = (index, field, value) => {
        const newHours = [...formData.workingHours];
        newHours[index][field] = value;
        setFormData({ ...formData, workingHours: newHours });
    };

    const addExpert = () => {
        setFormData({
            ...formData,
            experts: [...(formData.experts || []), { name: '', specialization: '', available: true }],
        });
    };

    const removeExpert = (index) => {
        const newExperts = [...formData.experts];
        newExperts.splice(index, 1);
        setFormData({ ...formData, experts: newExperts });
    };

    const updateExpert = (index, field, value) => {
        const newExperts = [...formData.experts];
        newExperts[index][field] = value;
        setFormData({ ...formData, experts: newExperts });
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <LoadingSpinner />
            </>
        );
    }

    const todayAppointments = appointments.filter((apt) => {
        const today = new Date().toDateString();
        return new Date(apt.appointmentDate).toDateString() === today;
    });

    const pendingToday = todayAppointments.filter((apt) => apt.status === 'pending');

    return (
        <div className="animated-bg">
            <Navbar />
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
                    <h1 className="gradient-text mb-2" style={{ fontSize: '3rem' }}>Organization Dashboard</h1>
                    <p className="text-secondary text-lg">Manage your appointments and organization profile</p>
                </motion.div>

                {/* Analytics Cards */}
                {analytics && (
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        <motion.div
                            className="card"
                            whileHover={{ scale: 1.02 }}
                            style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))' }}
                        >
                            <div style={{ color: 'white' }}>
                                <div className="flex items-center justify-between mb-2">
                                    <Calendar size={24} />
                                    <span className="text-2xl font-bold">{analytics.today.total}</span>
                                </div>
                                <p style={{ opacity: 0.9 }}>Today's Appointments</p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="card"
                            whileHover={{ scale: 1.02 }}
                            style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}
                        >
                            <div style={{ color: 'white' }}>
                                <div className="flex items-center justify-between mb-2">
                                    <Clock size={24} />
                                    <span className="text-2xl font-bold">{analytics.today.pending}</span>
                                </div>
                                <p style={{ opacity: 0.9 }}>Pending Today</p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="card"
                            whileHover={{ scale: 1.02 }}
                            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                        >
                            <div style={{ color: 'white' }}>
                                <div className="flex items-center justify-between mb-2">
                                    <CheckCircle size={24} />
                                    <span className="text-2xl font-bold">{analytics.today.completed}</span>
                                </div>
                                <p style={{ opacity: 0.9 }}>Completed Today</p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="card"
                            whileHover={{ scale: 1.02 }}
                            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
                        >
                            <div style={{ color: 'white' }}>
                                <div className="flex items-center justify-between mb-2">
                                    <TrendingUp size={24} />
                                    <span className="text-2xl font-bold">{analytics.total}</span>
                                </div>
                                <p style={{ opacity: 0.9 }}>Total Appointments</p>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-4 mb-6" style={{ justifyContent: 'center' }}>
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                    >
                        <Calendar size={18} />
                        Appointments
                    </button>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                    >
                        <Settings size={18} />
                        Profile & Settings
                    </button>
                </div>

                {/* Appointments Tab */}
                {activeTab === 'overview' && (
                    <div>
                        <h2 className="mb-4">Today's Appointments</h2>
                        {todayAppointments.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {todayAppointments.map((apt) => (
                                    <div key={apt._id}>
                                        <AppointmentCard appointment={apt} showUser={true} />
                                        <div className="flex gap-2 mt-2">
                                            {apt.status === 'pending' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(apt._id, 'in-progress')}
                                                    className="btn btn-primary btn-sm"
                                                    style={{ flex: 1 }}
                                                >
                                                    Start
                                                </button>
                                            )}
                                            {apt.status === 'in-progress' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(apt._id, 'completed')}
                                                    className="btn btn-success btn-sm"
                                                    style={{ flex: 1 }}
                                                >
                                                    Complete
                                                </button>
                                            )}
                                            {(apt.status === 'pending' || apt.status === 'in-progress') && (
                                                <button
                                                    onClick={() => handleUpdateStatus(apt._id, 'cancelled')}
                                                    className="btn btn-danger btn-sm"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <Calendar size={64} />
                                <h3>No appointments today</h3>
                                <p>You're all clear for today!</p>
                            </div>
                        )}

                        <h2 className="mb-4 mt-8">All Appointments</h2>
                        {appointments.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {appointments.slice(0, 10).map((apt) => (
                                    <AppointmentCard key={apt._id} appointment={apt} showUser={true} />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <Calendar size={64} />
                                <h3>No appointments yet</h3>
                            </div>
                        )}
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2>Organization Profile</h2>
                            {!editMode ? (
                                <button onClick={() => setEditMode(true)} className="btn btn-primary">
                                    <Settings size={18} />
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button onClick={handleSaveProfile} className="btn btn-success">
                                        <Save size={18} />
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditMode(false);
                                            setFormData(organization || {});
                                        }}
                                        className="btn btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        {editMode ? (
                            <div className="card">
                                {/* Manual Open/Closed Toggle */}
                                <div className="mb-6 p-4" style={{ background: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="mb-1">Organization Status</h3>
                                            <p className="text-sm text-secondary">Manually control whether your organization is accepting appointments</p>
                                        </div>
                                        <label className="flex items-center gap-3">
                                            <span className="text-sm font-medium">{formData.isCurrentlyOpen ? 'Open' : 'Closed'}</span>
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isCurrentlyOpen || false}
                                                    onChange={(e) => setFormData({ ...formData, isCurrentlyOpen: e.target.checked })}
                                                    className="sr-only"
                                                />
                                                <div
                                                    className="w-14 h-8 rounded-full transition-colors cursor-pointer"
                                                    style={{ background: formData.isCurrentlyOpen ? 'var(--primary-500)' : 'var(--bg-tertiary)' }}
                                                    onClick={() => setFormData({ ...formData, isCurrentlyOpen: !formData.isCurrentlyOpen })}
                                                >
                                                    <div
                                                        className="w-6 h-6 bg-white rounded-full shadow-md transition-transform"
                                                        style={{
                                                            transform: formData.isCurrentlyOpen ? 'translateX(28px) translateY(4px)' : 'translateX(4px) translateY(4px)'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Basic Info */}
                                <h3 className="mb-4">Basic Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="input-group">
                                        <label className="input-label">Organization Name</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={formData.organizationName || ''}
                                            onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Category</label>
                                        <select
                                            className="input-field"
                                            value={formData.category || 'Hospital'}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="Hospital">Hospital</option>
                                            <option value="Clinic">Clinic</option>
                                            <option value="Bank">Bank</option>
                                            <option value="Service Center">Service Center</option>
                                            <option value="Government Office">Government Office</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Phone</label>
                                        <input
                                            type="tel"
                                            className="input-field"
                                            value={formData.phone || ''}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Appointment Duration (minutes)</label>
                                        <input
                                            type="number"
                                            className="input-field"
                                            value={formData.appointmentDuration || 30}
                                            onChange={(e) => setFormData({ ...formData, appointmentDuration: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Address</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={formData.address || ''}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Description</label>
                                    <textarea
                                        className="input-field"
                                        value={formData.description || ''}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                    />
                                </div>

                                {/* Working Hours */}
                                <h3 className="mb-4 mt-6">Working Hours</h3>
                                {formData.workingHours?.map((wh, idx) => (
                                    <div key={idx} className="grid grid-cols-5 gap-3 mb-3">
                                        <select
                                            className="input-field"
                                            value={wh.day}
                                            onChange={(e) => updateWorkingHour(idx, 'day', e.target.value)}
                                        >
                                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                                <option key={day} value={day}>
                                                    {day}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="time"
                                            className="input-field"
                                            value={wh.startTime}
                                            onChange={(e) => updateWorkingHour(idx, 'startTime', e.target.value)}
                                        />
                                        <input
                                            type="time"
                                            className="input-field"
                                            value={wh.endTime}
                                            onChange={(e) => updateWorkingHour(idx, 'endTime', e.target.value)}
                                        />
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={wh.isOpen}
                                                onChange={(e) => updateWorkingHour(idx, 'isOpen', e.target.checked)}
                                            />
                                            <span className="text-sm">Open</span>
                                        </label>
                                        <button onClick={() => removeWorkingHour(idx)} className="btn btn-danger btn-sm">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                <button onClick={addWorkingHour} className="btn btn-secondary btn-sm">
                                    <Plus size={16} />
                                    Add Working Hours
                                </button>

                                {/* Experts */}
                                <h3 className="mb-4 mt-6">Experts/Service Providers</h3>
                                {formData.experts?.map((expert, idx) => (
                                    <div key={idx} className="grid grid-cols-4 gap-3 mb-3">
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Name"
                                            value={expert.name}
                                            onChange={(e) => updateExpert(idx, 'name', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Specialization"
                                            value={expert.specialization}
                                            onChange={(e) => updateExpert(idx, 'specialization', e.target.value)}
                                        />
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={expert.available}
                                                onChange={(e) => updateExpert(idx, 'available', e.target.checked)}
                                            />
                                            <span className="text-sm">Available</span>
                                        </label>
                                        <button onClick={() => removeExpert(idx)} className="btn btn-danger btn-sm">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                <button onClick={addExpert} className="btn btn-secondary btn-sm">
                                    <Plus size={16} />
                                    Add Expert
                                </button>

                                {/* Weekly Days Off */}
                                <h3 className="mb-4 mt-6">Weekly Days Off</h3>
                                <p className="text-sm text-secondary mb-4">Select days when your organization is closed every week</p>
                                <div className="grid grid-cols-7 gap-3">
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                                        const isOff = formData.weeklyDaysOff?.includes(day);
                                        return (
                                            <div
                                                key={day}
                                                onClick={() => {
                                                    const currentDaysOff = formData.weeklyDaysOff || [];
                                                    if (isOff) {
                                                        setFormData({
                                                            ...formData,
                                                            weeklyDaysOff: currentDaysOff.filter(d => d !== day)
                                                        });
                                                    } else {
                                                        setFormData({
                                                            ...formData,
                                                            weeklyDaysOff: [...currentDaysOff, day]
                                                        });
                                                    }
                                                }}
                                                className="cursor-pointer transition-all"
                                                style={{
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    border: `2px solid ${isOff ? 'var(--primary-500)' : 'var(--glass-border)'}`,
                                                    background: isOff ? 'var(--primary-500)' : 'var(--glass-bg)',
                                                    color: isOff ? 'white' : 'var(--text-primary)',
                                                    textAlign: 'center',
                                                    fontWeight: isOff ? '600' : '400',
                                                }}
                                            >
                                                <div className="text-xs mb-1">{day.slice(0, 3)}</div>
                                                <div className="text-sm">{isOff ? '✓' : '○'}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : organization ? (
                            <div className="card">
                                {/* Organization Status Display */}
                                <div className="mb-6 p-4" style={{
                                    background: organization.isCurrentlyOpen ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))' : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
                                    borderRadius: '12px',
                                    border: `2px solid ${organization.isCurrentlyOpen ? 'var(--primary-500)' : '#ef4444'}`
                                }}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="mb-1">Organization Status</h3>
                                            <p className="text-sm text-secondary">Current operational status</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold" style={{ color: organization.isCurrentlyOpen ? 'var(--primary-500)' : '#ef4444' }}>
                                                {organization.isCurrentlyOpen ? '● OPEN' : '● CLOSED'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="mb-4">{organization.organizationName}</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-tertiary">Category</p>
                                        <p className="font-medium">{organization.category}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-tertiary">Phone</p>
                                        <p className="font-medium">{organization.phone || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-tertiary">Address</p>
                                        <p className="font-medium">{organization.address || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-tertiary">Appointment Duration</p>
                                        <p className="font-medium">{organization.appointmentDuration} minutes</p>
                                    </div>
                                </div>
                                {organization.description && (
                                    <div className="mt-4">
                                        <p className="text-sm text-tertiary">Description</p>
                                        <p className="font-medium">{organization.description}</p>
                                    </div>
                                )}

                                <h4 className="mt-6 mb-3">Working Hours</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {organization.workingHours?.filter((wh) => wh.isOpen).map((wh, idx) => (
                                        <div key={idx} className="text-sm">
                                            <span className="font-medium">{wh.day}:</span>{' '}
                                            <span className="text-secondary">
                                                {wh.startTime} - {wh.endTime}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <h4 className="mt-6 mb-3">Experts ({organization.experts?.length || 0})</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {organization.experts?.map((expert, idx) => (
                                        <div key={idx} className="text-sm">
                                            <span className="font-medium">{expert.name}</span>
                                            <span className="text-secondary"> - {expert.specialization}</span>
                                            {!expert.available && <span className="text-tertiary"> (Unavailable)</span>}
                                        </div>
                                    ))}
                                </div>

                                {/* Weekly Days Off Display */}
                                {organization.weeklyDaysOff && organization.weeklyDaysOff.length > 0 && (
                                    <>
                                        <h4 className="mt-6 mb-3">Weekly Days Off</h4>
                                        <div className="grid grid-cols-7 gap-2">
                                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                                                const isOff = organization.weeklyDaysOff.includes(day);
                                                return (
                                                    <div
                                                        key={day}
                                                        style={{
                                                            padding: '8px',
                                                            borderRadius: '6px',
                                                            border: `2px solid ${isOff ? '#ef4444' : 'var(--glass-border)'}`,
                                                            background: isOff ? 'rgba(239, 68, 68, 0.1)' : 'var(--glass-bg)',
                                                            textAlign: 'center',
                                                            opacity: isOff ? 1 : 0.5,
                                                        }}
                                                    >
                                                        <div className="text-xs font-medium">{day.slice(0, 3)}</div>
                                                        <div className="text-sm mt-1">{isOff ? '✕' : '✓'}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <Users size={64} />
                                <h3>No organization profile yet</h3>
                                <p>Click "Edit Profile" to set up your organization</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrganizationDashboard;
