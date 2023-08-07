import { HStack, Heading, Image, Text, VStack, Icon } from "native-base";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Entypo } from '@expo/vector-icons';
import { ExerciseDTO } from "@dtos/ExerciseDTO";

import { api } from '@services/api';

type Props = TouchableOpacityProps & {
  data: ExerciseDTO;
};

export function ExerciseCard({ data, ...rest }: Props) {

  return (
    <TouchableOpacity

      {...rest}
    >
      <HStack 
        bg='gray.500' 
        alignItems='center' 
        rounded='md'
        p={2} 
        pr={4} 
        mb={3} 
      >
        <Image 
          source={{ uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}` }}
          alt='Imagem do exercício'
          w={16}
          h={16}
          rounded='md'
          resizeMode='cover'
          mr={4}
        />
        <VStack flex={1}>
          <Heading fontSize='md' color='white' fontFamily='heading'>
            {data.name}
          </Heading>
          <Text numberOfLines={2} fontSize='sm' color='gray.200' mt={1}>
            {data.series} séries x {data.repetitions} repetições
          </Text>
        </VStack>
        <Icon
          as={Entypo}
          name='chevron-thin-right'
          color='gray.300'
        />
      </HStack> 
    </TouchableOpacity>
  );

}