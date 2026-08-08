import React from 'react'

export interface IconProps {
  className?: string
  size?: number
  fill?: string
}

export const S: React.FC<IconProps & { children: React.ReactNode; viewBox?: string }> = ({
  className = '',
  size = 24,
  children,
  viewBox = '0 0 24 24',
  fill,
}) => (
  <svg
    width={size}
    height={size}
    viewBox={viewBox}
    fill={fill || (className.includes('fill-current') || className.includes('fill-amber') || className.includes('fill-bloom') ? 'currentColor' : 'none')}
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
)

export const FlowerIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4z" />
    <path d="M12 14a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4z" />
    <path d="M2 12a4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4 4 4 0 0 0-4 4z" />
    <path d="M14 12a4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4 4 4 0 0 0-4 4z" />
  </S>
)

export const HandIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M18 11V6a2 2 0 0 0-4 0v5" />
    <path d="M14 10V4a2 2 0 0 0-4 0v6" />
    <path d="M10 10.5V2a2 2 0 0 0-4 0v9" />
    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.8-6.7-2.8l-4.7-4.7a2 2 0 0 1 2.8-2.8L7 17V11a2 2 0 0 1 4 0" />
  </S>
)

export const TruckIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <rect x="1" y="3" width="15" height="13" rx="2" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </S>
)

export const GiftIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect x="2" y="7" width="20" height="5" rx="1" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </S>
)

export const CartIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </S>
)

export const StarIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </S>
)

export const LockIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </S>
)

export const MailIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </S>
)

export const ClockIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </S>
)

export const PinIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </S>
)

export const PhoneIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </S>
)

export const PlantIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M12 22V12" />
    <path d="M12 12C12 7.5 8.5 4 4 4c0 4.5 3.5 8 8 8z" />
    <path d="M12 12c0-4.5 3.5-8 8-8 0 4.5-3.5 8-8 8z" />
    <path d="M8 22h8" />
  </S>
)

export const KeyIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </S>
)

export const ScissorsIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.47" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </S>
)

export const CheckIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <polyline points="20 6 9 17 4 12" />
  </S>
)

export const CheckCircleIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </S>
)

export const HeartIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </S>
)

export const PlusIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </S>
)

export const MinusIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <line x1="5" y1="12" x2="19" y2="12" />
  </S>
)

export const ChevronDownIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <polyline points="6 9 12 15 18 9" />
  </S>
)

export const ArrowRightIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </S>
)

export const SearchIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </S>
)

export const SparkleIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </S>
)

export const UserIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </S>
)

export const LogoutIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </S>
)

export const FlameIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
  </S>
)

export const PetalIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    {/* Elegant petal silhouette with soft organic curves */}
    <path d="M12 22C12 22 4.5 17.5 4.5 11C4.5 6.5 7.5 2.5 12 2C16.5 2.5 19.5 6.5 19.5 11C19.5 17.5 12 22 12 22Z" />
    {/* Central stem */}
    <path d="M12 21.5V3" strokeWidth="1.4" />
    {/* Delicate left-side veins */}
    <path d="M12 9C10.5 8 9 6.5 8 5" strokeWidth="1.1" opacity="0.55" />
    <path d="M12 14C10.5 13 8.5 11.5 7.5 10" strokeWidth="1.1" opacity="0.55" />
    {/* Delicate right-side veins */}
    <path d="M12 9C13.5 8 15 6.5 16 5" strokeWidth="1.1" opacity="0.55" />
    <path d="M12 14C13.5 13 15.5 11.5 16.5 10" strokeWidth="1.1" opacity="0.55" />
    {/* Soft unfurling curl at petal tip */}
    <path d="M12 3C12.8 3.5 13.5 4.2 13.5 5" strokeWidth="1.2" opacity="0.8" />
    <path d="M12 3C11.2 3.5 10.5 4.2 10.5 5" strokeWidth="1.2" opacity="0.8" />
  </S>
)

export const InstagramIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </S>
)

export const PinterestIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 20c1.5-3.5 2-6.5 2.5-9.5M12 7c-2.5 0-4 1.5-4 3.5 0 1.5 1 2.5 2.5 2.5.5 0 1-.5 1-1 0 0 0-.5-.5-1-.5 0-1-.5-1-1 0-1 1-2 2-2s2 1 2 2c0 2-1 3.5-2.5 3.5-1 0-1.5-.5-1.5-1.5" />
  </S>
)

export const FacebookIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </S>
)

export const WhatsAppIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </S>
)
export const ThreadsIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" opacity="0" />
    <path d="M17.5 12.5c-.1 0-.2 0-.3 0a5.5 5.5 0 0 0-.2-1.2 5.3 5.3 0 0 0-2.8-3.4 6.5 6.5 0 0 0-5.5.3 5.2 5.2 0 0 0-1.5 1.2 4.8 4.8 0 0 0-.9 1.5 4.5 4.5 0 0 0 .1 3.5 4.7 4.7 0 0 0 2.8 2.4 6.3 6.3 0 0 0 4.6-.3 4.5 4.5 0 0 0 2.5-3.2c.1-.4 0-.7-.4-.8a3.3 3.3 0 0 0-1.1-.1 8 8 0 0 0-1.8.2 6.8 6.8 0 0 1-2.2.1 2.3 2.3 0 0 1-1.5-1 2.6 2.6 0 0 1-.3-1.8c.1-.4.3-.8.6-1.1a3 3 0 0 1 1.2-.7 5.4 5.4 0 0 1 3.3.2 3 3 0 0 1 1.5 1.1c.2.3.3.6.3.9 0 .3 0 .5-.2.8a1.5 1.5 0 0 1-.5.5 1.3 1.3 0 0 1-.7.2 1.2 1.2 0 0 1-.7-.1 1 1 0 0 1-.4-.4 1 1 0 0 1 .1-1 1.5 1.5 0 0 1 .5-.4 2 2 0 0 1 .7-.2c.2 0 .4 0 .6-.1a3.5 3.5 0 0 0-2.5-.5 2.5 2.5 0 0 0-1.8.9 2 2 0 0 0 .2 2.7 2.8 2.8 0 0 0 2.1.7 6 6 0 0 0 1.8-.3 8.5 8.5 0 0 1 2-.2 4.5 4.5 0 0 1 1.5.2 2 2 0 0 1 1.2 1.1 2.3 2.3 0 0 1 0 1.5 5.5 5.5 0 0 1-3 3.8 7.5 7.5 0 0 1-5.5.4 5.7 5.7 0 0 1-3.4-2.9 5.5 5.5 0 0 1-.1-4.2 5.8 5.8 0 0 1 1.1-1.8 6.2 6.2 0 0 1 1.8-1.4 7.8 7.8 0 0 1 6.6-.4 6.3 6.3 0 0 1 3.4 4.1 6.8 6.8 0 0 1 .3 1.4z" />
  </S>
)


export const ShareIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </S>
)

export const ShieldIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </S>
)

export const TicketIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M2 9a3 3 0 0 1 0 6v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v3z" />
    <line x1="12" y1="6" x2="12" y2="18" strokeDasharray="2 2" />
  </S>
)

export const TrophyIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M8 21h8" />
    <path d="M12 17v4" />
    <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
    <path d="M5 4H3a2 2 0 0 0-2 2v2a4 4 0 0 0 4 4h2" />
    <path d="M19 4h2a2 2 0 0 1 2 2v2a4 4 0 0 1-4 4h-2" />
  </S>
)

export const TargetIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </S>
)

export const BookmarkIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </S>
)

export const MenuIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </S>
)

export const CloseIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </S>
)

export const ChevronLeftIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <polyline points="15 18 9 12 15 6" />
  </S>
)

export const ChevronRightIcon: React.FC<IconProps> = (p) => (
  <S {...p}>
    <polyline points="9 18 15 12 9 6" />
  </S>
)

export const EyeIcon: React.FC<IconProps> = (p) => (
  <S {...p} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></S>
)

export const ShoppingCartIcon: React.FC<IconProps> = (p) => (
  <S {...p} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.145a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0zM14.25 14.145a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0zM3 5l2.5 9h11l2-7H5.5" /></S>
)

export const TelegramIcon: React.FC<IconProps> = (p) => (
  <S {...p} viewBox="0 0 24 24"><path d="M21.5 4.5L2.5 12l5.5 2 2 6 3-3.5 4.5 3.5z" strokeLinejoin="round" /></S>
)

export const XIcon: React.FC<IconProps> = (p) => (
  <S {...p} viewBox="0 0 24 24"><path d="M4 4l16 16M20 4L4 20" strokeLinecap="round" /></S>
)

export const LinkIcon: React.FC<IconProps> = (p) => (
  <S {...p} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.562 3.024m-.842 3.376a4.5 4.5 0 01-3.376.842m-2.91-2.91a4.5 4.5 0 010-6.364l2.12-2.122a4.5 4.5 0 016.365 0l.707.707M9.17 14.83a4.5 4.5 0 010-6.364l2.12-2.122a4.5 4.5 0 016.365 0l.707.707" /></S>
)
