import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    Users,
    TrendingUp,
    CheckCircle,
    Zap,
    Shield,
    Smartphone,
    ArrowRight,
    Building2,
    User
} from 'lucide-react';

const Landing = () => {
    const features = [
        {
            icon: Calendar,
            title: 'Smart Scheduling',
            description: 'Book appointments instantly with real-time availability'
        },
        {
            icon: Clock,
            title: 'Queue Management',
            description: 'Track your position and estimated wait time in real-time'
        },
        {
            icon: Users,
            title: 'Multi-Expert Support',
            description: 'Choose from multiple service providers and specialists'
        },
        {
            icon: TrendingUp,
            title: 'Analytics Dashboard',
            description: 'Organizations get detailed insights and analytics'
        },
        {
            icon: Shield,
            title: 'Secure & Private',
            description: 'Your data is encrypted and protected with industry standards'
        },
        {
            icon: Smartphone,
            title: 'Mobile Friendly',
            description: 'Access from any device - desktop, tablet, or mobile'
        }
    ];

    const benefits = [
        { text: 'No more waiting in physical queues' },
        { text: 'Book appointments 24/7 from anywhere' },
        { text: 'Get real-time notifications and updates' },
        { text: 'Manage multiple appointments easily' },
        { text: 'Reduce no-shows with automated reminders' },
        { text: 'Improve customer satisfaction' }
    ];

    return (
        <div className="animated-bg">
            {/* Hero Section */}
            <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                        style={{ maxWidth: '900px', margin: '0 auto' }}
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="mb-6"
                        >
                            <Calendar size={80} style={{ color: 'var(--primary-600)', margin: '0 auto' }} />
                        </motion.div>

                        <h1
                            className="gradient-text mb-4"
                            style={{ fontSize: '4rem', lineHeight: 1.2 }}
                        >
                            Welcome to QueueFlow
                        </h1>

                        <p
                            className="text-secondary mb-8"
                            style={{ fontSize: '1.5rem', maxWidth: '700px', margin: '0 auto 3rem' }}
                        >
                            The modern way to manage appointments and queues.
                            Say goodbye to long waits and hello to efficiency.
                        </p>

                        <div className="flex gap-4" style={{ justifyContent: 'center' }}>
                            <Link to="/register">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn btn-primary btn-lg"
                                    style={{ fontSize: '1.25rem', padding: '1rem 2.5rem' }}
                                >
                                    <User size={24} />
                                    Get Started as User
                                    <ArrowRight size={24} />
                                </motion.button>
                            </Link>

                            <Link to="/register">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn btn-secondary btn-lg"
                                    style={{ fontSize: '1.25rem', padding: '1rem 2.5rem' }}
                                >
                                    <Building2 size={24} />
                                    For Organizations
                                </motion.button>
                            </Link>
                        </div>

                        <p className="text-tertiary mt-6">
                            Already have an account?{' '}
                            <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
                                Sign in here
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '6rem 0', background: 'var(--bg-primary)' }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="gradient-text mb-4" style={{ fontSize: '3rem' }}>
                            Powerful Features
                        </h2>
                        <p className="text-secondary text-lg">
                            Everything you need to manage appointments and queues efficiently
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="card-premium"
                            >
                                <div
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, var(--primary-500), var(--accent-cyan))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '1.5rem'
                                    }}
                                >
                                    <feature.icon size={30} color="white" />
                                </div>
                                <h3 className="mb-2" style={{ fontSize: '1.5rem' }}>{feature.title}</h3>
                                <p className="text-secondary">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section style={{ padding: '6rem 0' }}>
                <div className="container">
                    <div className="grid grid-cols-2 gap-8" style={{ alignItems: 'center' }}>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="gradient-text mb-4" style={{ fontSize: '3rem' }}>
                                Why Choose QueueFlow?
                            </h2>
                            <p className="text-secondary text-lg mb-6">
                                Transform the way you handle appointments and queues with our modern,
                                user-friendly platform designed for both customers and organizations.
                            </p>

                            <div className="flex flex-col gap-3">
                                {benefits.map((benefit, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, var(--accent-green), #059669)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}
                                        >
                                            <CheckCircle size={18} color="white" />
                                        </div>
                                        <p className="text-lg">{benefit.text}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="card-premium"
                            style={{ padding: '3rem' }}
                        >
                            <div className="text-center">
                                <Zap size={80} style={{ color: 'var(--primary-600)', margin: '0 auto 2rem' }} />
                                <h3 className="mb-4" style={{ fontSize: '2rem' }}>Ready to Get Started?</h3>
                                <p className="text-secondary mb-6" style={{ fontSize: '1.125rem' }}>
                                    Join thousands of users and organizations already using QueueFlow
                                    to streamline their appointment management.
                                </p>
                                <Link to="/register">
                                    <button className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                                        Create Free Account
                                        <ArrowRight size={20} />
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section style={{ padding: '4rem 0', background: 'var(--bg-primary)' }}>
                <div className="container text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="gradient-text mb-4" style={{ fontSize: '2.5rem' }}>
                            Start Managing Smarter Today
                        </h2>
                        <p className="text-secondary text-lg mb-6">
                            No credit card required. Get started in minutes.
                        </p>
                        <div className="flex gap-4" style={{ justifyContent: 'center' }}>
                            <Link to="/register">
                                <button className="btn btn-primary btn-lg">
                                    Sign Up Free
                                </button>
                            </Link>
                            <Link to="/login">
                                <button className="btn btn-secondary btn-lg">
                                    Sign In
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
