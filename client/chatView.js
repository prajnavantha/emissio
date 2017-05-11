'use strict';
var  React = require('react');
var ReactDOM = require('react-dom');


module.exports =()=>  (
            <div className="container full-height">
                <div className="row full-height">
                    <div className="col-md-8 full-height flexDisplay flex-direction-column">
                        <div style={{height:'50px'}}>ChatApp</div>
                        <div className="flex-full relativePosition flex-direction-column">
                            <div className="full-container-layout">
                                <div style={{height:'80%'}}></div>
                                <div className="flex-full" >SOmething here</div>
                            </div>


                        </div>
                    </div>
                    <div className="col-md-4 full-height flexDisplay flex-direction-column" >
                        <div style={{height:'50px'}}>Users</div>
                        <div className="flex-full relativePosition flex-direction-column">
                            <div className="full-container-layout">
                                <div style={{height:'80%'}}>All logins</div>
                            </div>


                        </div>



                    </div>

                </div>
            </div>

        )
