import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { appointmentService } from '../services/appointmentService';

const BookAppointment = ({ organization, onSuccess }) => {
    const [formData, setFormData] = useState({
        expertName: '',
        serviceName: '',
        appointmentDate: '',
        appointmentTime: '',
        notes: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await appointmentService.bookAppointment({
                organizationId: organization._id,
                ...formData,
            });
            setSuccess(true);
            setTimeout(() => {
                onSuccess();
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    // Get minimum date (today)
    const today = new Date().toISOString().split('T')[0];

    // Get available experts
    const availableExperts = organization.experts?.filter((e) => e.available) || [];

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-8"
            >
                <CheckCircle size={64} color="var(--status-completed)" style={{ margin: '0 auto 1rem' }} />
                <h3 className="text-2xl font-bold mb-2">Appointment Booked!</h3>
                <p className="text-secondary">Your appointment has been successfully scheduled.</p>
            </motion.div>
        );
    }

    return (
        <div>
            {/* Organization Info */}
            <div className="mb-6 p-4" style={{ background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                <h3 className="font-bold text-lg mb-2">{organization.organizationName}</h3>
                <p className="text-sm text-secondary">{organization.category}</p>
                {organization.address && <p className="text-sm text-secondary mt-1">{organization.address}</p>}
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
                {/* Expert Selection */}
                <div className="input-group">
                    <label className="input-label">
                        <User size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Select Expert
                    </label>
                    <select
                        name="expertName"
                        className="input-field"
                        value={formData.expertName}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Choose an expert...</option>
                        {availableExperts.map((expert, idx) => (
                            <option key={idx} value={expert.name}>
                                {expert.name} - {expert.specialization}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Service Name */}
                <div className="input-group">
                    <label className="input-label">
                        <FileText size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Service/Reason
                    </label>
                    <input
                        type="text"
                        name="serviceName"
                        className="input-field"
                        placeholder="e.g., General Checkup, Account Opening"
                        value={formData.serviceName}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Date */}
                <div className="input-group">
                    <label className="input-label">
                        <Calendar size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Appointment Date
                    </label>
                    <input
                        type="date"
                        name="appointmentDate"
                        className="input-field"
                        min={today}
                        value={formData.appointmentDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Time */}
                <div className="input-group">
                    <label className="input-label">
                        <Clock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Appointment Time
                    </label>
                    <input
                        type="time"
                        name="appointmentTime"
                        className="input-field"
                        value={formData.appointmentTime}
                        onChange={handleChange}
                        required
                    />
                    <p className="text-sm text-tertiary mt-1">
                        Duration: ~{organization.appointmentDuration || 30} minutes
                    </p>
                </div>

                {/* Notes */}
                <div className="input-group">
                    <label className="input-label">
                        <FileText size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Additional Notes (Optional)
                    </label>
                    <textarea
                        name="notes"
                        className="input-field"
                        placeholder="Any additional information..."
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                    />
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
            </form>

            {/* Working Hours Info */}
            {organization.workingHours && organization.workingHours.length > 0 && (
                <div className="mt-6 p-4" style={{ background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                    <h4 className="font-semibold mb-2">Working Hours</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {organization.workingHours
                            .filter((wh) => wh.isOpen)
                            .map((wh, idx) => (
                                <div key={idx} className="text-sm">
                                    <span className="font-medium">{wh.day}:</span>{' '}
                                    <span className="text-secondary">
                                        {wh.startTime} - {wh.endTime}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookAppointment;
