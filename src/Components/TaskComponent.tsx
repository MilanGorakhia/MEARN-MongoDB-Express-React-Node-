import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { UserModel } from '../Models/UserModel';
import { observable, makeAutoObservable, action } from 'mobx';
import { Switch, Route, Redirect, Link } from 'react-router-dom';


@observer
class UserComponent extends Component {

    componentDidMount() {
    }

    render() {
        return (

            <>

                <div>
                    <div className="row">
                        <div className="col-lg-12">
                            <h2>Task<div style={{ float: "right" }}></div></h2>
                            <br />
                        </div>
                    </div>
                </div>
            </>
        )
    }
}


export default UserComponent;