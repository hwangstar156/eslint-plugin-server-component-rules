module.exports = {
  meta: {
    type: 'problem',
    fixable: true,
    docs: {
      url: 'https://nextjs.org/docs/getting-started/react-essentials#when-to-use-server-and-client-components',
    },
  },
  create: (context) => {
    let isServerComponent = true;
    let isCustomHook = false;

    return {
      Program: function (node) {
        const sourceCode = context.getSourceCode().getText(node);
        const filename = context.getFilename();
        const extension = filename.substring(filename.lastIndexOf('.') + 1);

        if (extension === 'tsx' || extension === 'jsx') {
          if (sourceCode.includes('use client')) {
            isServerComponent = false;
          }
        } else {
          isServerComponent = false;
        }
      },
      ExportNamedDeclaration: function (node) {
        if (node.declaration?.type === 'VariableDeclaration') {
          if (node.declaration.declarations[0].id.name.match(/^use[A-Z]/)) {
            isCustomHook = true;
          }
        }

        if (node.declaration?.type === 'FunctionDeclaration') {
          if (node.declaration.id.name.match(/^use[A-Z]/)) {
            isCustomHook = true;
          }
        }
      },

      ExportDefaultDeclaration: function (node) {
        if (node.declaration?.type === 'Identifier') {
          if (node.declaration.name.match(/^use[A-Z]/)) {
            isCustomHook = true;
          }
        }

        if (node.declaration?.type === 'FunctionDeclaration') {
          if (node.declaration.id.name.match(/^use[A-Z]/)) {
            isCustomHook = true;
          }
        }
      },
      Identifier: function (node) {
        const { name } = node;

        if (!isServerComponent) {
          return;
        }

        if (isCustomHook) {
          return;
        }

        if (name === 'document' || name === 'window') {
          context.report({
            node,
            message: `Do not use browser APIs such as '${name}' in server component`,
          });
        }
      },
    };
  },
};