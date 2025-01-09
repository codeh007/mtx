
'use client'
import type { ComponentType } from "react"

const allViewComponents: Record<string, ComponentType<unknown>> = {}
export const RegisterView = (Component: ComponentType<unknown>, name: string | null) => {
  const _name = name
  if (!_name) {
    throw new Error("RegisterView missing _name value")
  }
  allViewComponents[_name] = Component
}

// export const getComponentName = (comp: any) => {
//   //自定义组件名称
//   let name = comp.blockName || comp.displayName || comp?.name
//   if (!name) {
//     if (comp?.$$typeof == Symbol.for('react.lazy')) {
//       name = comp?._payload?.value[2]
//     }
//     // else if (comp.$$typeof == Symbol.for('react.element')) {
//     //   console.log("xxxxxxxx223335555")
//     // }

//     else {
//       //这里未验证
//       name = comp?._payload?.value?.blockName || comp?._payload?.value?.name
//     }
//   }
//   if (!name) {
//     console.error({
//       message: "找不到客户端视图",
//       comp: comp,
//       data: JSON.stringify(comp, null, 2)
//     })
//   }
//   return name
// }

export const getComponentProps = (comp) => {
  //自定义组件名称
  let props1 = comp.props
  if (!props1) {
    props1 = comp.type?._payload?.value?.props
  }
  return props1
}
export const getRenderableComponent = (comp) => {
  let _comp = undefined
  if (comp.$$typeof === Symbol.for('react.element')) {
    _comp = comp.type
  }
  if (!_comp) {
    _comp = comp.type?._payload?.value || comp.type || comp
  }
  return _comp
}

export const getBlockEditorComponent = (comp) => {
  let editorComp = comp.type?._payload?.value?.Editor
  if (!editorComp) {
    if (comp.type?.$$typeof === Symbol.for('react.lazy')) {
      editorComp = comp.type?._payload?.value?.Editor
    } else {
      //这里未验证
      editorComp = comp.type?._payload?.value || comp.type?._payload
    }
  }
  return editorComp
}


export function getDynComponent(name: string) {
  const c = allViewComponents[name || ""]
  return c || null
}


export const blocks: Record<string, ComponentType<unknown>> = {}
