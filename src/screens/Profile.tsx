import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Center, Heading, ScrollView, Skeleton, Text, VStack, useToast } from 'native-base';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as yup from 'yup';

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { useAuth } from '@hooks/useAuth';

const PHOTO_SIZE = 33;

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  old_password: string;
  confirm_password: string;
}

const profileSchema: any = yup.object({
  name: yup.string().required('Informe o nome'),
  email: yup.string(),
  password: yup.string(),
  old_password: yup.string(),
  confirm_password: yup.string(),
});
 
export function Profile() {
  
  const toast = useToast();
  const { user } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({ 
    defaultValues: {
      name: user.name,
      email: user.email
    },
    resolver: yupResolver(profileSchema)
   });

  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState('https://github.com/rafaelschwan.png');

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true);
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
        selectionLimit: 1,
      });
  
      if (photoSelected.canceled) {
        return;
      }
  
      if (photoSelected.assets[0].uri) {

        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);

        if (photoInfo.exists && (photoInfo.size / 1024 / 1024) > 5) {
          return toast.show({
            title: 'Essa imagem é muito grande. Escolha uma de até 5MB',
            placement: 'top',
            bgColor: 'red.500',
            marginLeft: 3,
            marginRight: 3
          })
        }

        setUserPhoto(photoSelected.assets[0].uri);
      }

    } catch(error) {
      console.log(error);
    } finally {
      setPhotoIsLoading(false);
    }
  }   

  async function handleProfileUpdate(data: FormDataProps) {
    console.log(data);
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title='Perfil' />
      <ScrollView>
        <Center mt={6} px={10}>
          {photoIsLoading 
            ? (<Skeleton 
              w={PHOTO_SIZE} 
              h={PHOTO_SIZE} 
              rounded='full' 
              startColor='gray.500'
              endColor='gray.400'
            />) 
            : (<UserPhoto
              source={{ uri: userPhoto }}
              alt='Foto do usuário'
              size={PHOTO_SIZE}
            />)
          }
          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text color='green.500' fontWeight='bold' fontSize='md' mt={2} mb={8}>Alterar foto</Text>
          </TouchableOpacity>

          
          <Controller 
            control={control}
            name='name'
            render={
              ({ field: { value, onChange } }) => 
              (<Input 
                placeholder='Nome'
                bg='gray.600'
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />)
            }
          />

          <Controller 
            control={control}
            name='email'
            render={
              ({ field: { value, onChange } }) => 
              (<Input 
                placeholder='E-mail'
                isDisabled
                bg='gray.600'
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />)
            }
          />

        </Center>

        <VStack px={10} mt={12} mb={9}>
          <Heading fontFamily='heading' color='gray.200' fontSize='md' mb={2}>Alterar senha</Heading>


          <Controller 
            control={control}
            name='old_password'
            render={
              ({ field: { onChange } }) => 
              (<Input 
                bg='gray.600'
                placeholder='Senha antiga'
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.confirm_password?.message}
              />)
            }
          />
          

          <Controller 
            control={control}
            name='password'
            render={
              ({ field: { onChange } }) => 
              (<Input 
                bg='gray.600'
                placeholder='Nova senha'
                secureTextEntry
                onChangeText={onChange}
              />)
            }
          />

          <Controller 
            control={control}
            name='confirm_password'
            render={
              ({ field: { onChange } }) => 
              (<Input 
                bg='gray.600'
                placeholder='Confirme a nova senha'
                secureTextEntry
                onChangeText={onChange}
              />)
            }
          />

          <Button
            title='Atualizar'
            mt={4}
            onPress={handleSubmit(handleProfileUpdate)}
          />

        </VStack>

      </ScrollView>
    </VStack>
  )
}