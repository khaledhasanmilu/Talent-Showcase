import React from 'react';
import { Mic, Footprints, Palette, ScrollText, MoreHorizontal, Music, Laugh } from 'lucide-react';
import { Category } from '../types';

interface CategoryIconProps {
  category: Category | string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = "w-5 h-5" }) => {
  switch (category) {
    case 'Singing':
      return <Mic className={className} />;
    case 'Dancing':
      return <Footprints className={className} />;
    case 'Art':
      return <Palette className={className} />;
    case 'Poetry':
      return <ScrollText className={className} />;
    case 'Instrumental':
      return <Music className={className} />;
    case 'Comedy':
      return <Laugh className={className} />;
    default:
      return <MoreHorizontal className={className} />;
  }
};
