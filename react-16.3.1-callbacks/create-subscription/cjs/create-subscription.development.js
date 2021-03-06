/** @license React v16.3.1
 * create-subscription.development.js
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

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

/**
 * WARNING: DO NOT manually require this module.
 * This is a replacement for `invariant(...)` used by the error code system
 * and will _only_ be required by the corresponding babel pass.
 * It always throws.
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function createSubscription(config) {
  var getCurrentValue = config.getCurrentValue,
      _subscribe = config.subscribe;


  warning(typeof getCurrentValue === 'function', 'Subscription must specify a getCurrentValue function');
  warning(typeof _subscribe === 'function', 'Subscription must specify a subscribe function');

  // Reference: https://gist.github.com/bvaughn/d569177d70b50b58bff69c3c4a5353f3
  var Subscription = function (_React$Component) {
    _inherits(Subscription, _React$Component);

    function Subscription() {
      var _temp, _this, _ret;

      _classCallCheck(this, Subscription);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
        source: _this.props.source,
        value: _this.props.source != null ? getCurrentValue(_this.props.source) : undefined
      }, _this._hasUnmounted = false, _this._unsubscribe = null, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Subscription.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.source !== prevState.source) {
        return {
          source: nextProps.source,
          value: nextProps.source != null ? getCurrentValue(nextProps.source) : undefined
        };
      }

      return null;
    };

    Subscription.prototype.componentDidMount = function componentDidMount() {
      this.subscribe();
    };

    Subscription.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
      if (this.state.source !== prevState.source) {
        this.unsubscribe(prevState);
        this.subscribe();
      }
    };

    Subscription.prototype.componentWillUnmount = function componentWillUnmount() {
      this.unsubscribe(this.state);

      // Track mounted to avoid calling setState after unmounting
      // For source like Promises that can't be unsubscribed from.
      this._hasUnmounted = true;
    };

    Subscription.prototype.render = function render() {
      return this.props.children(this.state.value);
    };

    Subscription.prototype.subscribe = function subscribe() {
      var _this2 = this;

      var source = this.state.source;

      if (source != null) {
        var _callback = function (value) {
          if (_this2._hasUnmounted) {
            return;
          }

          _this2.setState(function (state) {
            // If the value is the same, skip the unnecessary state update.
            if (value === state.value) {
              return null;
            }

            // If this event belongs to an old or uncommitted data source, ignore it.
            if (source !== state.source) {
              return null;
            }

            return { value: value };
          });
        };

        // Store the unsubscribe method for later (in case the subscribable prop changes).
        var unsubscribe = _subscribe(source, _callback);
        !(typeof unsubscribe === 'function') ? invariant(false, 'A subscription must return an unsubscribe function.') : void 0;

        // It's safe to store unsubscribe on the instance because
        // We only read or write that property during the "commit" phase.
        this._unsubscribe = unsubscribe;

        // External values could change between render and mount,
        // In some cases it may be important to handle this case.
        var _value = getCurrentValue(this.props.source);
        if (_value !== this.state.value) {
          this.setState({ value: _value });
        }
      }
    };

    Subscription.prototype.unsubscribe = function unsubscribe(state) {
      if (typeof this._unsubscribe === 'function') {
        this._unsubscribe();
      }
      this._unsubscribe = null;
    };

    return Subscription;
  }(React.Component);

  return Subscription;
}

exports.createSubscription = createSubscription;
  })();
}
