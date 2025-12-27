import api from './api';

export const appointmentService = {
    bookAppointment: async (data) => {
        const response = await api.post('/appointments', data);
        return response.data;
    },

    getUserAppointments: async (status = null) => {
        const url = status ? `/appointments/user?status=${status}` : '/appointments/user';
        const response = await api.get(url);
        return response.data;
    },

    getOrganizationAppointments: async (orgId, filters = {}) => {
        let url = `/appointments/organization/${orgId}`;
        const params = new URLSearchParams();

        if (filters.status) params.append('status', filters.status);
        if (filters.date) params.append('date', filters.date);

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await api.get(url);
        return response.data;
    },

    updateAppointmentStatus: async (id, status) => {
        const response = await api.put(`/appointments/${id}/status`, { status });
        return response.data;
    },

    cancelAppointment: async (id) => {
        const response = await api.delete(`/appointments/${id}`);
        return response.data;
    },

    getAppointmentById: async (id) => {
        const response = await api.get(`/appointments/${id}`);
        return response.data;
    },
};
