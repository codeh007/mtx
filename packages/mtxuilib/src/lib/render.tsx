// 提示： 代码来自： reacttable
//     功能： 以更加兼容的方式定义组件Type 和 渲染，主要解决的痛点在于react 有多个不同的类型，例如 ReactNode JsxComponment 等。
//           例如可以用Renderable类型同时满足一下的情况。
//    1: <Container SubComponent={MySubComponent}></Container>,
//    2: <Container SubComponent={<MySubComponent>11</MySubComponent>}></Container>

// import { Renderable } from "@tanstack/react-table"

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type Renderable<TProps = any> =
	| React.ReactNode
	| React.ComponentType<TProps>;
/**
 * If rendering headers, cells, or footers with custom markup, use flexRender instead of `cell.getValue()` or `cell.renderValue()`.
 */
export function flexRender<TProps extends object>(
	Comp: Renderable<TProps>,
	props: TProps,
): React.ReactNode | JSX.Element {
	return !Comp ? null : isReactComponent<TProps>(Comp) ? (
		<Comp {...props} />
	) : (
		Comp
	);
}

export function isReactComponent<TProps>(
	component: unknown,
): component is React.ComponentType<TProps> {
	return (
		isClassComponent(component) ||
		typeof component === "function" ||
		isExoticComponent(component)
	);
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function isClassComponent(component: any) {
	return (
		typeof component === "function" &&
		(() => {
			const proto = Object.getPrototypeOf(component);
			return proto.prototype?.isReactComponent;
		})()
	);
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function isExoticComponent(component: any) {
	return (
		typeof component === "object" &&
		typeof component.$$typeof === "symbol" &&
		["react.memo", "react.forward_ref"].includes(component.$$typeof.description)
	);
}
