import { observable, makeAutoObservable, action } from 'mobx';
import axios from 'axios';
import { markAsUntransferable } from 'worker_threads';

export class ManageuserModel {

    @observable userdetail: UserDetailModel;
    @observable tab: number;

    @observable manageFamilyModel_Request:ManageFamilyModel_Request;
    @observable getfamilylist_Model:Getfamilylist_Model[];

    @observable getusertasklist_Model:Getusertasklist_Model[];
    @observable addusertask_Model:Addusertask_Model;

    constructor() {
        makeAutoObservable(this);
        this.userdetail = new UserDetailModel();
        this.manageFamilyModel_Request = new ManageFamilyModel_Request();
        this.getfamilylist_Model = new  Array<Getfamilylist_Model>();
        this.getusertasklist_Model = new  Array<Getusertasklist_Model>();
        this.addusertask_Model = new Addusertask_Model();
        this.tab = 1;
    }


    @action
    GetUserDetail = (model: GetUserDetailModel_request):  Promise<any> => {

        return Promise.resolve(
        axios.post("http://localhost:3000/GetUserDetail", model).then((x) => {

            let obj = x.data as UserDetailModel;
            this.userdetail = obj;

        }).catch(x => { })
        );
    }

    @action
    manageuser = (model: UserDetailModel): Promise<any> => {
        model.latitude = this.userdetail.latitude;
        model.longitude = this.userdetail.longitude;
        return Promise.resolve(
            axios.post("http://localhost:3000/manageuser", model).then((x) => {
                return x.data;
            })
        );
    }

    @action
    managefamily = (model: ManageFamilyModel_Request): Promise<any> => {
        return Promise.resolve(
            axios.post("http://localhost:3000/managefamily", model).then((x) => {
                return x.data;
            })
        );
    }

    @action
    getfamilylist = (id: string): Promise<any> => {
        return Promise.resolve(
            axios.post("http://localhost:3000/getfamilylist", {id:id}).then((x) => {
                this.getfamilylist_Model = x.data;
            })
        );
    }

    @action
    getfamiltdetail = (id: string): Promise<any> => {
        return Promise.resolve(
            axios.post("http://localhost:3000/getfamiltdetail", {id:id}).then((x) => {
                this.manageFamilyModel_Request = x.data;
            })
        );
    }


    @action
    deletefamily = (id: string): Promise<any> => {
        return Promise.resolve(
            axios.post("http://localhost:3000/deletefamily", {id:id}).then((x) => {
                this.getfamilylist(this.userdetail.id);
            })
        );
    }

    @action
    getusertasklist = (id: string): Promise<any> => {
        return Promise.resolve(
            axios.post("http://localhost:3000/getusertasklist", {id:id}).then((x) => {
                this.getusertasklist_Model = x.data;
            })
        );
    }

    @action
    addusertask = (model: Addusertask_Model): Promise<any> => {
        return Promise.resolve(
            axios.post("http://localhost:3000/addusertask", model).then((x) => {
                this.getusertasklist(this.userdetail.id);
                this.addusertask_Model = new Addusertask_Model();
            })
        );
    }


    @action
    deleteusertask = (id: string): Promise<any> => {
        return Promise.resolve(
            axios.post("http://localhost:3000/deleteusertask", {id:id}).then((x) => {
                this.getusertasklist(this.userdetail.id);
            })
        );
    }

    @action
    ChangeTab(tab: number): void {
        this.tab = tab;
        if(this.tab == 2){

            this.getfamilylist(this.userdetail.id);
            this.manageFamilyModel_Request = new ManageFamilyModel_Request();
        }
        else if(this.tab == 3){

            this.getusertasklist(this.userdetail.id);
            this.addusertask_Model = new Addusertask_Model();
        }
    }
};


export class UserDetailModel {

    @observable id: string;
    @observable name: string;
    @observable age: number;
    @observable icon: string;
    @observable phone: string;
    @observable birthdate: string;
    @observable address: string;
    @observable latitude: number;
    @observable longitude: number;

    constructor() {
        makeAutoObservable(this);
        this.age = 0;
        this.icon = "";
        this.phone = "";
        this.name = "";
        this.id = "";
        this.birthdate = "";
        this.address = "";
        this.latitude = 0;
        this.longitude = 0;
    }


};


export class GetUserDetailModel_request {
    @observable id: string;

    constructor() {
        this.id = "";
    }
};


export class ManageFamilyModel_Request {
    @observable id: string;
    @observable name: string;
    @observable relation: string;
    @observable userid: string;
    @observable username: string;
    constructor() {

        makeAutoObservable(this);
        this.relation = "";
        this.username = "";
        this.userid = "";
        this.name = "";
        this.id = "";
    }
};




export class Getfamilylist_Model {

    @observable id: string;
    @observable name: string;
    @observable relation: string;
    @observable userid: string;
    @observable username: string;
    constructor() {
        makeAutoObservable(this);
        this.relation = "";
        this.username = "";
        this.userid = "";
        this.name = "";
        this.id = "";
    }
}


export class Getusertasklist_Model {

    @observable id: string;
    @observable task: string;
    @observable userid: string;
    @observable username: string;
    @observable datemodified: string;
    constructor() {
        makeAutoObservable(this);
        this.username = "";
        this.userid = "";
        this.task = "";
        this.id = "";
        this.datemodified = "";
    }
}

export class Addusertask_Model {

    @observable id: string;
    @observable userid: string;
    @observable username: string;
    @observable task: string;

    constructor() {
        makeAutoObservable(this);
        this.id = "";
        this.userid = "";
        this.task = "";
        this.username = "";
    }
}



