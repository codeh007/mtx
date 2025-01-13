'use client'

import { Button } from 'mtxuilib/ui/button'
import dynamic from 'next/dynamic'
import { AppLazy, TestLazy2Lz } from '../../../components/Lazy'


export default function Page() {

  return <>
  <AppLazy/>
  
  <Button onClick={async ()=>{
    console.log("TestLazy2Lz",TestLazy2Lz.default())
  }}>test1</Button>
  </>
}

