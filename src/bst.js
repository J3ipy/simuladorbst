// src/bst.js

export class TreeNode {
    constructor(value, parent = null, level = 1) {
      this.value = value;
      this.left = null;
      this.right = null;
      this.parent = parent;
      this.level = level;
    }
  }
  
  export class BST {
    constructor() {
      this.root = null;
    }
  
    insert(value) {
      if (!this.root) {
        this.root = new TreeNode(value);
        return;
      }
  
      const insertNode = (node, value, level = 2) => {
        if (value < node.value) {
          if (!node.left) {
            node.left = new TreeNode(value, node.value, level);
          } else {
            insertNode(node.left, value, level + 1);
          }
        } else {
          if (!node.right) {
            node.right = new TreeNode(value, node.value, level);
          } else {
            insertNode(node.right, value, level + 1);
          }
        }
      };
  
      insertNode(this.root, value);
    }
  }
  
  /**
   * Percorre a árvore e transforma em um array de nós:
   *  - value: valor do nó
   *  - parent: valor do pai (ou null)
   *  - depth: nível na árvore
   *  - isRoot: é raiz?
   *  - isLeaf: é folha?
   */
  export function serialize(root) {
    const out = [];
    function dfs(node, parent = null, depth = 1) {
      if (!node) return;
      out.push({
        value: node.value,
        parent: parent?.value ?? null,
        depth,
        isRoot: parent === null,
        isLeaf: !node.left && !node.right
      });
      dfs(node.left, node, depth + 1);
      dfs(node.right, node, depth + 1);
    }
    dfs(root);
    return out;
  }
  