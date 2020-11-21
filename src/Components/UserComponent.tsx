import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { UserModel } from '../Models/UserModel';
import { observable, makeAutoObservable, action } from 'mobx';
import { Switch, Route, Redirect, Link } from 'react-router-dom';


@observer
class UserComponent extends Component {

    @observable
    model: UserModel = new UserModel();

    componentDidMount() {
        this.model.getallusers();
    }

    render() {
        return (

            <>

                <div>
                    <div className="row">
                        <div className="col-lg-12">
                        <h2>User<div style={{ float: "right" }}>
                             <Link className="btn btn-primary" to="/manageuser/0" >Add</Link>
                            </div></h2>
                            <br />
                            <table className="table table-bordered  table-hover">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Age</th>
                                        <th>Total Family Member</th>
                                        <th>Address</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                      
                                        this.model.records.map((x, i) => {
                                            return(
                                                <tr key={i}>
                                                <td>{x.name}</td>
                                                <td>{x.age}</td>
                                                <td>{x.nooffamilymember}</td>
                                                <td>{x.address}</td>
                                                <td>
                                                    <Link className="btn btn-success" to={"/manageuser/" + x.id} style={{ marginRight:"5px" }}>Edit</Link>

                                                    {/* <button className="btn btn-danger" onClick={() => this.DeleteUser(x.id)}>Delete</button> */}
                                                </td>
                                            </tr>
                                            )

                                    })}
                                </tbody>    
                            </table>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}


export default UserComponent;