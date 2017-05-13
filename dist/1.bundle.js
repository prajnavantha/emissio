webpackJsonp([1],{

/***/ 92:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var React = __webpack_require__(53);
var ReactDOM = __webpack_require__(52);

module.exports = function () {
    return React.createElement(
        'div',
        { className: 'form-container' },
        React.createElement(
            'div',
            { className: 'wrapper' },
            React.createElement(
                'form',
                { className: 'form-signin' },
                React.createElement(
                    'h2',
                    { className: 'form-signin-heading text-center' },
                    'Emissio'
                ),
                React.createElement('br', null),
                React.createElement(
                    'a',
                    { href: '/login/facebook', className: 'btn btn-lg btn-primary btn-block fb-submit', type: 'submit' },
                    React.createElement('i', { className: 'fa fa-facebook-official', style: { marginRight: '5px' } }),
                    'Log in with Facebook'
                )
            )
        )
    );
};

/***/ })

});