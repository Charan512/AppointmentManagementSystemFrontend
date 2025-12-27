import { motion } from 'framer-motion';
import { Calendar, Clock, User, Building2, Hash, Timer, X } from 'lucide-react';
import StatusBadge from './StatusBadge';

const AppointmentCard = ({ appointment, onCancel, showOrganization = false, showUser = false }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const canCancel = appointment.status === 'pending' && onCancel;

    return (
        <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{ y: -4 }}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <StatusBadge status={appointment.status} />
                        {appointment.queuePosition > 0 && appointment.status === 'pending' && (
                            <span className="badge" style={{ background: 'var(--bg-tertiary)' }}>
                                <Hash size={12} />
                                Queue: {appointment.queuePosition}
                            </span>
                        )}
                    </div>
                    <h4 className="font-semibold text-lg">{appointment.serviceName}</h4>
                </div>
                {canCancel && (
                    <button
                        onClick={() => onCancel(appointment._id)}
                        className="btn-danger btn-sm"
                        style={{ padding: '0.5rem' }}
                        title="Cancel Appointment"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-secondary" />
                    <div>
                        <p className="text-tertiary" style={{ fontSize: '0.75rem' }}>Date</p>
                        <p className="font-medium">{formatDate(appointment.appointmentDate)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="text-secondary" />
                    <div>
                        <p className="text-tertiary" style={{ fontSize: '0.75rem' }}>Time</p>
                        <p className="font-medium">{appointment.appointmentTime}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <User size={16} className="text-secondary" />
                    <div>
                        <p className="text-tertiary" style={{ fontSize: '0.75rem' }}>Expert</p>
                        <p className="font-medium">{appointment.expertName}</p>
                    </div>
                </div>

                {appointment.estimatedWaitTime > 0 && appointment.status === 'pending' && (
                    <div className="flex items-center gap-2 text-sm">
                        <Timer size={16} className="text-secondary" />
                        <div>
                            <p className="text-tertiary" style={{ fontSize: '0.75rem' }}>Wait Time</p>
                            <p className="font-medium">~{appointment.estimatedWaitTime} min</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Organization Info (for user view) */}
            {showOrganization && appointment.organizationId && (
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <div className="flex items-center gap-2 text-sm">
                        <Building2 size={16} className="text-secondary" />
                        <div>
                            <p className="text-tertiary" style={{ fontSize: '0.75rem' }}>Organization</p>
                            <p className="font-medium">{appointment.organizationId.organizationName}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* User Info (for organization view) */}
            {showUser && appointment.userId && (
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <div className="flex items-center gap-2 text-sm">
                        <User size={16} className="text-secondary" />
                        <div>
                            <p className="text-tertiary" style={{ fontSize: '0.75rem' }}>Patient/Customer</p>
                            <p className="font-medium">{appointment.userId.name}</p>
                            {appointment.userId.phone && (
                                <p className="text-secondary" style={{ fontSize: '0.75rem' }}>{appointment.userId.phone}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Notes */}
            {appointment.notes && (
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <p className="text-tertiary" style={{ fontSize: '0.75rem' }}>Notes</p>
                    <p className="text-sm text-secondary mt-1">{appointment.notes}</p>
                </div>
            )}
        </motion.div>
    );
};

export default AppointmentCard;
