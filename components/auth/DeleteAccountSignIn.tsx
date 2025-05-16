'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import type * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
//import { useAuth } from '@/providers/AuthContext';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { userLoginSchema } from '@/utlis/validations/user-login-validation.schema';

type DeleteAccountSignInProp = {
  setOpenDeleteAccountDrawer: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DeleteAccountSignIn = ({
    setOpenDeleteAccountDrawer,
  }: DeleteAccountSignInProp) => {
  //const auth = useAuth();
  const t = useTranslations('Auth');
  const form = useForm<z.infer<typeof userLoginSchema>>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const handleSubmit = async (values: z.infer<typeof userLoginSchema>) => {
    console.log("values", values);
    setOpenDeleteAccountDrawer(true);
/*    await auth.deleteAccountLogin(values).then((res) => {
      if (res) {

      }
    });*/
  };
  return (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-center">
          {t('meta_sign_in_title')}
        </CardTitle>
        <CardDescription className="flex items-center justify-center text-center">
          {t('meta_sign_in_description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="user-login-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex items-center justify-center"
          >
            <div className="mx-auto grid w-[350px] gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => {
                  return (
                    <FormItem className="w-full">
                      <FormLabel>{t('meta_email_address')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('meta_email_address')}
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  return (
                    <FormItem className="w-full">
                      <FormLabel>{t('meta_password')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('meta_password')}
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <Button
                //disabled={auth.isLoading}
                type="submit"
                className="w-full"
              >
                {t('meta_sign_in_title')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};