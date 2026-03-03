/**
 * Utilidad para obtener imágenes de vehículos según marca y modelo
 * Usando imágenes de Unsplash (gratuitas)
 */

// Mapeo de imágenes por marca y modelo específico
const vehicleImageMap: Record<string, Record<string, string>> = {
  'Toyota': {
    'Yaris': 'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?auto=format&fit=crop&q=80&w=800',
    'default': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800'
  },
  'Seat': {
    'Ibiza': 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&q=80&w=800',
    'default': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800'
  },
  'Renault': {
    'Clio': 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800',
    'default': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800'
  },
  'Ford': {
    'Fiesta': 'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&q=80&w=800',
    'default': 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800'
  },
  'Volkswagen': {
    'Polo': 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&q=80&w=800',
    'default': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'
  },
  'Peugeot': {
    '208': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800',
    'default': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'
  },
  'Citroën': {
    'C3': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800',
    'default': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=800'
  },
  'Opel': {
    'Corsa': 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800',
    'default': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800'
  }
}

// Imagen por defecto para marcas no mapeadas
const defaultImage = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'

/**
 * Obtiene la URL de imagen para un vehículo según su marca y modelo
 */
export function getVehicleImage(brand?: string, model?: string): string {
  if (!brand) return defaultImage
  
  const brandImages = vehicleImageMap[brand]
  if (!brandImages) return defaultImage
  
  if (model && brandImages[model]) {
    return brandImages[model]
  }
  
  return brandImages['default'] || defaultImage
}

/**
 * Obtiene la imagen de un vehículo desde el objeto completo
 */
export function getVehicleImageFromObject(vehicle: { brand?: string; model?: string; image?: string }): string {
  // Si el vehículo ya tiene imagen asignada, usarla
  if (vehicle.image) return vehicle.image
  
  return getVehicleImage(vehicle.brand, vehicle.model)
}

export default getVehicleImage
