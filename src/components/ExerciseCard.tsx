import { HStack, Heading, Image, Text, VStack, Icon } from "native-base";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Entypo } from '@expo/vector-icons';

type Props = TouchableOpacityProps & {

};

export function ExerciseCard({...rest}: Props) {

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
          source={{ uri: 'https://conteudo.imguol.com.br/c/entretenimento/0c/2019/12/03/remada-unilateral-com-halteres-1575402100538_v2_600x600.jpg' }}
          alt='Imagem do exercício'
          w={16}
          h={16}
          rounded='md'
          resizeMode='cover'
          mr={4}
        />
        <VStack flex={1}>
          <Heading fontSize='md' color='white' fontFamily='heading'>Remada unilateral</Heading>
          <Text numberOfLines={2} fontSize='sm' color='gray.200' mt={1}>
            3 séries de 12 repetições
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