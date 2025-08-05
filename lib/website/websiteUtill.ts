import { website } from '@/app/api/types/Get/website';
import { useWebsiteData } from "@/hooks/useWebsiteData"
export const websiteUtill = (WebsiteData: website, name: string): string  => {
 
  // 查找 name 属性与传入的 name 参数匹配的项
  const foundItem = WebsiteData.website.find(item => item.name === name);

  // 如果找到了，返回它的 value；否则返回 null
  return foundItem ? foundItem.value : '' ;
};


//修改站点信息 不修改 图标
export const websiteUpdata = (name: string, value: string) => {
  const { websiteData } = useWebsiteData();

  if (!websiteData?.website) {
    return;
  }
  
  // 查找 name 匹配的项
  websiteData.website.find(item =>{
    if( item.name === name){
      item.value = value
    }
  });
};

//修改图标的值
export const websiteUpdataIcon = (name: string, value: string)=>{
  const { websiteData } = useWebsiteData();
  if (!websiteData?.website) {
    return;
  }

  // 查找 name 匹配的项
  websiteData.social.find(item =>{
    if( item.name === name){
      item.value = value
    }
  });
}