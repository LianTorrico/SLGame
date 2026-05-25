export default class Items {

    constructor(type, value) {
        this.type = type;
        this.value = value;
        var acquiredholy=false;
        var acquireddark=false;
        if (type=="Scroll"){
            //Nuove abilita
            console.log("Magic acquired");
            acquireddark=true; //Blocca a 1 solo tipo di magia
        }
    }
}