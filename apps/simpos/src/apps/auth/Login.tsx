import React, { useEffect } from 'react';
import {
  Box,
  Stack,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Heading,
  Image,
  Flex,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { authService } from '../../services/auth';
import { useAuth } from '../../contexts/AuthProvider';

const SignInSchema = Yup.object().shape({
  login: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

export const Login: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const auth = useAuth();

  useEffect(() => {
    if (auth.isLoggedIn) {
      navigate('/');
    }
  }, [auth.isLoggedIn, navigate]);
  return (
    <Box backgroundColor="gray.50" position="fixed" w="full" h="full">
      <Box
        w="375px"
        margin="2rem auto 0 auto"
        p={4}
        rounded="lg"
        backgroundColor="white"
        shadow="md"
      >
        <Flex alignItems="center" mb={8}>
          <Image width="50px" height="50px" borderRadius="md" src="/logo.svg" />
          <Box ml={3}>
            <Heading color="brand.100" fontSize="2xl" fontWeight="medium">
              Simpos
            </Heading>
            <Heading color="brand.100" fontSize="sm" fontWeight="medium">
              A comprehensive point of sale system
            </Heading>
          </Box>
        </Flex>
        <Formik
          initialValues={{ login: 'jun@fibotree.com', password: '12345678' }}
          validationSchema={SignInSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const { data } = await authService.login(values);
              auth.signIn(data);
            } catch (e) {
              toast({
                title: 'Sign in failed',
                description: 'Wrong email or password. Please try again.',
                status: 'error',
                duration: 9000,
                isClosable: true,
              });
            }
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            isValid,
          }) => (
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl id="login">
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="login"
                    autoComplete="username"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.login}
                    isInvalid={
                      !!(errors.login && touched.login && errors.login)
                    }
                    backgroundColor="white"
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    isInvalid={
                      !!(errors.password && touched.password && errors.password)
                    }
                    backgroundColor="white"
                  />
                </FormControl>
                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  isLoading={isSubmitting}
                >
                  Sign in
                </Button>
              </Stack>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default Login;
