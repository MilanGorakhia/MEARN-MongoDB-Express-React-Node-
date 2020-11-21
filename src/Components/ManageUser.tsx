import React, { Component, Fragment, useRef } from 'react';
import { Formik, Field, Form, FormikHelpers} from 'formik';
import { RouteComponentProps, Link } from 'react-router-dom';
import { ManageuserModel,UserDetailModel, GetUserDetailModel_request, ManageFamilyModel_Request, Addusertask_Model } from '../Models/ManageuserModel'
import 'daterangepicker/daterangepicker.css';
import 'daterangepicker/daterangepicker.js';
import { DateRangePicker } from 'daterangepicker';
import moment from 'moment';
import { observable, makeAutoObservable, action } from 'mobx';
import { observer } from 'mobx-react';
import  $ from 'jquery';
import * as yup from 'yup';
import { textSpanIntersectsWithTextSpan } from 'typescript';
declare const google: any;

var formRef:any;
var placeSearch:any;
var autocomplete:any;
var componentForm:any = {
  //street_number: 'short_name',
  //route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

let validationschema = yup.object().shape({
    name: yup.string().required(),
    phone: yup.string().required(),
    age: yup.number().required(),
    birthdate: yup.string().required()
});

let familyvalidationschema = yup.object().shape({
    name: yup.string().required(),
    relation: yup.string().required()
});

let taskvalidationschema = yup.object().shape({
    task: yup.string().required(),
});

@observer
class ManageUserComponent extends Component<RouteComponentProps>{

    @observable
    model = new ManageuserModel();
    componentDidMount() {
        let model: GetUserDetailModel_request = this.props.match.params as GetUserDetailModel_request;
        if (model.id != "0" && model.id != "" && model.id != undefined && model.id != null) {
            this.model.GetUserDetail(model).then((x)=>{
                this.initAutocomplete();
                this.ShowLocationonMap(this.model.userdetail.latitude,this.model.userdetail.longitude,15);

            });
            
        }
        else {
            this.model.userdetail = new UserDetailModel();
            this.initAutocomplete();
            this.ShowLocationonMap(this.model.userdetail.latitude,this.model.userdetail.longitude,5);
        }
     
    }


    
  initAutocomplete() {
    // Create the autocomplete object, restricting the search predictions to
    // geographical location types.
    autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('address'), { componentRestrictions: { country: "US" } });

    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    // autocomplete.setFields(['address_component']);

    // When the user selects an address from the drop-down, populate the
    // address fields in the form.
    autocomplete.addListener('place_changed', this.fillInAddress);
  }

  fillInAddress = () => {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();

    formRef.setFieldValue("address", place.formatted_address);
    for (var i = 0; i < place.address_components.length; i++) {
      var addressType = place.address_components[i].types[0];
      if (componentForm[addressType]) {
        var val = place.address_components[i][componentForm[addressType]];
        if (addressType == "locality") {
          $("#locality").val(val);
        }
        if (addressType == "postal_code") {
          $("#postal_code").val(val);

        }
        if (addressType == "administrative_area_level_1") {
          $("#administrative_area_level_1").val(val);
        }
      }
    }
    $("#latitude").val(place.geometry.location.lat());
    $("#longitude").val(place.geometry.location.lng());
    this.model.userdetail.latitude = place.geometry.location.lat();
    this.model.userdetail.longitude = place.geometry.location.lng();
    this.ShowLocationonMap(place.geometry.location.lat(), place.geometry.location.lng(), 15);
    this.SetAddressvalues(null);
  }

  geolocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        //var circle = new google.maps.Circle(
        //  { center: geolocation, radius: position.coords.accuracy });
        //autocomplete.setBounds(circle.getBounds());
      });
    }

  }

  ShowLocationonMap(lat: number, lng: number, zoom: number) {
    var myLatLng = { lat: lat, lng: lng };
    var map = new google.maps.Map(document.getElementById('map'), {
      center: myLatLng,
      zoom: zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });
    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
    });
    // Get Address from Lat/Lan
    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;
    geocoder.geocode({ 'location': myLatLng }, function (results:any, status:any) {
      if (status === 'OK') {
        infowindow.setContent(results[1].formatted_address);
        infowindow.open(map, marker);
      } else {
      }
    });
    $(window).resize(function () {
      google.maps.event.trigger(map, "resize");
    });
  }

  SetAddressvalues(formikprops:any) {
      this.model.userdetail.address = $("#address").val() as string;
    // this.model.city = $("#locality").val();
    // this.model.state = $("#administrative_area_level_1").val();
    // this.model.zipcode = $("#postal_code").val();
    // this.model.lat = $("#latitude").val();
    // this.model.lng = $("#longitude").val();
  }

  componentDidUpdate(){

    console.log('fired')
    if(this.model.tab == 1){
        this.ShowLocationonMap(this.model.userdetail.latitude,this.model.userdetail.longitude,15);

    }
  }

  ChangeTab(tab:number){
    this.model.ChangeTab(tab);
  }


    render() {
       
       
        return (
            <>
                <div className="container">

                    <div className="container">
                        <div className="">
                            <div className="col-lg-12">
                                <h4>User Detail
                                <div style={{ float: "right" }}>
                                    <Link className="btn btn-primary" to="/users" > {"Back"}</Link>
                                    </div>

                                </h4>
                                <br />
                                <ul className="nav nav-tabs">
                                    { this.model.userdetail.id != "" ?
                                    (
                                        <Fragment>
                                    <li className="nav-item" >
                                        <a className={this.model.tab == 1 ? "nav-link active" : "nav-link"} href="#" onClick={() => this.ChangeTab(1)} >Detail</a>
                                    </li>
                                    <li className="nav-item" >
                                        <a className={this.model.tab == 2 ? "nav-link active" : "nav-link"} href="#" onClick={() => this.ChangeTab(2)}>Family</a>
                                    </li>
                                    <li className="nav-item" >
                                        <a className={this.model.tab == 3 ? "nav-link active" : "nav-link"} href="#" onClick={() => this.ChangeTab(3)}>Task</a>
                                    </li>
                                    </Fragment>
                                   ):""}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {this.model.tab == 1 ? (
                       
                        <>
                        <br></br>
                        <div className="card img-fluid" style={{ margin: "auto", width: "300px",float:"left" }}>
                            <img className="card-img-top" src="https://www.w3schools.com/bootstrap4/img_avatar1.png" alt="Card image" />
                            </div>

                            <div className="card img-fluid" style={{ margin: "auto", width: "650px",float:"left",marginLeft:"50px" }}>
                            <div className="card-body">
                                <h4 className="card-title">User Detail</h4>

                                <Formik
                                    validationSchema={validationschema}
                                    enableReinitialize={true}
                                    initialValues={this.model.userdetail}
                                        onSubmit={(values, action) => {
                                            this.model.manageuser(values).then((x) => {
                                                this.props.history.push('/Users');
                                            })

                                            }}

                                        render={(props) => {

                                            formRef = props;
                                            $('#birthdate').daterangepicker({
                                                singleDatePicker: true,
                                                showDropdowns: true,
                                                autoApply:true,
                                                minYear: 2020
                                            }, function (start, end, label) {
                                                    props.setFieldValue('birthdate', moment(start).format("MM/DD/YYYY"));
                                            });
                                        return (
                                            <Form id="notes-form">
                                                <div className="form-group">
                                                    <label >Name:</label>
                                                    <Field component="input"
                                                        name="name"
                                                        id="name"
                                                        value={props.values.name == null ? "" : props.values.name}
                                                        placeholder="name"
                                                        className="form-control"
                                                    ></Field>
                                                </div>
                                                <div className="form-group">
                                                    <label >Phone:</label>
                                                    <Field component="input"
                                                        name="phone"
                                                        id="phone"
                                                        value={props.values.phone == null ? "" : props.values.phone}
                                                        placeholder="phone"
                                                        className="form-control"
                                                    ></Field>
                                                </div>

                                                <div className="form-group">
                                                    <label >Age:</label>
                                                    <Field component="input"
                                                        name="age"
                                                        id="age"
                                                        value={props.values.age == null ? "" : props.values.age}
                                                        placeholder="Age"
                                                        className="form-control"
                                                    ></Field>
                                                </div>
                                                <div className="form-group">
                                                    <label >Birthdate:</label>
                                                    <Field component="input"
                                                        name="birthdate"
                                                        id="birthdate"
                                                        value={props.values.birthdate == null ? "" : props.values.birthdate}
                                                        placeholder="birthdate"
                                                        className="form-control"
                                                        autoComplete="off"
                                                        
                                                    ></Field>
                                                </div>
                                                

                                                <div className="form-group">
                                                    <label >Address:</label>
                                                    <Field component="input"
                                                        name="address"
                                                        id="address"
                                                        value={props.values.address == null ? "" : props.values.address}
                                                        placeholder="enter address"
                                                        className="form-control"
                                                        autoComplete="off"
                                                        onChange={(e:any) => {
                                                              props.setFieldValue("address", e.target.value);
                                                        }}
                                                    ></Field>
                                                    <br></br>
                                                <div id="map" className="map-box" style={{"height":"400px"}}></div>
                                                </div>

                                                <button type="submit" title="Add Employee" disabled={!props.isValid} className="btn btn-primary btn-block" >Save</button>
                                            </Form>
                                        )
                                    }
                                    }
                                ></Formik>



                            </div>
                            </div>
                           
                        </>
                    ) :  ( this.model.tab == 2) ? (
                            <>
                                <br></br>
                                
                            <div className="card img-fluid" style={{ float: "left", width: "300px", marginRight: "20px" }}>
                                <img className="card-img-top" src="https://www.w3schools.com/bootstrap4/img_avatar1.png" alt="Card image" />
                                <div className="card-body">
                                    <h4 className="card-title">Family Detail</h4>

                                    <Formik
                                        validationSchema={familyvalidationschema}
                                        enableReinitialize={true}
                                            initialValues={this.model.manageFamilyModel_Request}
                                            onSubmit={(values: ManageFamilyModel_Request, action: any) => {
                                            values.userid = this.model.userdetail.id;
                                            values.username = this.model.userdetail.name;
                                            this.model.managefamily(values).then((x: any) => {

                                                action.resetForm({
                                                    values: new ManageFamilyModel_Request()
                                                })

                                                this.model.getfamilylist(this.model.userdetail.id);
                                            });
                                        }}

                                        
                                    >
                                        {(props) => {
                                            return (
                                                <Form id="notes-form">
                                                    <div className="form-group">
                                                        <label >Name:</label>
                                                        <Field component="input"
                                                            name="name"
                                                            id="name"
                                                            value={props.values.name == null ? "" : props.values.name}
                                                            placeholder="name"
                                                            className="form-control"
                                                        ></Field>
                                                    </div>
                                                    <div className="form-group">
                                                        <label >Relation:</label>
                                                        <Field component="select" name="relation" id="relation" className="form-control">
                                                            <option value="">Select Relation</option>
                                                            <option value="Other">Other</option>
                                                            <option value="Brother">Brother</option>
                                                            <option value="Sister">Sister</option>
                                                            <option value="Father">Father</option>
                                                            <option value="Mother">Mother</option>
                                                            <option value="Wife">Wife</option>
                                                            <option value="Husband">Husband</option>
                                                        </Field>
                                                    </div>
                                                    <button type="submit" title="Add Family" disabled={!props.isValid} className="btn btn-primary btn-block" >Save</button>
                                                </Form>
                                            )
                                        }
                                        }
                                    </Formik>



                                </div>
                            </div>

                            <div style={{ float: "right", width: "500px", marginRight: "20px" }}>
                                <br></br>
                                <table className="table table-bordered  table-hover">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Relation</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.model.getfamilylist_Model.map((x, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>{x.name}</td>
                                                        <td>{x.relation}</td>
                                                        <td>
                                                            <button className="btn btn-success" onClick={() => { this.model.getfamiltdetail(x.id) }} style={{ marginRight: "5px" }}>Edit</button>
                                                            <button className="btn btn-danger" onClick={() => { this.model.deletefamily(x.id) }}>Delete</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : ( this.model.tab == 3) ? (
                        <>
                            <div className="row">
                                <br></br>
                                <div className="col-lg-12">

                                    <Formik
                                        validationSchema={taskvalidationschema}
                                        enableReinitialize={true}
                                        initialValues={this.model.addusertask_Model}
                                        onSubmit={(values: Addusertask_Model, action: any) => {
                                            values.userid = this.model.userdetail.id;
                                            values.username = this.model.userdetail.name;
                                            this.model.addusertask(values).then((x: any) => {
                                                action.resetForm({
                                                    values:  this.model.addusertask_Model
                                                });
                                            });
                                        }}

                                        render={(props) => {
                                            return (
                                                <Form id="notes-form">
                                                    <div className="form-group">
                                                        <div className="row">
                                                        <div className="col-lg-8">
                                                                <label style={{ "width": "100%" }}></label>
                                                            <Field component="input"
                                                                name="task"
                                                                id="task"
                                                                value={props.values.task == null ? "" : props.values.task}
                                                                placeholder="add your task here..."
                                                                className="form-control"
                                                            ></Field>
                                                        </div>
                                                            <div className="col-lg-4">
                                                                <label style={{"width":"100%"}}></label>
                                                            <button type="submit" title="Add Family" disabled={!props.isValid} className="btn btn-primary btn-block" >Add</button>
                                                        </div>
                                                        </div>
                                                    </div>

                                                </Form>
                                            )
                                        }
                                        }
                                    ></Formik>

                                </div>
                                        <br></br>
                                        <br></br>
                                        <div className="col-lg-12">
                                            <hr></hr>
                                    <ul className="list-group">
                                        <li className="list-group-item active">Tasks</li>
                                        {this.model.getusertasklist_Model.map((x, i) => {
                                            return (
                                                <li className="list-group-item d-flex justify-content-between align-items-center" key={x.id}>{x.task}
                                                    <span className="badge badge-danger badge-pill" style={{ "cursor": "pointer",lineHeight:"1.4" }} onClick={() => { this.model.deleteusertask(x.id) }}>x</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </>
                    ) : ""}

                </div>
            </>
        );
    }
}

export default ManageUserComponent;