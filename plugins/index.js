module.exports = {
  rules: {
    'file-name': {
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
    },
    'no-import-use-client': {
      meta: {
        type: 'problem',
        fixable: true,
        docs: {
          url: 'https://nextjs.org/docs/getting-started/react-essentials#nesting-server-components-inside-client-components',
        },
      },
      create: (context) => {
        let isServerComponent = true;
        let isCustomHook = false;
        let isRouteHandler = false;
        // jsx, tsx
    
        return {
          Program: function (node) {
            const sourceCode = context.getSourceCode().getText(node);
            const filename = context.getFilename();
            const extension = filename.substring(filename.lastIndexOf('.') + 1);
    
            if (filename.includes('app/api')) {
              isRouteHandler = true;
            }
    
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
    
          ImportDeclaration: function (node) {
            if (isServerComponent || isRouteHandler) {
              return;
            }
    
            if (isCustomHook) {
              return;
            }
    
            const importedComponent = node.source.value;
            const importSourceCode = context.getSourceCode().getText(node);
    
            if (!importSourceCode.includes('/') || !importSourceCode.includes('from')) {
              // 외부 라이브러리 bye bye
              return;
            }
    
            const { options } = context;
            const option = options.find((opt) => 'middle' in opt);
            const middle = option.middle;
    
            if (importSourceCode.split('from')[1].split('/').at(-1).includes(middle)) {
              context.report({
                node,
                message: `Can't import server component in client component (${importedComponent})`,
              });
            }
          },
        };
      },
    },
    'no-use-react-hook': {
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
    },
    'no-use-browser-api': {
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
          JSXAttribute: function (node) {
            const attributeName = node.name.name;
    
            if (attributeName.startsWith('on') && isServerComponent && !isCustomHook) {
              context.report({
                node,
                message: `Can't use ${attributeName} in server component`,
              });
            }
          },
        };
      },
    },
    'no-use-event-handler': {
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
          CallExpression: function (node) {
            if (node.callee.type === 'Identifier') {
              const { name } = node.callee;
    
              if (name.match(/^use[A-Z]/) && isServerComponent && !isCustomHook) {
                context.report({
                  node,
                  message: `Do not use ${name} hook inside JSX files in server component`,
                });
              }
            }
          },
        };
      },
    },
  },
};
