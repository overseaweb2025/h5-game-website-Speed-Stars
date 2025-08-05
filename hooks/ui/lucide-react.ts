// 在你的组件文件顶部
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

// 创建一个映射对象，将字符串名称映射到图标组件
const iconMap = {
  facebook: Facebook,
  x: X,
  instagram: Instagram,
  linkedin: Linkedin,
  mail: Mail,
  reddit: MessageCircle, // 假设 'reddit' 对应 MessageCircle
  reddit2: RedoDotIcon, // 假设你可能还有其他 reddit 图标
  pinterest: PrinterIcon, // 假设 'pinterest' 对应 PrinterIcon
  linkedin2: LinkedinIcon, // 假设你可能还有其他 linkedin 图标
  instagram2: InstagramIcon // 假设你可能还有其他 instagram 图标
};


// ...你的组件代码...