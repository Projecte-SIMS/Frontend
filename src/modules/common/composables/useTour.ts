import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { onMounted } from 'vue'

export interface TourStep {
  element: string
  popover: {
    title: string
    description: string
    side?: 'left' | 'right' | 'top' | 'bottom'
    align?: 'start' | 'center' | 'end'
  }
}

export function useTour() {
  const runTour = (tourKey: string, steps: TourStep[]) => {
    // Check if user has already seen this tour
    const hasSeenTour = localStorage.getItem(tourKey)
    if (hasSeenTour === 'true') return

    // Inject global styles for the driver stage to avoid clipping
    if (!document.getElementById('driver-js-custom-styles')) {
      const style = document.createElement('style')
      style.id = 'driver-js-custom-styles'
      style.innerHTML = `
        .driver-stage {
          box-shadow: 0 0 0 6px #6366f1, 0 0 40px rgba(99, 102, 241, 0.8) !important;
          background: transparent !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .fleetly-driver-popover {
          border-radius: 20px !important;
          padding: 20px !important;
          border: 1px solid rgba(99, 102, 241, 0.2) !important;
        }
        .driver-popover-title {
          font-weight: 900 !important;
          font-size: 18px !important;
          color: #4f46e5 !important;
          margin-bottom: 8px !important;
        }
        .driver-popover-description {
          font-size: 14px !important;
          line-height: 1.6 !important;
          color: #475569 !important;
        }
        .driver-popover-navigation-btns button {
          border-radius: 10px !important;
          padding: 6px 12px !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          font-size: 10px !important;
        }
        .driver-popover-next-btn {
          background-color: #6366f1 !important;
          color: white !important;
          border: none !important;
          text-shadow: none !important;
        }
      `
      document.head.appendChild(style)
    }

    // Initialize driver.js
    const driverObj = driver({
      showProgress: true,
      animate: true,
      nextBtnText: 'Siguiente',
      prevBtnText: 'Anterior',
      doneBtnText: 'Finalizar',
      allowClose: true,
      overlayColor: 'rgba(0, 0, 0, 0.85)', // Revert to dark background
      stagePadding: 20, 
      stageRadius: 20, 
      popoverClass: 'fleetly-driver-popover',
      onDeselected: () => {
        localStorage.setItem(tourKey, 'true')
      },
      onDestroyed: () => {
         localStorage.setItem(tourKey, 'true')
      },
      steps: steps.map(step => ({
        element: step.element,
        popover: {
          title: step.popover.title,
          description: step.popover.description,
          side: step.popover.side || 'bottom',
          align: step.popover.align || 'center'
        }
      }))
    })

    // Start the tour with a small delay to ensure elements are rendered
    setTimeout(() => {
      driverObj.drive()
    }, 1000)
  }

  return {
    runTour
  }
}
