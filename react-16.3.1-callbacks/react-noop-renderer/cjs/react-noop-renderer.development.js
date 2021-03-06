/** @license React v16.3.1
 * react-noop-renderer.development.js
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const regeneratorRuntime = require("regenerator-runtime");

if (process.env.NODE_ENV !== "production") {
  (function() {
'use strict';

var _assign = require('object-assign');
var ReactFiberReconciler = require('react-reconciler');
var emptyObject = require('fbjs/lib/emptyObject');
var expect = require('expect');

/**
 * WARNING: DO NOT manually require this module.
 * This is a replacement for `invariant(...)` used by the error code system
 * and will _only_ be required by the corresponding babel pass.
 * It always throws.
 */

// Exports ReactDOM.createRoot


// Mutating mode (React DOM, React ART, React Native):

// Experimental noop mode (currently unused):

// Experimental persistent mode (Fabric):
var enablePersistentReconciler = false;
// Experimental error-boundary API that can recover from errors within a single
// render phase

// Helps identify side effects in begin-phase lifecycle hooks and setState reducers:


// In some cases, StrictMode should also double-render lifecycles.
// This can be confusing for tests though,
// And it can be bad for performance in production.
// This feature flag can be used to control the behavior:


// To preserve the "Pause on caught exceptions" behavior of the debugger, we
// replay the begin phase of a failed component inside invokeGuardedCallback.


// Warn about deprecated, async-unsafe lifecycles; relates to RFC #6:




// Only used in www builds.

/**
 * `ReactInstanceMap` maintains a mapping from a public facing stateful
 * instance (key) and the internal representation (value). This allows public
 * methods to accept the user facing instance as an argument and map them back
 * to internal methods.
 *
 * Note that this module is currently shared and assumed to be stateless.
 * If this becomes an actual Map, that will break.
 */

/**
 * This API should be called `delete` but we'd have to make sure to always
 * transform these to strings for IE support. When this transform is fully
 * supported we can rename it.
 */


function get(key) {
  return key._reactInternalFiber;
}

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol['for'];




var REACT_PORTAL_TYPE = hasSymbol ? Symbol['for']('react.portal') : 0xeaca;

function createPortal(children, containerInfo,
// TODO: figure out the API for cross-renderer implementation.
implementation) {
  var key = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  return {
    // This tag allow us to uniquely identify this as a React Portal
    $$typeof: REACT_PORTAL_TYPE,
    key: key == null ? null : '' + key,
    children: children,
    containerInfo: containerInfo,
    implementation: implementation
  };
}

var _marked = /*#__PURE__*/regeneratorRuntime.mark(flushUnitsOfWork);

var UPDATE_SIGNAL = {};

var scheduledCallback = null;

var instanceCounter = 0;
var failInBeginPhase = false;

function appendChild(parentInstance, child) {
  var index = parentInstance.children.indexOf(child);
  if (index !== -1) {
    parentInstance.children.splice(index, 1);
  }
  parentInstance.children.push(child);
}

function insertBefore(parentInstance, child, beforeChild) {
  var index = parentInstance.children.indexOf(child);
  if (index !== -1) {
    parentInstance.children.splice(index, 1);
  }
  var beforeIndex = parentInstance.children.indexOf(beforeChild);
  if (beforeIndex === -1) {
    throw new Error('This child does not exist.');
  }
  parentInstance.children.splice(beforeIndex, 0, child);
}

function removeChild(parentInstance, child) {
  var index = parentInstance.children.indexOf(child);
  if (index === -1) {
    throw new Error('This child does not exist.');
  }
  parentInstance.children.splice(index, 1);
}

var elapsedTimeInMs = 0;

var SharedHostConfig = {
  getRootHostContext: function () {
    if (failInBeginPhase) {
      throw new Error('Error in host config.');
    }
    return emptyObject;
  },
  getChildHostContext: function () {
    return emptyObject;
  },
  getPublicInstance: function (instance) {
    return instance;
  },
  createInstance: function (type, props) {
    var inst = {
      id: instanceCounter++,
      type: type,
      children: [],
      prop: props.prop
    };
    // Hide from unit tests
    Object.defineProperty(inst, 'id', { value: inst.id, enumerable: false });
    return inst;
  },
  appendInitialChild: function (parentInstance, child) {
    parentInstance.children.push(child);
  },
  finalizeInitialChildren: function (domElement, type, props) {
    return false;
  },
  prepareUpdate: function (instance, type, oldProps, newProps) {
    if (oldProps === null) {
      throw new Error('Should have old props');
    }
    if (newProps === null) {
      throw new Error('Should have old props');
    }
    return UPDATE_SIGNAL;
  },
  shouldSetTextContent: function (type, props) {
    return typeof props.children === 'string' || typeof props.children === 'number';
  },
  shouldDeprioritizeSubtree: function (type, props) {
    return !!props.hidden;
  },
  createTextInstance: function (text, rootContainerInstance, hostContext, internalInstanceHandle) {
    var inst = { text: text, id: instanceCounter++ };
    // Hide from unit tests
    Object.defineProperty(inst, 'id', { value: inst.id, enumerable: false });
    return inst;
  },
  scheduleDeferredCallback: function (callback) {
    if (scheduledCallback) {
      throw new Error('Scheduling a callback twice is excessive. Instead, keep track of ' + 'whether the callback has already been scheduled.');
    }
    scheduledCallback = callback;
    return 0;
  },
  cancelDeferredCallback: function () {
    if (scheduledCallback === null) {
      throw new Error('No callback is scheduled.');
    }
    scheduledCallback = null;
  },
  prepareForCommit: function () {},
  resetAfterCommit: function () {},
  now: function () {
    return elapsedTimeInMs;
  }
};

var NoopRenderer = ReactFiberReconciler(_assign({}, SharedHostConfig, {
  mutation: {
    commitMount: function (instance, type, newProps) {
      // Noop
    },
    commitUpdate: function (instance, updatePayload, type, oldProps, newProps) {
      if (oldProps === null) {
        throw new Error('Should have old props');
      }
      instance.prop = newProps.prop;
    },
    commitTextUpdate: function (textInstance, oldText, newText) {
      textInstance.text = newText;
    },


    appendChild: appendChild,
    appendChildToContainer: appendChild,
    insertBefore: insertBefore,
    insertInContainerBefore: insertBefore,
    removeChild: removeChild,
    removeChildFromContainer: removeChild,

    resetTextContent: function (instance) {}
  }
}));

var PersistentNoopRenderer = enablePersistentReconciler ? ReactFiberReconciler(_assign({}, SharedHostConfig, {
  persistence: {
    cloneInstance: function (instance, updatePayload, type, oldProps, newProps, internalInstanceHandle, keepChildren, recyclableInstance) {
      var clone = {
        id: instance.id,
        type: type,
        children: keepChildren ? instance.children : [],
        prop: newProps.prop
      };
      Object.defineProperty(clone, 'id', {
        value: clone.id,
        enumerable: false
      });
      return clone;
    },
    createContainerChildSet: function (container) {
      return [];
    },
    appendChildToContainerChildSet: function (childSet, child) {
      childSet.push(child);
    },
    finalizeContainerChildren: function (container, newChildren) {},
    replaceContainerChildren: function (container, newChildren) {
      container.children = newChildren;
    }
  }
})) : null;

var rootContainers = new Map();
var roots = new Map();
var persistentRoots = new Map();
var DEFAULT_ROOT_ID = '<default>';

var yieldedValues = null;

var unitsRemaining = void 0;

function flushUnitsOfWork(n) {
  var didStop, cb, values;
  return regeneratorRuntime.wrap(function flushUnitsOfWork$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          didStop = false;

        case 1:
          if (!(!didStop && scheduledCallback !== null)) {
            _context.next = 13;
            break;
          }

          cb = scheduledCallback;

          scheduledCallback = null;
          unitsRemaining = n;
          cb({
            timeRemaining: function () {
              if (yieldedValues !== null) {
                return 0;
              }
              if (unitsRemaining-- > 0) {
                return 999;
              }
              didStop = true;
              return 0;
            },

            // React's scheduler has its own way of keeping track of expired
            // work and doesn't read this, so don't bother setting it to the
            // correct value.
            didTimeout: false
          });

          if (!(yieldedValues !== null)) {
            _context.next = 11;
            break;
          }

          values = yieldedValues;

          yieldedValues = null;
          _context.next = 11;
          return values;

        case 11:
          _context.next = 1;
          break;

        case 13:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked, this);
}

var ReactNoop = {
  getChildren: function () {
    var rootID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_ROOT_ID;

    var container = rootContainers.get(rootID);
    if (container) {
      return container.children;
    } else {
      return null;
    }
  },
  createPortal: function (children, container) {
    var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    return createPortal(children, container, null, key);
  },


  // Shortcut for testing a single root
  render: function (element, callback) {
    ReactNoop.renderToRootWithID(element, DEFAULT_ROOT_ID, callback);
  },
  renderToRootWithID: function (element, rootID, callback) {
    var root = roots.get(rootID);
    if (!root) {
      var container = { rootID: rootID, children: [] };
      rootContainers.set(rootID, container);
      root = NoopRenderer.createContainer(container, true, false);
      roots.set(rootID, root);
    }
    NoopRenderer.updateContainer(element, root, null, callback);
  },
  renderToPersistentRootWithID: function (element, rootID, callback) {
    if (PersistentNoopRenderer === null) {
      throw new Error('Enable ReactFeatureFlags.enablePersistentReconciler to use it in tests.');
    }
    var root = persistentRoots.get(rootID);
    if (!root) {
      var container = { rootID: rootID, children: [] };
      rootContainers.set(rootID, container);
      root = PersistentNoopRenderer.createContainer(container, true, false);
      persistentRoots.set(rootID, root);
    }
    PersistentNoopRenderer.updateContainer(element, root, null, callback);
  },
  unmountRootWithID: function (rootID) {
    var root = roots.get(rootID);
    if (root) {
      NoopRenderer.updateContainer(null, root, null, function () {
        roots['delete'](rootID);
        rootContainers['delete'](rootID);
      });
    }
  },
  findInstance: function (componentOrElement) {
    if (componentOrElement == null) {
      return null;
    }
    // Unsound duck typing.
    var component = componentOrElement;
    if (typeof component.id === 'number') {
      return component;
    }
    var inst = get(component);
    return inst ? NoopRenderer.findHostInstance(inst) : null;
  },
  flushDeferredPri: function () {
    var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Infinity;

    // The legacy version of this function decremented the timeout before
    // returning the new time.
    // TODO: Convert tests to use flushUnitsOfWork or flushAndYield instead.
    var n = timeout / 5 - 1;

    var values = [];
    // eslint-disable-next-line no-for-of-loops/no-for-of-loops
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = flushUnitsOfWork(n)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var value = _step.value;

        values.push.apply(values, value);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return values;
  },
  flush: function () {
    return ReactNoop.flushUnitsOfWork(Infinity);
  },
  flushAndYield: function () {
    var unitsOfWork = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Infinity;

    return flushUnitsOfWork(unitsOfWork);
  },
  flushUnitsOfWork: function (n) {
    var values = yieldedValues || [];
    yieldedValues = null;
    // eslint-disable-next-line no-for-of-loops/no-for-of-loops
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = flushUnitsOfWork(n)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var value = _step2.value;

        values.push.apply(values, value);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
          _iterator2['return']();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return values;
  },
  flushThrough: function (expected) {
    var actual = [];
    if (expected.length !== 0) {
      // eslint-disable-next-line no-for-of-loops/no-for-of-loops
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = flushUnitsOfWork(Infinity)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var value = _step3.value;

          actual.push.apply(actual, value);
          if (actual.length >= expected.length) {
            break;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
            _iterator3['return']();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
    expect(actual).toEqual(expected);
  },
  expire: function (ms) {
    elapsedTimeInMs += ms;
  },
  flushExpired: function () {
    return ReactNoop.flushUnitsOfWork(0);
  },
  'yield': function (value) {
    if (yieldedValues === null) {
      yieldedValues = [value];
    } else {
      yieldedValues.push(value);
    }
  },
  clearYields: function () {
    var values = yieldedValues;
    yieldedValues = null;
    return values;
  },
  hasScheduledCallback: function () {
    return !!scheduledCallback;
  },


  batchedUpdates: NoopRenderer.batchedUpdates,

  deferredUpdates: NoopRenderer.deferredUpdates,

  unbatchedUpdates: NoopRenderer.unbatchedUpdates,

  interactiveUpdates: NoopRenderer.interactiveUpdates,

  flushSync: function (fn) {
    yieldedValues = [];
    NoopRenderer.flushSync(fn);
    return yieldedValues;
  },


  // Logs the current state of the tree.
  dumpTree: function () {
    var _console;

    var rootID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_ROOT_ID;

    var root = roots.get(rootID);
    var rootContainer = rootContainers.get(rootID);
    if (!root || !rootContainer) {
      console.log('Nothing rendered yet.');
      return;
    }

    var bufferedLog = [];
    function log() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      bufferedLog.push.apply(bufferedLog, args.concat(['\n']));
    }

    function logHostInstances(children, depth) {
      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        var indent = '  '.repeat(depth);
        if (typeof child.text === 'string') {
          log(indent + '- ' + child.text);
        } else {
          // $FlowFixMe - The child should've been refined now.
          log(indent + '- ' + child.type + '#' + child.id);
          // $FlowFixMe - The child should've been refined now.
          logHostInstances(child.children, depth + 1);
        }
      }
    }
    function logContainer(container, depth) {
      log('  '.repeat(depth) + '- [root#' + container.rootID + ']');
      logHostInstances(container.children, depth + 1);
    }

    function logUpdateQueue(updateQueue, depth) {
      log('  '.repeat(depth + 1) + 'QUEUED UPDATES');
      var firstUpdate = updateQueue.first;
      if (!firstUpdate) {
        return;
      }

      log('  '.repeat(depth + 1) + '~', firstUpdate && firstUpdate.partialState, firstUpdate.callback ? 'with callback' : '', '[' + firstUpdate.expirationTime + ']');
      var next = void 0;
      while (next = firstUpdate.next) {
        log('  '.repeat(depth + 1) + '~', next.partialState, next.callback ? 'with callback' : '', '[' + firstUpdate.expirationTime + ']');
      }
    }

    function logFiber(fiber, depth) {
      log('  '.repeat(depth) + '- ' + (
      // need to explicitly coerce Symbol to a string
      fiber.type ? fiber.type.name || fiber.type.toString() : '[root]'), '[' + fiber.expirationTime + (fiber.pendingProps ? '*' : '') + ']');
      if (fiber.updateQueue) {
        logUpdateQueue(fiber.updateQueue, depth);
      }
      // const childInProgress = fiber.progressedChild;
      // if (childInProgress && childInProgress !== fiber.child) {
      //   log(
      //     '  '.repeat(depth + 1) + 'IN PROGRESS: ' + fiber.pendingWorkPriority,
      //   );
      //   logFiber(childInProgress, depth + 1);
      //   if (fiber.child) {
      //     log('  '.repeat(depth + 1) + 'CURRENT');
      //   }
      // } else if (fiber.child && fiber.updateQueue) {
      //   log('  '.repeat(depth + 1) + 'CHILDREN');
      // }
      if (fiber.child) {
        logFiber(fiber.child, depth + 1);
      }
      if (fiber.sibling) {
        logFiber(fiber.sibling, depth);
      }
    }

    log('HOST INSTANCES:');
    logContainer(rootContainer, 0);
    log('FIBERS:');
    logFiber(root.current, 0);

    (_console = console).log.apply(_console, bufferedLog);
  },
  simulateErrorInHostConfig: function (fn) {
    failInBeginPhase = true;
    try {
      fn();
    } finally {
      failInBeginPhase = false;
    }
  }
};



var ReactNoop$2 = Object.freeze({
	default: ReactNoop
});

var ReactNoop$3 = ( ReactNoop$2 && ReactNoop ) || ReactNoop$2;

// TODO: decide on the top-level export form.
// This is hacky but makes it work with both Rollup and Jest.
var reactNoopRenderer = ReactNoop$3['default'] ? ReactNoop$3['default'] : ReactNoop$3;

module.exports = reactNoopRenderer;
  })();
}
