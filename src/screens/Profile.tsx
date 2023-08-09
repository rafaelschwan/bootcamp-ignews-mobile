import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Center, Heading, ScrollView, Skeleton, Text, VStack, useToast } from 'native-base';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as yup from 'yup';

import { api } from '@services/api';

import { AppError } from '@utils/AppError';

import { useAuth } from '@hooks/useAuth';

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

const PHOTO_SIZE = 33;

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  old_password: string;
  confirm_password: string;
}

const profileSchema: any = yup.object({
  name: yup
    .string()
    .required('Informe o nome'),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 digitos')
    .nullable()
    .transform((value) => !!value ? value : null),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => !!value ? value : null)
    .oneOf([yup.ref('password'), ''], 'A confirmação de senha não confere')
    .when('password', {
      is: (Field: any) => Field, // Field !== null
      then: (schema) => schema
        .nullable()
        .required('Informe a confirmação da senha')
        .transform((value) => !!value ? value : null),
    }),
});
  
export function Profile() {
  
  const toast = useToast();
  const { user, updateUserProfile } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({ 
    defaultValues: {
      name: user.name,
      email: user.email
    },
    resolver: yupResolver(profileSchema)
   });

  const [isUpdating, setIsUpdating] = useState(false);

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
    try {
      setIsUpdating(true);

      const userUpdated = user;
      userUpdated.name = data.name;

      await api.put('/users', data);
      await updateUserProfile(userUpdated);

      toast.show({
        title: 'Perfil atualizado com sucesso',
        placement: 'top',
        bgColor: 'green.700'
      })

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível atualizar o perfil';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      });
    } finally {
      setIsUpdating(false);
    }
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
                errorMessage={errors.old_password?.message}
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
                errorMessage={errors.password?.message}
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
                errorMessage={errors.confirm_password?.message}
              />)
            }
          />

          <Button
            title='Atualizar'
            mt={4}
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isUpdating}
          />

        </VStack>

      </ScrollView>
    </VStack>
  )
}