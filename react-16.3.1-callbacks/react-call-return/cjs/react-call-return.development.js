/** @license React v16.3.1
 * react-call-return.development.js
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';



if (process.env.NODE_ENV !== "production") {
  (function() {
'use strict';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol['for'];

var REACT_ELEMENT_TYPE = hasSymbol ? Symbol['for']('react.element') : 0xeac7;
var REACT_CALL_TYPE = hasSymbol ? Symbol['for']('react.call') : 0xeac8;
var REACT_RETURN_TYPE = hasSymbol ? Symbol['for']('react.return') : 0xeac9;

function unstable_createCall(children, handler, props) {
  var key = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  var call = {
    // This tag allow us to uniquely identify this as a React Call
    $$typeof: REACT_ELEMENT_TYPE,
    type: REACT_CALL_TYPE,
    key: key == null ? null : '' + key,
    ref: null,
    props: {
      props: props,
      handler: handler,
      children: children
    }
  };

  {
    // TODO: Add _store property for marking this as validated.
    if (Object.freeze) {
      Object.freeze(call.props);
      Object.freeze(call);
    }
  }

  return call;
}

function unstable_createReturn(value) {
  var returnNode = {
    // This tag allow us to uniquely identify this as a React Call
    $$typeof: REACT_ELEMENT_TYPE,
    type: REACT_RETURN_TYPE,
    key: null,
    ref: null,
    props: {
      value: value
    }
  };

  {
    // TODO: Add _store property for marking this as validated.
    if (Object.freeze) {
      Object.freeze(returnNode);
    }
  }

  return returnNode;
}

/**
 * Verifies the object is a call object.
 */
function unstable_isCall(object) {
  return typeof object === 'object' && object !== null && object.type === REACT_CALL_TYPE;
}

/**
 * Verifies the object is a return object.
 */
function unstable_isReturn(object) {
  return typeof object === 'object' && object !== null && object.type === REACT_RETURN_TYPE;
}

var unstable_REACT_RETURN_TYPE = REACT_RETURN_TYPE;
var unstable_REACT_CALL_TYPE = REACT_CALL_TYPE;

var ReactCallReturn = Object.freeze({
	unstable_createCall: unstable_createCall,
	unstable_createReturn: unstable_createReturn,
	unstable_isCall: unstable_isCall,
	unstable_isReturn: unstable_isReturn,
	unstable_REACT_RETURN_TYPE: unstable_REACT_RETURN_TYPE,
	unstable_REACT_CALL_TYPE: unstable_REACT_CALL_TYPE
});

var reactCallReturn = ReactCallReturn;

module.exports = reactCallReturn;
  })();
}
