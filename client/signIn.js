'use strict';
var  React = require('react');
var ReactDOM = require('react-dom');


module.exports =()=> (
        <div className="form-container">
            <div className="wrapper">
                <form className="form-signin">
                <h2 className="form-signin-heading text-center">Emissio</h2>
                <br/>
                <a href="/login/facebook" className="btn btn-lg btn-primary btn-block fb-submit" type="submit">
                    <i className="fa fa-facebook-official" style={{marginRight:'5px'}} ></i>

                    Log in with Facebook
                </a>
                </form>
            </div>
        </div>

        )
