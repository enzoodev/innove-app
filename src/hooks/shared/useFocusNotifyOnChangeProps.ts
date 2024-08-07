import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { NotifyOnChangeProps } from '@tanstack/react-query';

export function useFocusNotifyOnChangeProps(
  notifyOnChangeProps?: NotifyOnChangeProps,
) {
  const focusedRef = React.useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      focusedRef.current = true;

      return () => {
        focusedRef.current = false;
      };
    }, []),
  );

  return () => {
    if (!focusedRef.current) {
      return [] as any;
    }

    if (typeof notifyOnChangeProps === 'function') {
      return notifyOnChangeProps();
    }

    return notifyOnChangeProps;
  };
}
