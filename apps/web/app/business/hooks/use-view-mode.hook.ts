import { useViewModeStore } from '@/app/store/stores/viewmode.store';

export const useViewMode = () => {
  const { setSideNavbarCollapsed, setChatbotSidebarCollapsed, sideNavbarCollapsed, chatbotSidebarCollapsed } =
    useViewModeStore();

  const isViewMode = sideNavbarCollapsed && chatbotSidebarCollapsed;

  const enableViewMode = () => {
    setSideNavbarCollapsed(true);
    setChatbotSidebarCollapsed(true);
  };

  const disableViewMode = () => {
    setSideNavbarCollapsed(false);
    setChatbotSidebarCollapsed(false);
  };

  return {
    isViewMode,
    setSideNavbarCollapsed,
    setChatbotSidebarCollapsed,
    enableViewMode,
    disableViewMode,
    sideNavbarCollapsed,
    chatbotSidebarCollapsed,
  };
};
