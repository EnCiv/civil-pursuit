'use strict';

// the line below will be replace with the auto generated table of components from the referenced directories
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
const Components={
	 'Join':	require('./../../node_modules/civil-server/dist/web-components/join'),
	 'ResetPassword':	require('./../../node_modules/civil-server/dist/web-components/reset-password'),
	 'UnknownWebComponent':	require('./../../node_modules/civil-server/dist/web-components/unknown-web-component'),

}
;
/**
 * The main source of the following code is in github.com/EnCiv/civil-server/app/components/web-components-template.js
 * do not edit it in any other repo - it will get clobbered by the next build.
 *
 */

function WebComponents(props) {
  const objOrStr = props.webComponent;
  var WebComponentClass;
  var newProps = {};
  if (typeof objOrStr === 'object') {
    Object.assign(newProps, props, objOrStr);
    WebComponentClass = Components[objOrStr.webComponent];
  } else {
    // string
    Object.assign(newProps, props);
    WebComponentClass = Components[objOrStr];
  }
  if (typeof WebComponentClass === 'undefined') {
    logger.error('WebComponent not defined:', objOrStr);
    if (Components.UnknownWebComponent) {
      WebComponentClass = Components.UnknownWebComponent;
      if (WebComponentClass.default)
        // commonJS module or require
        WebComponentClass = WebComponentClass.default;
      // includes newProps.webComponent so it can be seen
      return /*#__PURE__*/_react.default.createElement(WebComponentClass, newProps);
    } else return 'Unknown Web Component: ' + JSON.stringify(objOrStr);
  }
  if (WebComponentClass.default)
    // commonJS module or require
    WebComponentClass = WebComponentClass.default;
  delete newProps.webComponent;
  return /*#__PURE__*/_react.default.createElement(WebComponentClass, newProps);
}
var _default = exports.default = WebComponents;
//# sourceMappingURL=web-components-template.js.map