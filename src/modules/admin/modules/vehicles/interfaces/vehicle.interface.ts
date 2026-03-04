export interface Vehicle {
  id: number
  license_plate: string
  brand: string | null
  model: string | null
  active: boolean
  type?: string
  battery_level?: number
  image_url?: string
  iot_device_id?: string
  created_at: string
  updated_at: string
}

export interface VehicleForm {
  license_plate: string
  brand: string
  model: string
  active: boolean
  iot_device_id?: string
}

export interface VehicleFilters {
  search?: string
  active?: boolean
  status?: string
}

export interface VehiclePagination {
  data: Vehicle[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}
