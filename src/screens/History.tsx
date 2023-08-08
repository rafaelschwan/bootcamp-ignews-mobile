import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Heading, VStack, SectionList, Text, useToast } from 'native-base';

import { api } from "@services/api";

import { AppError } from '@utils/AppError';

import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO";

import { ScreenHeader } from '@components/ScreenHeader';
import { HistoryCard } from '@components/HistoryCard';

export function History() {

  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);

  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);

  async function fetchHistory() {
    try {
      setIsLoading(true);
      const response = await api.get('/history');
      setExercises(response.data);

    } catch(error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar o histórico';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(useCallback(() => {
    fetchHistory();
  }, []));

  return (
    <VStack flex={1}>
      <ScreenHeader title='Histórico de exercícios' />
      
      <SectionList 
        sections={exercises}
        keyExtractor={item => item.id}
        renderSectionHeader={({ section }) => (
          <Heading fontFamily='heading' color='gray.200' fontSize='md' mt={10} mb={3}>{section.title}</Heading>
        )}        
        renderItem={({ item }) => (
          <HistoryCard data={item} />
        )}
        px={8}
        contentContainerStyle={exercises.length === 0 && { flex: 1, justifyContent: 'center' }}
        ListEmptyComponent={() => (
          <Text textAlign='center' color='gray.300'>Não há exercícios registrados ainda</Text>
        )}
        showsVerticalScrollIndicator={false}
      />
      
    </VStack>
  )
}