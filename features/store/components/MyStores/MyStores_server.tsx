import ErrorReload from '@/components/shared/ErrorReload';
import React from 'react'
import { fetchMyStoresData } from '../../api/getMyStoresData';
import MyStores from '@/features/store/components/MyStores/MyStores';
import { MyStoresResponse } from '../../types/type';
import { getT } from '@/lib/i18n/server';

const MyStores_server = async({locale}: {locale:string}) => {
    const t = await getT(locale);
 let error: Error | null = null;
   let myStores: MyStoresResponse | null = null;
  try{
   myStores = await fetchMyStoresData("",locale)
  }catch(err){
        console.error("Error fetching store details:", err);
    error = err instanceof Error ? err : new Error(t('myStores.failedToFetch'));
  }


  // Handle error state
  if (error || !myStores) {
    return (
      <div className="container mx-auto">
        <ErrorReload 
          title={t('myStores.unavailable')}
          message={t('myStores.couldntLoad')}
        />
      </div>
    );
  }

    return (
        <MyStores data={myStores}/>
    )
}

export default MyStores_server;