import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { Button } from 'twenty-ui/input';
import { H2Title } from 'twenty-ui/typography';
import { Section } from 'twenty-ui/layout';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import { EMAIL_SIGNATURE_STORAGE_KEY } from '@/activities/emails/hooks/useEmailComposerState';
import { TextArea } from '@/ui/input/components/TextArea';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';

const StyledButtonContainer = styled.div`
  margin-top: ${themeCssVariables.spacing[3]};
`;

// 2code: редактор подписи в письмах. Подпись хранится локально (на пользователя/браузер)
// и подставляется в тело нового письма (см. useEmailComposerState / getEmailSignatureHtml).
export const SettingsEmailSignature = () => {
  const { t } = useLingui();
  const { enqueueSuccessSnackBar } = useSnackBar();

  const [signature, setSignature] = useState<string>(() => {
    try {
      return window.localStorage.getItem(EMAIL_SIGNATURE_STORAGE_KEY) ?? '';
    } catch {
      return '';
    }
  });

  const handleSave = () => {
    try {
      window.localStorage.setItem(EMAIL_SIGNATURE_STORAGE_KEY, signature);
      enqueueSuccessSnackBar({ message: t`Подпись сохранена` });
    } catch {
      // localStorage недоступен — молча пропускаем
    }
  };

  return (
    <Section>
      <H2Title
        title={t`Подпись`}
        description={t`Подставляется в конец нового письма. Хранится на этом устройстве.`}
      />
      <TextArea
        placeholder={t`С уважением, команда 2code`}
        value={signature}
        onChange={setSignature}
        minRows={4}
      />
      <StyledButtonContainer>
        <Button title={t`Сохранить`} accent="blue" onClick={handleSave} />
      </StyledButtonContainer>
    </Section>
  );
};
