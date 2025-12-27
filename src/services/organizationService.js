import api from './api';

export const organizationService = {
    createOrganization: async (data) => {
        const response = await api.post('/organizations', data);
        return response.data;
    },

    updateOrganization: async (id, data) => {
        const response = await api.put(`/organizations/${id}`, data);
        return response.data;
    },

    getAllOrganizations: async () => {
        const response = await api.get('/organizations');
        return response.data;
    },

    getOrganizationById: async (id) => {
        const response = await api.get(`/organizations/${id}`);
        return response.data;
    },

    getOrganizationByUserId: async (userId) => {
        const response = await api.get(`/organizations/user/${userId}`);
        return response.data;
    },

    getAnalytics: async (id) => {
        const response = await api.get(`/organizations/${id}/analytics`);
        return response.data;
    },
};
