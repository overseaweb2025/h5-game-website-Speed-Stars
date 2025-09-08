"use client"
import Iconponents from '@/components/ui/IconComponents/index'
import Link from 'next/link';
import { 
  Facebook, 
  X,
  Instagram, 
  Linkedin, 
  Mail,
  MessageCircle,
  RedoDotIcon,
  PrinterIcon,
  LinkedinIcon,
  InstagramIcon
} from 'lucide-react';
import { website } from '@/app/api/types/Get/website';
import { JSX } from 'react';

// 新增 websiteData props
interface SocialIconsProps {
  t?: any;
  websiteData: website | null; // 接收来自父组件的数据，可能为 null
}


export default function SocialIcons({ t, websiteData }: SocialIconsProps) {
  // 不再需要 useEffect 和 useState，数据直接从 props 获取
  
  if (!websiteData) {
    return null;
  }

  // 根据属性名动态渲染图标
  const renderSocialIcons = () => {
    const icons: JSX.Element[] = [];
    websiteData.social.forEach((items, index)=>{
      icons.push(
        <Iconponents key={`${items.name || ''}-${index}`} iconName={items.name || ''} url={items.value || ''} />
      )
    })
   
    
    return icons;
  };

  return (
    <div className="flex justify-center sm:justify-start space-x-4">
      {renderSocialIcons()}
    </div>
  );
}

