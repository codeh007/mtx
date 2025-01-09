'use client'

import { useCallback, useEffect, useMemo } from "react";
import { createHighlighter, Highlighter } from "shiki";

const highlighterOptions = {
  langs: ['shell'],
  themes: ['light-plus', 'dark-plus'],
};
let globalSikiInstance: Highlighter | undefined = undefined
export  function useHighlighter(code: string){
	const init_siki = useCallback(async() => {
		if (typeof window === "undefined" ||globalSikiInstance) {
			return
		}
		globalSikiInstance = await createHighlighter(highlighterOptions)
		// console.log("init_siki done", window.siki)
	}, []);

	useEffect(()=>{
		init_siki()
	},[])

	const html = useMemo(() => {
		if(!globalSikiInstance){
			return code
		}
		return globalSikiInstance.codeToHtml(code, {
			lang: "shell",
			theme: "dark-plus",
		});
	}, [code, globalSikiInstance]);
  return html
}
