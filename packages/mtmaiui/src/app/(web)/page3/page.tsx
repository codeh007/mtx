'use client'

import dynamic from 'next/dynamic'
const AppLazy = dynamic(()=>import('../../../App').then(x=>x.App),{ssr:false})

const DomClientLoader = dynamic(()=>import('../../../components/DomClientLoader').then(x=>x.DomClientLoader),{ssr:false})
export default function Page() {
  return <><AppLazy/><DomClientLoader/></>
}

