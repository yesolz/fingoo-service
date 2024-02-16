import SelectableListItem from '../view/atom/selectable-list-item';
import IconButton from '../view/atom/icon-button/icon-button';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import { IndicatorBoardMetadataResponse } from '@/app/store/querys/numerical-guidance/indicator-board-metadata.query';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/use-selected-indicator-board-metadata.hook';
import { useDialogMenu } from '../view/molocule/dialog-menu';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';

type MetadataListItemProps = {
  item: IndicatorBoardMetadataResponse;
};

export default function MetadataListItem({ item }: MetadataListItemProps) {
  const { ref: iconButtonRef, openDialogMenuWithPayload } = useDialogMenu(DIALOG_KEY.METADATA_EDIT_MENU);
  const { selectedMetadata, selectMetadataById } = useSelectedIndicatorBoardMetadata();

  const handleSelect = () => {
    selectMetadataById(item.id);
  };

  const handleIconButton = () => {
    openDialogMenuWithPayload(item);
  };

  return (
    <div className="relative w-full group h-16">
      <SelectableListItem key={item.id} selected={selectedMetadata?.id === item.id} onSelect={handleSelect}>
        {item.name}
      </SelectableListItem>
      <div className="absolute invisible right-3 top-2/4 -translate-y-2/4  z-index-1 group-has-[:hover]:visible">
        <IconButton
          aria-label="edit"
          ref={iconButtonRef}
          onClick={handleIconButton}
          icon={DotsHorizontalIcon}
          color={'violet'}
        />
      </div>
    </div>
  );
}
