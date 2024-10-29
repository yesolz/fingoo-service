import React from 'react';
import { EnterFullScreenIcon, ExitFullScreenIcon } from '@radix-ui/react-icons';
import IconButton from '../../../view/atom/icons/icon-button';
import { useViewMode } from '@/app/business/hooks/use-view-mode.hook';

export function ViewModeTriggerButton() {
  const { isViewMode, enableViewMode, disableViewMode } = useViewMode();

  return (
    <>
      {isViewMode ? (
        <IconButton icon={ExitFullScreenIcon} className="cursor-pointer" onClick={disableViewMode} color="gray" />
      ) : (
        <IconButton icon={EnterFullScreenIcon} className="cursor-pointer" onClick={enableViewMode} color="gray" />
      )}
    </>
  );
}
