import { VStack, Image, Text, Center, Heading, ScrollView } from 'native-base';

import LogoSvg from '@assets/logo.svg';
import BackgroundImg from '@assets/background.png';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

export function SignUp() {
  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    
    >
      <VStack bg='gray.700' flex={1} px={10} pb={16}>

        <Image
          source={BackgroundImg}
          alt='Pessoas treinando'
          resizeMode='contain'
          position='absolute'
        /> 
        
        <Center my={24}>
          <LogoSvg />
          <Text fontSize='sm' color='gray.100'>Treine sua mente e seu corpo</Text>
        </Center> 

        <Center>
          <Heading color='gray.100' fontSize='xl' mb={6} fontFamily='heading'>
            Crie sua conta
          </Heading>  


          <Input 
            placeholder='Nome'
          />

          <Input 
            placeholder='E-mail'
            keyboardType='email-address'
            autoCapitalize='none'
          />

          <Input 
            placeholder='Senha'
            secureTextEntry
          />

          <Button title='Criar e acessar' />

        </Center>

        <Button mt={24} title='Voltar para login' variant='outline' />

      </VStack>
    </ScrollView>
  );
}