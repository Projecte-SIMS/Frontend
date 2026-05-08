<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { ChevronDownIcon, LanguageIcon, CheckIcon } from '@heroicons/vue/24/outline';

const { locale } = useI18n();
const showMenu = ref(false);

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ca', name: 'Català', flag: '🇦🇩' },
  { code: 'en', name: 'English', flag: '🇬🇧' }
] as const;

type Language = typeof languages[number];

const currentLanguage = ref<Language>(languages.find(l => l.code === locale.value) || languages[0]);

const changeLanguage = (lang: Language) => {
  locale.value = lang.code;
  currentLanguage.value = lang;
  localStorage.setItem('user-locale', lang.code);
  showMenu.value = false;
};

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const closeMenu = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.language-switcher')) {
    showMenu.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', closeMenu);
});

onUnmounted(() => {
  window.removeEventListener('click', closeMenu);
});
</script>

<template>
  <div class="relative language-switcher">
    <button 
      @click.stop="toggleMenu"
      class="flex items-center gap-x-2 rounded-lg bg-white/50 dark:bg-gray-800/40 px-3 py-2 border border-gray-100 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-all cursor-pointer group"
    >
      <LanguageIcon class="size-5 text-gray-500 dark:text-gray-400 group-hover:text-brand-primary-500 transition-colors" />
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ currentLanguage.name }}
      </span>
      <ChevronDownIcon 
        class="size-4 text-gray-400 transition-transform duration-200" 
        :class="{ 'rotate-180': showMenu }" 
      />
    </button>
    
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div 
        v-if="showMenu" 
        class="absolute right-0 top-full mt-2 z-[100] w-48 rounded-xl bg-white dark:bg-gray-800 shadow-xl ring-1 ring-gray-900/10 dark:ring-white/10 overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <div class="p-1">
          <button
            v-for="lang in languages"
            :key="lang.code"
            @click="changeLanguage(lang)"
            class="flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-colors"
            :class="locale === lang.code ? 'bg-brand-primary-50 dark:bg-brand-primary-900/20 text-brand-primary-600 dark:text-brand-primary-400 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'"
          >
            <div class="flex items-center gap-3">
              <span class="text-lg">{{ lang.flag }}</span>
              <span>{{ lang.name }}</span>
            </div>
            <CheckIcon v-if="locale === lang.code" class="size-4" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
