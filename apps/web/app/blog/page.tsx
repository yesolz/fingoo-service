'use client';
import Link from 'next/link';
import ChatProvider from '../business/hooks/linguistic-guidance/provider/chat-provider';
import MockingUser from '../ui/components/util/mocking-user';
import { SWRProvider } from '../ui/components/util/swr-provider';
import ChatAiNavigator from '../ui/pages/workspace/chat-ai-navigator';
import FloatingComponentContainer from '../ui/pages/workspace/floating-component-container';
import SideNav from '../ui/pages/workspace/side-bar/sidenav';
import SplitScreenToggleGroup from '../ui/pages/workspace/split-screen/split-screen-toggle-group';
import Workspace from '../ui/pages/workspace/workspace';
import Callout from '../ui/components/view/molecule/callout';

export default function Page() {
  return (
    <>
      <MockingUser>
        <ChatProvider>
          <SWRProvider>
            <div className="flex h-screen md:flex-row md:overflow-hidden">
              <SideNav />
              <div className="grow bg-fingoo-gray-1.5">
                <div className="relative h-full w-full">
                  <div className="absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded-lg ">
                    <SplitScreenToggleGroup />
                  </div>
                  <div className="flex h-full items-center justify-center">
                    <Workspace />
                  </div>
                  <div className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-lg ">
                    <Callout>
                      FINGOO 블로그로 이동하려면{'   '}
                      <Link className="underline hover:text-gray-100" href="/blog">
                        여기
                      </Link>
                      를 클릭하세요.
                    </Callout>
                  </div>
                </div>
              </div>
              <ChatAiNavigator />
              <FloatingComponentContainer />
            </div>
          </SWRProvider>
        </ChatProvider>
      </MockingUser>
    </>
  );
}
