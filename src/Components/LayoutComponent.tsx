import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import UserComponent from './UserComponent';
import TaskComponent from './TaskComponent';
import ManageUserComponent from './ManageUser';



class LayoutComponent extends React.Component {


    render() {

        return (
            <>
                <Switch>
                    <Route path="/" exact component={UserComponent}></Route>
                    <Route path="/users" exact component={UserComponent}></Route>
                    <Route path="/tasks" exact component={TaskComponent}></Route>
                    <Route path="/manageuser/:id" exact component={ManageUserComponent}></Route>
                    {/* <Route path="/manageemployee/:id" exact component={ManageEmployeeComponent}></Route>
                    <Route path="/managedesignation/:id" exact component={ManageDesignationComponent}></Route>
                    <Route path="/managehobby/:id" exact component={ManageHobbyComponent}></Route> */}
                    <Route path="*" render={() => {
                        return (<Redirect to="/users"></Redirect>)
                    }}></Route>
                </Switch>
            </>
        );
    }
}


export default LayoutComponent;