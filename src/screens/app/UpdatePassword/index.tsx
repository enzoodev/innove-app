import { useCallback, useMemo } from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTheme } from 'styled-components/native';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  passwordRules,
  TUpdatePasswordSchema,
  updatePasswordSchema,
} from '@/app/schemas/auth/updatePasswordSchema';

import { useAuth } from '@/hooks/useAuth';

import { Label } from '@/components/elements/Label';
import { Button } from '@/components/elements/Button';
import { PasswordInput } from '@/components/elements/PasswordInput';
import { AnimatedKeyboardWrapper } from '@/components/elements/AnimatedKeyboardWrapper';

import * as S from './styles';

export const UpdatePassword = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const dimensions = useWindowDimensions();
  const { handleUpdatePassword, isLoadingUpdatePassword } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
    watch,
  } = useForm<TUpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
  });

  const password = watch('password');

  const rules = useMemo(
    () =>
      passwordRules.map(item => ({
        message: item.message,
        isSatisfied: item.regex.test(password),
      })),
    [password],
  );

  const onSubmit: SubmitHandler<TUpdatePasswordSchema> = useCallback(
    async data => {
      await handleUpdatePassword({ newpass: data.password });
    },
    [handleUpdatePassword],
  );

  return (
    <S.Container>
      <ScrollView
        contentContainerStyle={{
          paddingTop: dimensions.height * 0.15,
          paddingBottom: insets.bottom,
        }}
      >
        <AnimatedKeyboardWrapper>
          <S.Content>
            <S.FormWrapper>
              <S.Header>
                <S.Title>Alterar senha</S.Title>
                <S.Subtitle>
                  Digite sua nova senha conforme as regras abaixo
                </S.Subtitle>
              </S.Header>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value, onBlur, ref } }) => (
                  <Label title="Senha">
                    <PasswordInput
                      ref={ref}
                      value={value}
                      onChangeText={onChange}
                      placeholder="Senha"
                      formError={errors.password?.message}
                      onBlur={onBlur}
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        setFocus('passwordConfirmation');
                      }}
                    />
                  </Label>
                )}
              />
              <Controller
                control={control}
                name="passwordConfirmation"
                render={({ field: { onChange, value, onBlur, ref } }) => (
                  <Label title="Confirmação de senha">
                    <PasswordInput
                      ref={ref}
                      value={value}
                      onChangeText={onChange}
                      placeholder="Confirmação de senha"
                      formError={errors.passwordConfirmation?.message}
                      onBlur={onBlur}
                      returnKeyType="send"
                      onSubmitEditing={handleSubmit(onSubmit)}
                    />
                  </Label>
                )}
              />
            </S.FormWrapper>
            <Button
              title="Entrar"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoadingUpdatePassword}
              color={theme.colors.buttonBodyTextColor}
              bgColor={theme.colors.buttonBodyBackground}
            />
          </S.Content>
        </AnimatedKeyboardWrapper>
      </ScrollView>
    </S.Container>
  );
};