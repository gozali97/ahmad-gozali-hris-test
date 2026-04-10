import api from './api'

export const employeeService = {
  async getAll(params = {}) {
    const response = await api.get('/employees', { params })
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/employees/${id}`)
    return response.data
  },

  async create(formData) {
    const response = await api.post('/employees', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async update(id, formData) {
    // Laravel doesn't support PUT with multipart, use POST with _method
    formData.append('_method', 'PUT')
    const response = await api.post(`/employees/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/employees/${id}`)
    return response.data
  },
}
