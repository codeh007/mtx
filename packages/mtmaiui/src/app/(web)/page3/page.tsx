'use client'

import { Button } from 'mtxuilib/ui/button'
import dynamic from 'next/dynamic'
const AppLazy = dynamic(()=>import(
  /* webpackChunkName: "my-app" */ 
  '../../../App'
).then(x=>x.App),{ssr:false})

// const TestLazy2 = dynamic(()=>import(
//   /* webpackChunkName: "test-lazy2" */ 
//   '../../../components/TestLazy2',
// ).then(x=>x.default),{ssr:false})

const DomClientLoader = dynamic(()=>import('../../../components/DomClientLoader').then(x=>x.DomClientLoader),{ssr:false})
export default function Page() {

  return <><AppLazy/><DomClientLoader/>
  
  <Button onClick={async ()=>{
    const a = await import(
      /* webpackChunkName: "test-lazy2" */
      "../../../components/TestLazy2"
    )
    console.log(a)
  }}>test1</Button>
  </>
}

