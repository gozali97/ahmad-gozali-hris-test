import api from './api'

export const positionService = {
  async getAll(params = {}) {
    const response = await api.get('/positions', { params })
    return response.data
  },

  async getAllActive() {
    const response = await api.get('/positions/all')
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/positions/${id}`)
    return response.data
  },

  async create(data) {
    const response = await api.post('/positions', data)
    return response.data
  },

  async update(id, data) {
    const response = await api.put(`/positions/${id}`, data)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/positions/${id}`)
    return response.data
  },
}
