import { Heading, VStack, SectionList, Text } from 'native-base';

import { ScreenHeader } from '@components/ScreenHeader';
import { HistoryCard } from '@components/HistoryCard';
import { useState } from "react";

export function History() {

  const [exercises, setExercises] = useState([
    {
      title: '15.07.2023',
      data: ['Puxada frontal', 'Remada unilateral']
    },
    {
      title: '17.07.2023',
      data: ['Puxada frontal']
    }
  ])

  return (
    <VStack flex={1}>
      <ScreenHeader title='Histórico de exercícios' />
      
      <SectionList 
        sections={exercises}
        keyExtractor={item => item}
        renderSectionHeader={({ section }) => (
          <Heading fontFamily='heading' color='gray.200' fontSize='md' mt={10} mb={3}>{section.title}</Heading>
        )}        
        renderItem={({ item }) => (
          <HistoryCard />
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