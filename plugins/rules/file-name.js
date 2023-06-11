export const fileNameRules = {
  meta: {
    type: 'problem',
    fixable: true,
  },
  create: (context) => {
    let isServerComponent = false;
    let isCustomHook = false;

    return {
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

        if (isServerComponent && !isCustomHook) {
          const fileName = context.getFilename();
          const { options } = context;
          const option = options.find((opt) => 'middle' in opt);
          const middle = option.middle;

          if (fileName.includes('tsx') && !fileName.endsWith(`index.${middle}.tsx`)) {
            const suggestedFileName = fileName.replace(/\.tsx$/, `.${middle}.tsx`);

            context.report({
              node,
              message: `server component's file name should be '${suggestedFileName}'`,
            });
          }
        }
      },
    };
  },
};