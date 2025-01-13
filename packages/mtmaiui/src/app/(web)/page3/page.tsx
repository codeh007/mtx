'use client'

import { Button } from 'mtxuilib/ui/button'
import dynamic from 'next/dynamic'
// import { useEffect, useMemo } from 'react'
const AppLazy = dynamic(()=>import(
  // 提示: 通过 webpackage 魔法注释,可以控制导入文件的名称.
  /* webpackChunkName: "my-chunk-name" */ 
  '../../../App'
).then(x=>x.App),{ssr:false})

const TestLazy2 = dynamic(()=>import('../../../components/TestLazy2').then(x=>x.default),{ssr:false})

const DomClientLoader = dynamic(()=>import('../../../components/DomClientLoader').then(x=>x.DomClientLoader),{ssr:false})
export default function Page() {

  return <><AppLazy/><DomClientLoader/>
  
  <Button onClick={async ()=>{
    const a = await import("../../../components/TestLazy2")
    console.log(a)
  }}>test1</Button>
  </>
}

