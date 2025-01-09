export interface TreeItemBase {
  id: string;
  pid: string;
  children?: TreeItemBase[];
  [index: string]: any;
}

/****************************************************************************
 * 使用例子：
 *const nodes = makeTree(items.map(item => {
      return {
        ...item,
        id: item.id.toString(),
        pid: item.pid?.toString(),
        label: item.title || "--",
      }
    }))
 ***************************************************************************/
export function makeTree<T extends TreeItemBase>(treeNodes: T[]): T[] {
  // 提前生成节点查找表。
  // 如果明确节点是顺序可以保证先父后子，可以省去这次遍历，在后面边遍历过程中填充查找表
  const nodesMap = new Map<string, TreeItemBase>(
    treeNodes.map((node) => [node.id, node]),
  );
  // 引入虚拟根节点来统一实现 parent 始终有效，避免空判断
  const virtualRoot = {} as Partial<TreeItemBase>;
  treeNodes.forEach((node, i) => {
    const parent = nodesMap.get(node.pid || "") ?? virtualRoot;
    (parent.children ??= []).push(node);
  });
  return (virtualRoot.children ?? []) as T[];
}
