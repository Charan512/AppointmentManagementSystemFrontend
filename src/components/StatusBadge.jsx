import {
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Circle
} from 'lucide-react';

const StatusBadge = ({ status }) => {
    const getStatusConfig = () => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return {
                    className: 'badge-pending',
                    icon: <Clock size={14} />,
                    text: 'Pending',
                };
            case 'in-progress':
                return {
                    className: 'badge-in-progress',
                    icon: <AlertCircle size={14} />,
                    text: 'In Progress',
                };
            case 'completed':
                return {
                    className: 'badge-completed',
                    icon: <CheckCircle size={14} />,
                    text: 'Completed',
                };
            case 'cancelled':
                return {
                    className: 'badge-cancelled',
                    icon: <XCircle size={14} />,
                    text: 'Cancelled',
                };
            case 'open':
                return {
                    className: 'badge-open',
                    icon: <Circle size={14} />,
                    text: 'Open',
                };
            case 'closed':
                return {
                    className: 'badge-closed',
                    icon: <Circle size={14} />,
                    text: 'Closed',
                };
            default:
                return {
                    className: 'badge',
                    icon: null,
                    text: status,
                };
        }
    };

    const config = getStatusConfig();

    return (
        <span className={`badge ${config.className}`}>
            {config.icon}
            {config.text}
        </span>
    );
};

export default StatusBadge;
