'use client';

import { useState } from 'react';

import { DeleteAccountDrawer } from '@/components/drawers/DeleteAccountDrawer';
import { DeleteAccountSignIn } from '@/components/auth/DeleteAccountSignIn';

const DeleteAccountPage = () => {
  const [openDeleteAccountDrawer, setOpenDeleteAccountDrawer] = useState(false);
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <DeleteAccountSignIn
        setOpenDeleteAccountDrawer={setOpenDeleteAccountDrawer}
      />
      {openDeleteAccountDrawer && (
        <DeleteAccountDrawer
          openDeleteAccountDrawer={openDeleteAccountDrawer}
          setOpenDeleteAccountDrawer={setOpenDeleteAccountDrawer}
        />
      )}
    </div>
  );
};

export default DeleteAccountPage;