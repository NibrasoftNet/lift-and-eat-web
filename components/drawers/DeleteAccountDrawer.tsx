'use client';

import * as React from 'react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
//import { useAuth } from '@/providers/AuthContext';

type DeleteAccountDrawerProp = {
  openDeleteAccountDrawer: boolean;
  setOpenDeleteAccountDrawer: React.Dispatch<React.SetStateAction<boolean>>;
};

export function DeleteAccountDrawer({
    openDeleteAccountDrawer,
    setOpenDeleteAccountDrawer,
  }: DeleteAccountDrawerProp) {
  const t = useTranslations('Auth');
  //const auth = useAuth();

  async function onDeleteAccount() {
    setOpenDeleteAccountDrawer(false);
/*    await auth.deleteAccount().then(() => {
      if (auth.user) {

      }
    });*/
  }
  return (
    <Drawer
      open={openDeleteAccountDrawer}
      onOpenChange={setOpenDeleteAccountDrawer}
    >
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{t('delete_account')}</DrawerTitle>
            <DrawerDescription>{t('delete_account-msg')}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button onClick={() => onDeleteAccount()} variant="destructive">
              {t('delete_account')}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}