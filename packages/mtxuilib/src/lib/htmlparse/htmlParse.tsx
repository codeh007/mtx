"use client";
import { Element, type HTMLReactParserOptions } from "html-react-parser";

import type { PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import { Icons } from "../../icons/icons";
import { Button } from "../../ui";
import { Input } from "../../ui/input";

export const newToolbarParseOptions = () => {
  const parseOption: HTMLReactParserOptions = {
    // replace(domNode) {
    //     if (domNode instanceof Element) {
    //         // switch (domNode.attribs.class) {
    //         //     case "listtoolbar":
    //         //         return <ListViewToolbar></ListViewToolbar>
    //         //     // case "mtm_dash_list_view":
    //         //     //     return <div>TODO:mtm_dash_list_view</div>
    //         //     // case "list_view_action_new_button":
    //         //     //     return <div className='bg-red-200 p-2'>TODO:list_view_action_new_button</div>
    //         //     case "mtm_toolbar_button":
    //         //         const action = domNode.attribs.action
    //         //         if (domNode.children[0] instanceof Text) {
    //         //             const textContent = domNode.children[0];
    //         //             return <>
    //         //                 <ToolbarActionButton action={action} text={textContent.data} />
    //         //             </>;
    //         //         } else {
    //         //             return <>abcc---</>
    //         //         }
    //         //     default:
    //         //         return <div className="bg-red-600 p-2">unknow element type</div>
    //         // }
    //     }
    // },
    transform(reactNode, domNode, index) {
      if (domNode instanceof Element) {
        switch (domNode.attribs?.class) {
          case "list_view_action_new_button":
            return (
              <div className="bg-red-200 p-2">
                TODO:list_view_action_new_button
              </div>
            );
          case "mtm_dash_list_view":
            return (
              <div className="bg-red-300 p-2">
                <ListViewToolbar>{reactNode}</ListViewToolbar>
              </div>
            );
        }
        // const CustomComp = getDynamicComponentByName(domNode.tagName)

        switch (
          domNode.tagName
          // case "listitems":
          //     return <div className='bg-red-300 p-2'>TODO:listitems
          //         {reactNode}
          //     </div>
          // case "listitem":
          //     return <div className='bg-red-400 p-2'>{reactNode}</div>
          // case "mtcomboboxdropdownmenu":
          //     return <MtComboboxDropdownMenu>{reactNode}</MtComboboxDropdownMenu>
        ) {
        }
        // if (CustomComp) {
        //   return <CustomComp>{reactNode}</CustomComp>
        // }
        return null;
      }
      return reactNode as JSX.Element;
    },
  };
  return parseOption;
};

const ListViewToolbar = (props: {} & PropsWithChildren) => {
  const { children } = props;
  // const [actionHandler, setActionHandler] = useAtom(actionHandlerAtom)
  const form = useForm({
    // defaultValues: defaultValues
  });
  return (
    <div className="flex w-full gap-1">
      <div className="grow">
        <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 p-1 backdrop-blur">
          <form onSubmit={form.handleSubmit(() => {})} className="">
            <div className="relative">
              <Icons.search className="text-muted-foreground absolute left-2 top-2.5 size-4" />
              <Input
                {...form.register("q")}
                className=" pl-8"
                placeholder="Search"
              />
            </div>
          </form>
        </div>
      </div>
      {children}
      <div className="mx-auto flex items-center justify-center">
        <Button
          onClick={() => {
            // setOpenCreate(true)
            // onAction("list_new_item")
          }}
        >
          <Icons.add />
        </Button>
      </div>
    </div>
  );
};
