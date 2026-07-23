import { styled } from '@linaria/react';
import { useEffect, useState } from 'react';
import { IconChevronDown, IconFilter, IconPlus } from 'twenty-ui/icon';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { useRecordIndexContextOrThrow } from '@/object-record/record-index/contexts/RecordIndexContext';
import {
  SELECTED_2CODE_FUNNEL_STORAGE_KEY,
  selected2codeFunnelIdState,
} from '@/object-record/record-index/states/selected2codeFunnelIdState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';

const StyledContainer = styled.div`
  position: relative;
  display: flex;
`;

const StyledButton = styled.button`
  align-items: center;
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  display: flex;
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
  gap: ${themeCssVariables.spacing[1]};
  height: 24px;
  padding: 0 ${themeCssVariables.spacing[2]};
`;

const StyledMenu = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  box-shadow: ${themeCssVariables.boxShadow.strong};
  left: 0;
  min-width: 200px;
  padding: ${themeCssVariables.spacing[1]};
  position: absolute;
  top: 130%;
  z-index: 100;
`;

const StyledItem = styled.div<{ active?: boolean }>`
  align-items: center;
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  display: flex;
  font-size: ${themeCssVariables.font.size.md};
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[2]};
  &:hover {
    background: ${themeCssVariables.background.transparent.light};
  }
`;

const StyledDivider = styled.div`
  background: ${themeCssVariables.border.color.light};
  height: 1px;
  margin: ${themeCssVariables.spacing[1]} 0;
`;

type FunnelRecord = { id: string; name: string; position?: number };

export const FunnelPicker = () => {
  const { objectNameSingular } = useRecordIndexContextOrThrow();
  const [open, setOpen] = useState(false);

  const selectedFunnelId = useAtomStateValue(selected2codeFunnelIdState);
  const setSelectedFunnelId = useSetAtomState(selected2codeFunnelIdState);

  const { records: funnels } = useFindManyRecords<FunnelRecord>({
    objectNameSingular: 'funnel',
    skip: objectNameSingular !== 'opportunity',
  });

  const { createOneRecord: createFunnel } = useCreateOneRecord({
    objectNameSingular: 'funnel',
  });
  const { createOneRecord: createStage } = useCreateOneRecord({
    objectNameSingular: 'funnelStage',
  });

  const selectFunnel = (id: string) => {
    setSelectedFunnelId(id);
    try {
      window.localStorage.setItem(SELECTED_2CODE_FUNNEL_STORAGE_KEY, id);
    } catch {
      // ignore
    }
    setOpen(false);
  };

  // По умолчанию выбираем первую воронку
  useEffect(() => {
    if (
      objectNameSingular === 'opportunity' &&
      !selectedFunnelId &&
      funnels.length > 0
    ) {
      selectFunnel(funnels[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funnels, selectedFunnelId, objectNameSingular]);

  if (objectNameSingular !== 'opportunity') {
    return null;
  }

  const currentFunnel = funnels.find((f) => f.id === selectedFunnelId);

  const handleCreate = async () => {
    const name = window.prompt('Название новой воронки:');
    if (!name?.trim()) return;
    const funnel = await createFunnel({ name: name.trim() });
    const newId = (funnel as FunnelRecord | undefined)?.id;
    if (newId) {
      const base = ['Новая', 'В работе', 'Успех', 'Отказ'];
      for (let i = 0; i < base.length; i++) {
        await createStage({ name: base[i], funnelId: newId, position: i });
      }
      selectFunnel(newId);
    }
    setOpen(false);
  };

  return (
    <StyledContainer>
      <StyledButton onClick={() => setOpen((v) => !v)}>
        <IconFilter size={14} />
        {currentFunnel?.name ?? 'Воронка'}
        <IconChevronDown size={12} />
      </StyledButton>
      {open && (
        <StyledMenu>
          {funnels.map((f) => (
            <StyledItem
              key={f.id}
              active={f.id === selectedFunnelId}
              onClick={() => selectFunnel(f.id)}
            >
              <IconFilter size={14} />
              {f.name}
            </StyledItem>
          ))}
          <StyledDivider />
          <StyledItem onClick={handleCreate}>
            <IconPlus size={14} />
            Создать воронку
          </StyledItem>
        </StyledMenu>
      )}
    </StyledContainer>
  );
};
