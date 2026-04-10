import api from './api'

export const attendanceService = {
  async getAll(params = {}) {
    const response = await api.get('/attendances', { params })
    return response.data
  },

  async getTodayStatus() {
    const response = await api.get('/attendances/today')
    return response.data
  },

  async checkIn() {
    const response = await api.post('/attendances/check-in')
    return response.data
  },

  async checkOut() {
    const response = await api.put('/attendances/check-out')
    return response.data
  },

  async create(data) {
    const response = await api.post('/attendances', data)
    return response.data
  },

  async getRecap(params = {}) {
    const response = await api.get('/attendances/recap', { params })
    return response.data
  },
}
