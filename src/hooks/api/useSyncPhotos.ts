import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';

import { SyncPhotosRepository } from '@/app/repositories/api/SyncPhotosRepository';
import { ChecklistPhotosStorageRepository } from '@/app/repositories/local/ChecklistPhotosStorageRepository';

export const useSyncPhotos = () => {
  const toast = useToast();

  const [hasPhotos, setHasPhotos] = useState(
    ChecklistPhotosStorageRepository.getHasPhotos(),
  );

  const { mutateAsync: syncFn, isPending: isLoadingSync } = useMutation({
    mutationFn: SyncPhotosRepository.syncAll,
  });

  const syncPhotos = useCallback(async () => {
    try {
      await syncFn();

      toast.show('Fotos sincronizadas com sucesso!', {
        type: 'success',
        placement: 'top',
      });
    } catch (error) {
      toast.show('Erro ao sincronizar fotos.', {
        type: 'error',
        placement: 'top',
      });
    } finally {
      setHasPhotos(ChecklistPhotosStorageRepository.getHasPhotos());
    }
  }, [syncFn, toast]);

  useFocusEffect(
    useCallback(() => {
      setHasPhotos(ChecklistPhotosStorageRepository.getHasPhotos());
    }, []),
  );

  return {
    hasPhotos,
    syncPhotos,
    isLoadingSync,
  };
};
