import { createAtomState } from '@/ui/utilities/state/jotai/utils/createAtomState';

// 2code: выбранная воронка для раздела Сделки. Фильтрует нативный листинг/канбан.
export const SELECTED_2CODE_FUNNEL_STORAGE_KEY = '2code-selected-funnel-id';

const initialFunnelId =
  typeof window !== 'undefined'
    ? window.localStorage.getItem(SELECTED_2CODE_FUNNEL_STORAGE_KEY)
    : null;

export const selected2codeFunnelIdState = createAtomState<string | null>({
  key: 'selected2codeFunnelIdState',
  defaultValue: initialFunnelId,
});
