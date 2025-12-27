import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
    const sizes = {
        sm: '30px',
        md: '40px',
        lg: '60px',
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4" style={{ padding: '3rem' }}>
            <motion.div
                className="spinner"
                style={{
                    width: sizes[size],
                    height: sizes[size],
                }}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />
            {text && <p className="text-secondary">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;
