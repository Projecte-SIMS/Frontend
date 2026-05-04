<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 p-8 sm:p-12">
      <div class="mb-10 text-center">
        <div class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary-50 dark:bg-brand-primary-900/20 text-brand-primary-600 mb-6">
          <span class="material-icons text-3xl">Shield</span>
        </div>
        <h1 class="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Política de Privacidad</h1>
        <p class="text-sm text-gray-500 mt-2 italic">Última actualización: Abril 2026</p>
      </div>

      <div class="prose dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-400 leading-relaxed">
        <p>En Fleetly nos tomamos en serio la privacidad de tus datos. Esta política explica cómo recopilamos y tratamos tu información.</p>

        <section>
          <h2 class="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">1. Datos Recopilados</h2>
          <p>Recopilamos datos de registro (nombre, email, usuario) y datos de telemetría del vehículo (ubicación GPS, velocidad, estado del motor) mientras haces uso del servicio.</p>
        </section>

        <section>
          <h2 class="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">2. Uso de la Información</h2>
          <p>Tus datos se utilizan para:</p>
          <ul class="list-disc pl-5 space-y-2">
            <li>Gestionar tus reservas y facturación.</li>
            <li>Garantizar la seguridad de la flota y del usuario.</li>
            <li>Mejorar el rendimiento del hardware IoT.</li>
            <li>Cumplir con requerimientos legales de las autoridades en caso de accidente.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">3. Compartición con Terceros</h2>
          <p>No vendemos tus datos. Solo compartiremos información con proveedores de pago, autoridades judiciales (si existe requerimiento) y el administrador de tu organización (tenant).</p>
        </section>

        <section>
          <h2 class="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">4. Tus Derechos</h2>
          <p>Puedes solicitar el acceso, rectificación o eliminación de tus datos personales a través del portal de soporte o enviando un email a privacidad@fleetly.com.</p>
        </section>
      </div>

      <div class="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
        <router-link to="/login" class="text-brand-primary-600 font-black text-xs uppercase tracking-widest hover:underline">Volver al inicio</router-link>
      </div>
    </div>
  </div>
</template>
