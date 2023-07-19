const  fileNameRules  = require("./rules/file-name");
const  noImportUseClientRules  = require("./rules/no-import-use-client");
const  noUserBrowserApi  = require("./rules/no-use-browser-api");
const  noUseEventHandler  = require("./rules/no-use-event-handler");
const  noUseReactHook  = require("./rules/no-use-react-hook");

module.exports = {
  rules: {
    'file-name': {...fileNameRules},
    'no-import-use-client': {...noImportUseClientRules},
    'no-use-react-hook': {...noUserBrowserApi},
    'no-use-browser-api': {...noUseEventHandler},
    'no-use-event-handler': {...noUseReactHook},
  },
};
