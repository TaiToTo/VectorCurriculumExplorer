export interface TreeNode {
    name: string;
    size?: number;
    children?: TreeNode[];
  }
  
  export type TreeData = TreeNode[];