export interface BookingUser {
	id: number
	name: string
	email: string
}

export interface BookingVehicle {
	id: number
	brand: string
	model: string
	license_plate: string
}

export type BookingStatus = 'active' | 'pending' | 'finished' | 'cancelled'

export interface Booking {
	id: number
	user_id: number
	vehicle_id: number
	start_time: string
	end_time: string
	total_price: number
	status: BookingStatus
	created_at: string
	user?: BookingUser
	vehicle?: BookingVehicle
}

export interface BookingFilters {
	page?: number
	search?: string
	status?: string
}

export interface PaginationData {
	current_page: number
	last_page: number
	per_page: number
	total: number
}

