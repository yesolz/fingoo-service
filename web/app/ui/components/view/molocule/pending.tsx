import clsx from 'clsx';
import React from 'react';

type PendingProps = React.PropsWithChildren<{
  isPending: boolean;
}>;

export default function Pending({ children, isPending }: PendingProps) {
  return <div className={clsx({ 'opacity-50': isPending, 'opacity-100': !isPending })}>{children}</div>;
}
