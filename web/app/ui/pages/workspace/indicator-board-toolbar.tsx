'use client';
import { Tab } from '@headlessui/react';
import MetadataTabPanel from './metadata-tab-panel';
import { useNumericalGuidanceStore } from '@/app/stores/numerical-guidance.store';
import { useEffect } from 'react';
import { API_PATH } from '@/app/api/api-path';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type ToolbarTabProps = {
  tabName: string;
  disable?: boolean;
};

function ToolbarTab({ tabName, disable = false }: ToolbarTabProps) {
  return (
    <Tab
      disabled={disable}
      key={tabName}
      className={({ selected }) =>
        classNames(
          'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
          'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
          selected ? 'bg-white text-blue-700 shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
          'disabled:cursor-not-allowed',
        )
      }
    >
      {tabName}
    </Tab>
  );
}

export default function IndicatorBoardToolbar() {
  const selectedMetadataId = useNumericalGuidanceStore((state) => state.selectedMetadataId);

  useEffect(() => {
    fetch(API_PATH.indicatorList)
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);

  return (
    <div className="h-full bg-red-800">
      <Tab.Group>
        <Tab.List className="flex space-x-1   p-1">
          <ToolbarTab disable={selectedMetadataId ? false : true} tabName="Tool Bar" />
          <ToolbarTab tabName="Meta Data" />
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>Content 1</Tab.Panel>
          <Tab.Panel>
            <MetadataTabPanel />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
