import api from './api'

export const dashboardService = {
  async getAdminDashboard() {
    const response = await api.get('/dashboard/admin')
    return response.data
  },

  async getEmployeeDashboard() {
    const response = await api.get('/dashboard/employee')
    return response.data
  },
}
