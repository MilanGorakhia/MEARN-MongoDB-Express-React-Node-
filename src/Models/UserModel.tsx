import { observable, makeAutoObservable, action } from 'mobx';
import axios from 'axios';
import { markAsUntransferable } from 'worker_threads';


export class getallusersModel {

    
    @observable id: string | undefined;
    @observable name: string | undefined;
    @observable age: number | undefined;
    @observable icon: string | undefined;
    @observable nooffamilymember: number | undefined;
    @observable address: string | undefined;
    

    constructor() {
        makeAutoObservable(this);
    }

}

export class UserModel {

    @observable
    records: getallusersModel[];

    constructor() {
        makeAutoObservable(this);
        this.records = new Array<getallusersModel>();
    }

    @action
    getallusers(): void {
        axios.post("http://localhost:3000/getallusers", null).then((x: any) => {
            this.records = x.data;
        }).catch();
    }
}

