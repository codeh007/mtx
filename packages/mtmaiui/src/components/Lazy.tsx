'use client'
import dynamic from "next/dynamic"


export const TestLazy2Lz =import(
    /* webpackChunkName: "test-lazy2" */
    "./TestLazy2"
)


export const AppLazy = dynamic(()=>import(
    /* webpackChunkName: "dashapp" */ 
    '../App'
).then(x=>x.App),{
    ssr:false,
})