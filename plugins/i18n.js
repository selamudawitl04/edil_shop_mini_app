import en from '~/locales/en.json'

export default defineNuxtPlugin((nuxtApp) => {
  const translations = {
    en
  }

  const t = (key, params = {}) => {
    const keys = key.split('.')
    let value = translations.en
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        return key // Return key if translation not found
      }
    }
    
    if (typeof value === 'string') {
      // Simple parameter replacement
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] || match
      })
    }
    
    return key // Return key if translation not found
  }

  nuxtApp.provide('t', t)
})
