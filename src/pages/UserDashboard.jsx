import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Filter, Inbox } from 'lucide-react';
import Navbar from '../components/Navbar';
import OrganizationCard from '../components/OrganizationCard';
import AppointmentCard from '../components/AppointmentCard';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { organizationService } from '../services/organizationService';
import { appointmentService } from '../services/appointmentService';
import BookAppointment from './BookAppointment';

const UserDashboard = () => {
    const [organizations, setOrganizations] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [activeTab, setActiveTab] = useState('organizations');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [orgsData, appointmentsData] = await Promise.all([
                organizationService.getAllOrganizations(),
                appointmentService.getUserAppointments(),
            ]);
            setOrganizations(orgsData.data.organizations);
            setAppointments(appointmentsData.data.appointments);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAppointment = async (id) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                await appointmentService.cancelAppointment(id);
                fetchData();
            } catch (error) {
                alert('Failed to cancel appointment');
            }
        }
    };

    const handleOrgClick = (org) => {
        setSelectedOrg(org);
        setShowBookingModal(true);
    };

    const handleBookingSuccess = () => {
        setShowBookingModal(false);
        setSelectedOrg(null);
        fetchData();
    };

    // Filter organizations
    const filteredOrgs = organizations.filter((org) => {
        const matchesSearch = org.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            org.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || org.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', ...new Set(organizations.map((org) => org.category))];

    const upcomingAppointments = appointments.filter(
        (apt) => apt.status === 'pending' || apt.status === 'in-progress'
    );

    if (loading) {
        return (
            <>
                <Navbar />
                <LoadingSpinner />
            </>
        );
    }

    return (
        <div className="animated-bg">
            <Navbar />
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    <h1 className="gradient-text mb-2" style={{ fontSize: '3rem' }}>Welcome to QueueFlow</h1>
                    <p className="text-secondary text-lg">
                        Browse organizations and book your appointments hassle-free
                    </p>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6" style={{ justifyContent: 'center' }}>
                    <button
                        onClick={() => setActiveTab('organizations')}
                        className={`tab-button ${activeTab === 'organizations' ? 'active' : ''}`}
                    >
                        <Search size={18} />
                        Browse Organizations
                    </button>
                    <button
                        onClick={() => setActiveTab('appointments')}
                        className={`tab-button ${activeTab === 'appointments' ? 'active' : ''}`}
                    >
                        <Calendar size={18} />
                        My Appointments ({appointments.length})
                    </button>
                </div>

                {/* Organizations Tab */}
                {activeTab === 'organizations' && (
                    <>
                        {/* Search and Filter */}
                        <div className="grid grid-cols-1 gap-4 mb-6" style={{ gridTemplateColumns: '1fr auto' }}>
                            <div className="input-group" style={{ marginBottom: 0 }}>
                                <div style={{ position: 'relative' }}>
                                    <Search
                                        size={20}
                                        style={{
                                            position: 'absolute',
                                            left: '1rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: 'var(--text-tertiary)',
                                        }}
                                    />
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Search organizations..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ paddingLeft: '3rem' }}
                                    />
                                </div>
                            </div>

                            <div className="input-group" style={{ marginBottom: 0, minWidth: '200px' }}>
                                <select
                                    className="input-field"
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Organizations Grid */}
                        {filteredOrgs.length > 0 ? (
                            <div className="grid grid-cols-3 gap-6">
                                {filteredOrgs.map((org) => (
                                    <OrganizationCard key={org._id} organization={org} onClick={() => handleOrgClick(org)} />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">
                                    <Inbox size={64} />
                                </div>
                                <h3>No organizations found</h3>
                                <p>Try adjusting your search or filters</p>
                            </div>
                        )}
                    </>
                )}

                {/* Appointments Tab */}
                {activeTab === 'appointments' && (
                    <>
                        {/* Upcoming Appointments */}
                        {upcomingAppointments.length > 0 && (
                            <div className="mb-8">
                                <h2 className="mb-4">Upcoming Appointments</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {upcomingAppointments.map((apt) => (
                                        <AppointmentCard
                                            key={apt._id}
                                            appointment={apt}
                                            showOrganization={true}
                                            onCancel={handleCancelAppointment}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* All Appointments */}
                        <div>
                            <h2 className="mb-4">All Appointments</h2>
                            {appointments.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {appointments.map((apt) => (
                                        <AppointmentCard
                                            key={apt._id}
                                            appointment={apt}
                                            showOrganization={true}
                                            onCancel={handleCancelAppointment}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-state-icon">
                                        <Calendar size={64} />
                                    </div>
                                    <h3>No appointments yet</h3>
                                    <p>Browse organizations to book your first appointment</p>
                                    <button onClick={() => setActiveTab('organizations')} className="btn btn-primary mt-4">
                                        Browse Organizations
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Booking Modal */}
            {showBookingModal && selectedOrg && (
                <Modal
                    isOpen={showBookingModal}
                    onClose={() => {
                        setShowBookingModal(false);
                        setSelectedOrg(null);
                    }}
                    title="Book Appointment"
                    maxWidth="700px"
                >
                    <BookAppointment organization={selectedOrg} onSuccess={handleBookingSuccess} />
                </Modal>
            )}
        </div>
    );
};

export default UserDashboard;
