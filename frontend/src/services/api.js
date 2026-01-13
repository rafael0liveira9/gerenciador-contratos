import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

// Clauses
export const clausesApi = {
  getAll: (search) => api.get('/clauses', { params: { search } }),
  getById: (id) => api.get(`/clauses/${id}`),
  getVersions: (id) => api.get(`/clauses/${id}/versions`),
  create: (data) => api.post('/clauses', data),
  createVersion: (id, data) => api.post(`/clauses/${id}/versions`, data),
  delete: (id) => api.delete(`/clauses/${id}`)
};

// Contracts
export const contractsApi = {
  getAll: () => api.get('/contracts'),
  getById: (id) => api.get(`/contracts/${id}`),
  create: (data) => api.post('/contracts', data),
  update: (id, data) => api.put(`/contracts/${id}`, data),
  delete: (id) => api.delete(`/contracts/${id}`),
  export: (id) => api.get(`/contracts/${id}/export`)
};

// Contract Blocks
export const blocksApi = {
  add: (contractId, data) => api.post(`/contract-blocks/${contractId}`, data),
  update: (blockId, data) => api.put(`/contract-blocks/${blockId}`, data),
  remove: (blockId) => api.delete(`/contract-blocks/${blockId}`),
  reorder: (contractId, blocks) => api.put(`/contract-blocks/${contractId}/reorder`, { blocks }),
  recalculate: (contractId) => api.post(`/contract-blocks/${contractId}/recalculate`)
};

export default api;
