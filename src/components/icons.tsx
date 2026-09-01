import iconAnalytics from '../assets/simba/icons/analytics.svg'
import iconAutomation from '../assets/simba/icons/automation.svg'
import iconBot from '../assets/simba/icons/bot.svg'
import iconCustomers from '../assets/simba/icons/customers.svg'
import iconFlowers from '../assets/simba/icons/flowers.svg'
import iconFood from '../assets/simba/icons/food.svg'
import iconFurniture from '../assets/simba/icons/furniture.svg'
import iconGoods from '../assets/simba/icons/goods.svg'
import iconHandmade from '../assets/simba/icons/handmade.svg'
import iconLocalBrand from '../assets/simba/icons/local-brand.svg'
import iconMiniApp from '../assets/simba/icons/mini-app.svg'
import iconProduction from '../assets/simba/icons/production.svg'
import iconServices from '../assets/simba/icons/services.svg'
import iconSite from '../assets/simba/icons/site.svg'

type IconProps = {
  className?: string
}

const base = 'shrink-0'

export function IconSite({ className = '' }: IconProps) {
  return <img src={iconSite} alt="" aria-hidden="true" className={`${base} ${className}`} />
}

export function IconBot({ className = '' }: IconProps) {
  return <img src={iconBot} alt="" aria-hidden="true" className={`${base} ${className}`} />
}

export function IconInbox({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 13L6.2 5.8C6.5 4.9 7.3 4.3 8.2 4.3H15.8C16.7 4.3 17.5 4.9 17.8 5.8L20 13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M4 13H8.5C8.8 13 9 13.2 9.1 13.4L9.6 14.7C9.8 15.2 10.3 15.5 10.8 15.5H13.2C13.7 15.5 14.2 15.2 14.4 14.7L14.9 13.4C15 13.2 15.2 13 15.5 13H20V17C20 18.1 19.1 19 18 19H6C4.9 19 4 18.1 4 17V13Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconUsers({ className = '' }: IconProps) {
  return <img src={iconCustomers} alt="" aria-hidden="true" className={`${base} ${className}`} />
}

export function IconGear({ className = '' }: IconProps) {
  return <img src={iconAutomation} alt="" aria-hidden="true" className={`${base} ${className}`} />
}

export function IconChart({ className = '' }: IconProps) {
  return <img src={iconAnalytics} alt="" aria-hidden="true" className={`${base} ${className}`} />
}

export function IconMenu({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6.5H20M4 12H20M4 17.5H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconClose({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} xmlns="http://www.w3.org/2000/svg">
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconChevronDown({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconCheck({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 12.3L10.7 15L16 9.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconCheckSmall({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12.5L9.5 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconTelegram({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20.5 4L3 11.2C2.4 11.4 2.4 12.3 3 12.5L7.6 14L9.4 19.6C9.6 20.2 10.3 20.3 10.7 19.9L13 17.7L17.4 20.9C17.9 21.3 18.6 21 18.7 20.4L21.5 5C21.6 4.4 21 3.8 20.5 4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M7.6 14L17 7.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function IconWhatsapp({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 18.5L3.7 20.5L4.4 17.9C3.5 16.6 3 15.1 3 13.5C3 8.8 7 5 12 5C17 5 21 8.8 21 13.5C21 18.2 17 22 12 22C10.4 22 8.9 21.6 7.6 20.9L6 18.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 12.2C9 14.5 10.9 16.3 13.1 16.3C13.5 16.3 13.9 15.9 13.9 15.5V15C13.9 14.7 13.7 14.5 13.5 14.4L12.2 13.9C12 13.8 11.7 13.9 11.6 14.1L11.3 14.5C10.6 14.1 10 13.5 9.6 12.8L10 12.5C10.2 12.4 10.3 12.1 10.2 11.9L9.7 10.6C9.6 10.4 9.4 10.2 9.1 10.2H8.6C8.2 10.2 7.9 10.6 7.9 11C7.9 11.4 8 11.8 9 12.2Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function IconPhone({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.5 3.5H9L10.5 7.5L8.3 9C9.1 11 10.9 12.9 13 13.7L14.5 11.5L18.5 13V15.5C18.5 16.9 17.3 18.1 15.9 18C11.3 17.6 6.4 12.7 6 8.1C5.9 6.7 5.1 4.4 6.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconMail({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} xmlns="http://www.w3.org/2000/svg">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.5 7L12 12.5L19.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconPackage({ className = '' }: IconProps) {
  return <img src={iconGoods} alt="" aria-hidden="true" className={`${base} ${className}`} />
}

export function IconFood({ className = '' }: IconProps) {
  return <img src={iconFood} alt="" aria-hidden="true" className={`${base} ${className}`} />
}

export function IconFactory({ className = '' }: IconProps) {
  return <img src={iconProduction} alt="" aria-hidden="true" className={`${base} ${className}`} />
}

export function IconWrench({ className = '' }: IconProps) {
  return <img src={iconServices} alt="" aria-hidden="true" className={`${base} ${className}`} />
}

export function IconHandmade({ className = '' }: IconProps) {
  return <img src={iconHandmade} alt="" aria-hidden="true" className={`${base} ${className}`} />
}

export function IconSofa({ className = '' }: IconProps) {
  return <img src={iconFurniture} alt="" aria-hidden="true" className={`${base} ${className}`} />
}

export function IconFlower({ className = '' }: IconProps) {
  return <img src={iconFlowers} alt="" aria-hidden="true" className={`${base} ${className}`} />
}

export function IconStorefront({ className = '' }: IconProps) {
  return <img src={iconLocalBrand} alt="" aria-hidden="true" className={`${base} ${className}`} />
}

export function IconBulb({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9.5 20H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M12 3.5C8.7 3.5 6 6.2 6 9.5C6 11.6 7.1 13.5 8.7 14.6C9.2 15 9.5 15.6 9.5 16.2V16.5H14.5V16.2C14.5 15.6 14.8 15 15.3 14.6C16.9 13.5 18 11.6 18 9.5C18 6.2 15.3 3.5 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconApp({ className = '' }: IconProps) {
  return <img src={iconMiniApp} alt="" aria-hidden="true" className={`${base} ${className}`} />
}

export function IconArrowRight({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`${base} ${className}`} xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
