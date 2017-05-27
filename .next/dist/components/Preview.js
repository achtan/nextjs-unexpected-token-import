"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault2(_react);

function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", {
        value: true
});
var _jsxFileName = "/Users/admin/sites/staffino/email-wizard/components/Preview.js";


var _reactIframe = require("react-iframe");

var _reactIframe2 = _interopRequireDefault(_reactIframe);

function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = function () {
        return _react2.default.createElement(_reactIframe2.default, { url: "/static/emails/index.html",
                display: "initial",
                position: "relative",
                allowFullScreen: true, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 5
                }
        });
};