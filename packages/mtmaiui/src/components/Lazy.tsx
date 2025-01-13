'use client'
import dynamic from "next/dynamic"


export const TestLazy2Lz = await import(
    /* webpackChunkName: "test-lazy2" */
    "./TestLazy2"
)


export const AppLazy = dynamic(()=>import(
    /* webpackChunkName: "applazy" */ 
    '../App'
).then(x=>x.App),{
    ssr:false,
})