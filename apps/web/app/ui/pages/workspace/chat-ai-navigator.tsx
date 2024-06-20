'use client';
import { Sidebar } from 'react-pro-sidebar';
import Chat from '../../components/domain/linguistic-guidance/chat';
import { useState } from 'react';
import { cn } from '@/app/utils/style';
import IconButton from '../../components/view/atom/icons/icon-button';
import { ChevronRightIcon } from '@heroicons/react/solid';
import { useResponsive } from '@/app/utils/hooks/use-responsive.hook';
import AdBannerImage1 from '@/public/assets/images/ad_banner_1.png';
import AdBannerImage2 from '@/public/assets/images/ad_banner_2.png';
import Image from 'next/image';

export default function ChatAiNavigator() {
  const [collpase, setCollpase] = useState(false);
  const { isBigScreen } = useResponsive();

  const handleCollpase = () => {
    setCollpase(!collpase);
  };

  const sidebarWidth = isBigScreen ? 400 : 300;

  return (
    <div className="relatvie">
      <IconButton
        size={'xs'}
        data-collapsed={collpase}
        className={cn(
          'absolute top-[3vh] z-10 rounded-full bg-fingoo-gray-1.5 drop-shadow-fingoo transition-transform duration-200 data-[collapsed=true]:rotate-180',
          collpase ? 'right-[8px]' : isBigScreen ? 'right-[388px]' : 'right-[288px]',
        )}
        color={'gray'}
        onClick={handleCollpase}
        icon={ChevronRightIcon}
      />
      <Sidebar
        collapsed={collpase}
        transitionDuration={0}
        collapsedWidth="20px"
        width={`${sidebarWidth}px`}
        backgroundColor={'#fff'}
        className="h-full shadow-sm"
      >
        {!collpase ? (
          <>
            <div className="h-[100px] w-full bg-gray-300">
              {isBigScreen ? (
                <Image src={AdBannerImage1} alt="광고 배너" />
              ) : (
                <Image src={AdBannerImage2} alt="광고 배너" />
              )}
            </div>
            <div className="h-[3vh] w-full border"></div>
            <div className="h-[84vh]">
              <Chat />
            </div>
          </>
        ) : null}
      </Sidebar>
    </div>
  );
}
