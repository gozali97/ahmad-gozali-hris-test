import api from './api'

export const leaveService = {
  async getAll(params = {}) {
    const response = await api.get('/leaves', { params })
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/leaves/${id}`)
    return response.data
  },

  async create(data) {
    const response = await api.post('/leaves', data)
    return response.data
  },

  async approve(id, data = {}) {
    const response = await api.put(`/leaves/${id}/approve`, data)
    return response.data
  },

  async reject(id, data = {}) {
    const response = await api.put(`/leaves/${id}/reject`, data)
    return response.data
  },
}
