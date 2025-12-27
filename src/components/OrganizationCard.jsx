import { motion } from 'framer-motion';
import { Building2, Clock, MapPin, Users } from 'lucide-react';
import StatusBadge from './StatusBadge';

const OrganizationCard = ({ organization, onClick }) => {
    const isOpen = organization.isCurrentlyOpen;

    return (
        <motion.div
            className="card-premium float-animation"
            whileHover={{ scale: 1.03, y: -8 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            style={{ cursor: 'pointer' }}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, var(--primary-500), var(--accent-cyan))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Building2 size={24} color="white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">{organization.organizationName}</h3>
                        <p className="text-sm text-secondary">{organization.category}</p>
                    </div>
                </div>
                <StatusBadge status={isOpen ? 'open' : 'closed'} />
            </div>

            {/* Details */}
            <div className="flex flex-col gap-2">
                {organization.address && (
                    <div className="flex items-center gap-2 text-sm text-secondary">
                        <MapPin size={16} />
                        <span>{organization.address}</span>
                    </div>
                )}

                {organization.experts && organization.experts.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-secondary">
                        <Users size={16} />
                        <span>{organization.experts.length} Expert{organization.experts.length !== 1 ? 's' : ''} Available</span>
                    </div>
                )}

                {organization.workingHours && organization.workingHours.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-secondary">
                        <Clock size={16} />
                        <span>
                            {organization.workingHours.filter(wh => wh.isOpen).length} Days Open
                        </span>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                <button className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                    View Details & Book
                </button>
            </div>
        </motion.div>
    );
};

export default OrganizationCard;
