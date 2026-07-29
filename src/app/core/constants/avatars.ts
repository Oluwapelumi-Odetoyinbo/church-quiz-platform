export interface AvatarOption {
  id: string;
  emoji: string;
  bg: string;
  /** Absolute https URL — required by POST /students/start (@IsUrl) */
  url: string;
}

/** Public Dicebear URLs so avatarUrl always passes backend @IsUrl() validation. */
export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 'lion',
    emoji: '🦁',
    bg: 'bg-[#FFF3D7]',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=lion'
  },
  {
    id: 'dolphin',
    emoji: '🐬',
    bg: 'bg-[#DDF4FF]',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=dolphin'
  },
  {
    id: 'fox',
    emoji: '🦊',
    bg: 'bg-[#FFE7D6]',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=fox'
  },
  {
    id: 'frog',
    emoji: '🐸',
    bg: 'bg-[#DDFBEA]',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=frog'
  },
  {
    id: 'butterfly',
    emoji: '🦋',
    bg: 'bg-[#F3E7FF]',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=butterfly'
  },
  {
    id: 'penguin',
    emoji: '🐧',
    bg: 'bg-[#DDF4FF]',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=penguin'
  }
];
