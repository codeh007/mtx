"use client";
import { useRouter } from "next-nprogress-bar";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";

/*
提示： next-nprogress-bar 的 router 本身已经封装了 nextjs 的router。
      这个router 可以触发顶部 页面 跳转 进度条。
      这里在 next-nprogress-bar router 基础上，进一步封装
*/
export const useMtRouter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const setSearchParams = useCallback(
    (params: URLSearchParams | Record<string, string>) => {
      router.push(`${pathname}?${new URLSearchParams(params).toString()}`);
    },
    [router, pathname],
  );
  return {
    ...router,
    setSearchParams,
  };
};

export const useGo = () => {
  const router = useRouter();
  const pathName = usePathname();

  const goParent = useCallback(() => {
    const pathSegments = pathName.split("/");
    const a = pathSegments.slice(0, -1).join("/");
    console.log(a);
    router.replace(a);
  }, [pathName, router]);
  return {
    goParent,
  };
};

// export const useMtSearchs = () => {
// 	const searchParamsFromNextjs = useSearchParams();
// 	const finnalParams = useMemo(() => {
// 		return Object.fromEntries(searchParamsFromNextjs);
// 	}, [searchParamsFromNextjs]);

// 	const router = useMtRouter();
// 	const pathName = usePathname();
// 	const pushUrl = useDebouncedCallback(router.push, 300);
// 	const patchSearchs = useCallback(
// 		(values: Record<string, string>) => {
// 			const params = { ...finnalParams, ...values };
// 			// biome-ignore lint/complexity/noForEach: <explanation>
// 			Object.keys(params).forEach((k) => {
// 				if (!params[k]) {
// 					delete params[k];
// 				}
// 			});
// 			// 我的提问，这是基于 nextjs 14 app router 方式的代码。
// 			// 我希望实现的功能是 根据出入的参数 values ，使用 改动网址的 searchParam的值。
// 			// 例如 当前网址 https://www.example.com/path1?a=1&b=2&c=3
// 			//      调用 pathSearchs({d:4,a:"a2"}) 后，浏览器的url应该变为 https://www.example.com/path1?a=a2&b=2&c=3&d=4
// 			//      应该提前判断 search params的值，如果避免完全相同的url 调用 router.push
// 			if (typeof window !== "undefined") {
// 				pushUrl(`${pathName}?${new URLSearchParams(params).toString()}`);
// 				// window.location.replace(`${pathName}?${new URLSearchParams(params).toString()}`);
// 			}
// 		},
// 		[finnalParams, pathName, pushUrl],
// 	);
// 	return {
// 		params: finnalParams,
// 		get: (name: string) => {
// 			return finnalParams?.[name];
// 		},
// 		patchSearchs,
// 	};
// };

export const useMtSearchs = () => {
  const searchParamsFromNextjs = useSearchParams();
  const finalParams = useMemo(() => {
    return Object.fromEntries(searchParamsFromNextjs);
  }, [searchParamsFromNextjs]);

  const router = useMtRouter();
  const pathName = usePathname();
  const pushUrl = useDebouncedCallback(router.push, 300);

  const patchSearchs = useCallback(
    (values: Record<string, string>) => {
      const params = { ...finalParams, ...values };

      // 删除值为空的参数
      // biome-ignore lint/complexity/noForEach: <explanation>
      Object.keys(params).forEach((k) => {
        if (!params[k]) {
          delete params[k];
        }
      });

      const newSearchString = new URLSearchParams(params).toString();
      const newUrl = `${pathName}?${newSearchString}`;
      const currentUrl = `${pathName}?${searchParamsFromNextjs.toString()}`;
      if (newUrl !== currentUrl) {
        pushUrl(newUrl);
      }
    },
    [finalParams, pathName, searchParamsFromNextjs, pushUrl],
  );

  return {
    params: finalParams,
    get: (name: string) => {
      return finalParams?.[name];
    },
    patchSearchs,
  };
};
