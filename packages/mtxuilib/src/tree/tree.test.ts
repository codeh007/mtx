import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  test,
} from "bun:test";
import { TreeItemBase, makeTree } from "./tree";

// bun test --watch src/server/routes/tasks

describe("tasks", async () => {
  describe("基本树算法", async () => {
    const testSiteData = {
      node: [
        {
          id: "1",
          label: "1",
        },
        {
          id: "2",
          pid: "1",
          label: "1",
        },
        {
          id: "3",
          pid: "1",
          label: "3",
        },
        {
          id: "4",
          pid: "3",
          label: "4",
        },
      ] as TreeItemBase[],
    };
    test("test1", async () => {
      const treeview = makeTree(testSiteData.node);
      console.log("treeview", treeview);
    });
  });
});
