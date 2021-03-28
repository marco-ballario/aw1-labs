'use strict';
const dayjs = require('dayjs');

function Task(id, description, optionals){
    this.id = id;
    this.description = description;
    this.urgent = optionals.urgent ? optionals.urgent : false;
    this.private = optionals.private ? optionals.private : true;
    this.deadline = optionals.deadline ? optionals.deadline : null;
}

function TaskList(){
    this.list = [];

    this.sortAndPrint = function(){

        this.list.sort(function(a, b){
            if(!a.deadline)
                return 1;
            if(!b.deadline)
                return -1;
            return a.deadline.diff(b.deadline);
        });
        console.log("****** Tasks sorted by deadline (most recent first): ******");
        for(let el of this.list){
            console.log("Id: " + el.id +
                        ", Description: " + el.description +
                        ", Urgent: " + el.urgent +
                        ", Private: " + el.private +
                        ", Deadline: " + (el.deadline ? el.deadline.format('MMMM DD, YYYY h A') : "<not defined>"));
        }
        
    };

    this.filterAndPrint = function(){

        const newList = this.list.filter(t => t.urgent == true);
        console.log("****** Tasks filtered, only (urgent == true): ******");
        for(let el of newList){
            console.log("Id: " + el.id +
                        ", Description: " + el.description +
                        ", Urgent: " + el.urgent +
                        ", Private: " + el.private +
                        ", Deadline: " + (el.deadline ? el.deadline.format('MMMM DD, YYYY h A') : "<not defined>"));
        }
        
    };
}


const myTaskList = new TaskList();
myTaskList.list.push( new Task("1", "laundry", {}) );
myTaskList.list.push( new Task("2", "monday lab", { private: false, deadline: dayjs('2021-3-16T10:00') }) );
myTaskList.list.push( new Task("3", "phone call", { urgent: true, private: false, deadline: dayjs('2021-3-8T16:20') }) );

console.log("Task list:")
console.log(myTaskList.list);

myTaskList.sortAndPrint();
myTaskList.filterAndPrint();

debugger;