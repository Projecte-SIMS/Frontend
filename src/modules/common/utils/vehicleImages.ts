/**
 * Utilidad para obtener imágenes de vehículos según marca y modelo
 * Usando imágenes de Unsplash (gratuitas)
 */

// Mapeo de imágenes por marca y modelo específico (Normalizado a minúsculas)
const vehicleImageMap: Record<string, Record<string, string>> = {
  'toyota': {
    'yaris': 'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?auto=format&fit=crop&q=80&w=800',
    'corolla': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800',
    'rav4': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800',
    'default': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800'
  },
  'seat': {
    'ibiza': 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&q=80&w=800',
    'leon': 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=800',
    'default': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800'
  },
  'renault': {
    'clio': 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800',
    'zoe': 'https://images.unsplash.com/photo-1594535182308-8ffefbb661e1?auto=format&fit=crop&q=80&w=800',
    'megane': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800',
    'default': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800'
  },
  'ford': {
    'fiesta': 'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&q=80&w=800',
    'focus': 'https://images.unsplash.com/photo-1551522435-a13afa10f103?auto=format&fit=crop&q=80&w=800',
    'mustang': 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800',
    'default': 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800'
  },
  'volkswagen': {
    'polo': 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&q=80&w=800',
    'golf': 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800',
    'id3': 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800',
    'default': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'
  },
  'peugeot': {
    '208': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800',
    '308': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800',
    'default': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'
  },
  'citroen': {
    'c3': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800',
    'c4': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800',
    'default': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=800'
  },
  'opel': {
    'corsa': 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800',
    'astra': 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800',
    'default': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800'
  },
  'tesla': {
    'model 3': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800',
    'model y': 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=800',
    'default': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800'
  },
  'hyundai': {
    'kona': 'https://images.unsplash.com/photo-1612485338263-1851df2467ac?auto=format&fit=crop&q=80&w=800',
    'ioniq': 'https://images.unsplash.com/photo-1594535182308-8ffefbb661e1?auto=format&fit=crop&q=80&w=800',
    'default': 'https://images.unsplash.com/photo-1612485338263-1851df2467ac?auto=format&fit=crop&q=80&w=800'
  }
}

// Fallback por palabras clave si no hay coincidencia exacta
const keywordFallback: Array<{ keywords: string[]; url: string }> = [
  { keywords: ['suv', 'alltrack', 'cross'], url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800' },
  { keywords: ['electric', 'ev', 'hybrid', 'e-'], url: 'https://images.unsplash.com/photo-1594535182308-8ffefbb661e1?auto=format&fit=crop&q=80&w=800' },
  { keywords: ['sport', 'gt', 'rs'], url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800' },
  { keywords: ['truck', 'van', 'cargo'], url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800' }
]

// Imagen por defecto final
const finalDefaultImage = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'

/**
 * Normaliza una cadena para búsqueda (minúsculas, sin acentos)
 */
function normalize(str: string): string {
  return str.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
}

/**
 * Obtiene la URL de imagen para un vehículo según su marca y modelo
 */
export function getVehicleImage(brand?: string | null, model?: string | null): string {
  if (!brand) return finalDefaultImage
  
  const b = normalize(brand)
  const m = model ? normalize(model) : ''
  
  // 1. Coincidencia exacta de marca y modelo
  if (vehicleImageMap[b]) {
    if (m && vehicleImageMap[b][m]) {
      return vehicleImageMap[b][m]
    }
    // 2. Imagen por defecto de la marca
    if (vehicleImageMap[b]['default']) {
      return vehicleImageMap[b]['default']
    }
  }
  
  // 3. Búsqueda por palabras clave en marca/modelo
  const fullString = `${b} ${m}`
  for (const entry of keywordFallback) {
    if (entry.keywords.some(k => fullString.includes(k))) {
      return entry.url
    }
  }
  
  return finalDefaultImage
}

/**
 * Obtiene la imagen de un vehículo desde el objeto completo
 */
export function getVehicleImageFromObject(vehicle: { brand?: string; model?: string; image?: string }): string {
  if (vehicle.image) return vehicle.image
  return getVehicleImage(vehicle.brand, vehicle.model)
}

export default getVehicleImage
