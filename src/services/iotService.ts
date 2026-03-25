import api from '@/services/api'

export interface IoTDevice {
  id: string
  license_plate: string
  name: string
  hardware_id?: string
  online: boolean
  vehicle_exists?: boolean
  is_orphan?: boolean
  vehicle_id?: number
  vehicle_name?: string
  telemetry: {
    latitude: number
    longitude: number
    speed: number
    rpm: number
    engine_temp: number
    battery_voltage: number
  }
  status: {
    active: boolean
    online: boolean
  }
}

export interface Vehicle {
  id: number
  license_plate: string
  brand: string
  model: string
}

export interface CommandResult {
  success: boolean
  result?: string
  error?: string
}

export interface LinkResult {
  success: boolean
  device_id?: string
  vehicle_id?: number
  license_plate?: string
  error?: string
}

/**
 * Servicio para operaciones IoT
 */
export const iotService = {
  /**
   * Verificar estado del microservicio IoT
   */
  async healthCheck(): Promise<{ ok: boolean; microservice: string }> {
    const response = await api.get('/admin/iot/health')
    return response.data
  },

  /**
   * Obtener todos los dispositivos IoT
   */
  async getDevices(): Promise<IoTDevice[]> {
    const response = await api.get('/admin/iot/devices')
    return response.data
  },

  /**
   * Obtener un dispositivo específico
   */
  async getDevice(deviceId: string): Promise<IoTDevice | null> {
    try {
      const response = await api.get(`/iot/devices/${deviceId}`)
      return response.data
    } catch {
      return null
    }
  },

  /**
   * Verificar si un dispositivo está online
   */
  async pingDevice(deviceId: string): Promise<boolean> {
    try {
      const response = await api.get(`/iot/devices/${deviceId}/ping`)
      return response.data.online
    } catch {
      return false
    }
  },

  /**
   * Encender un vehículo (solo admin)
   */
  async turnOn(deviceId: string): Promise<CommandResult> {
    try {
      const response = await api.post(`/admin/iot/devices/${deviceId}/on`)
      return { success: true, result: response.data.result }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al encender el vehículo' 
      }
    }
  },

  /**
   * Apagar un vehículo (solo admin)
   */
  async turnOff(deviceId: string): Promise<CommandResult> {
    try {
      const response = await api.post(`/admin/iot/devices/${deviceId}/off`)
      return { success: true, result: response.data.result }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al apagar el vehículo' 
      }
    }
  },

  /**
   * Enviar comando genérico (solo admin)
   */
  async sendCommand(deviceId: string, action: 'on' | 'off' | 'reboot', relay = 0): Promise<CommandResult> {
    try {
      const response = await api.post(`/admin/iot/devices/${deviceId}/command`, {
        action,
        relay
      })
      return { success: true, result: response.data.result }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al enviar comando' 
      }
    }
  },

  /**
   * Obtener dispositivos no vinculados (matrícula AUTO-*)
   */
  async getUnlinkedDevices(): Promise<IoTDevice[]> {
    try {
      const response = await api.get('/admin/iot/devices/unlinked')
      return response.data
    } catch {
      return []
    }
  },

  /**
   * Obtener vehículos disponibles para vincular
   */
  async getAvailableVehicles(): Promise<Vehicle[]> {
    try {
      const response = await api.get('/admin/iot/vehicles/available')
      return response.data
    } catch {
      return []
    }
  },

  /**
   * Vincular dispositivo IoT a vehículo
   */
  async linkDeviceToVehicle(deviceId: string, vehicleId: number): Promise<LinkResult> {
    try {
      const response = await api.post(`/admin/iot/devices/${deviceId}/link`, {
        vehicle_id: vehicleId
      })
      return { 
        success: true, 
        device_id: response.data.device_id,
        vehicle_id: response.data.vehicle_id,
        license_plate: response.data.license_plate
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al vincular dispositivo' 
      }
    }
  },

  /**
   * Desvincular dispositivo IoT (solo admin)
   */
  async unlinkDevice(deviceId: string): Promise<CommandResult> {
    try {
      const response = await api.post(`/admin/iot/devices/${deviceId}/unlink`)
      return { success: true, result: response.data.result }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al desvincular dispositivo' 
      }
    }
  },

  /**
   * Eliminar dispositivo IoT (solo admin)
   */
  async deleteDevice(deviceId: string): Promise<boolean> {
    try {
      await api.delete(`/admin/iot/devices/${deviceId}`)
      return true
    } catch {
      return false
    }
  },

  /**
   * Crear vehículo y vincular dispositivo automáticamente (solo admin)
   */
  async createVehicleAndLink(deviceId: string, data: { license_plate: string; brand: string; model: string; active?: boolean }): Promise<LinkResult> {
    try {
      const response = await api.post(`/admin/iot/devices/${deviceId}/create-vehicle`, data)
      return { 
        success: true, 
        device_id: deviceId,
        vehicle_id: response.data.vehicle.id,
        license_plate: response.data.vehicle.license_plate
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || error.response?.data?.message || 'Error al crear vehículo y vincular' 
      }
    }
  }
}

export default iotService
