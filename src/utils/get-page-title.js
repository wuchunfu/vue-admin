import defaultSettings from '@/settings'
import i18n from '@/i18n'

const title = defaultSettings.title || 'Vue Admin'

export default function getPageTitle(key) {
  const hasKey = i18n.te(`route.${key}`)
  if (hasKey) {
    const pageName = i18n.t(`route.${key}`)
    return `${pageName} - ${title}`
  }
  return `${title}`
}
