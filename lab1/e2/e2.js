'use strict';
const dayjs = require('dayjs');
const sqlite = require('sqlite3');


function Task(id, description, optionals){
    this.id = id;
    this.description = description;
    this.urgent = optionals.urgent === true ? true : false;
    this.private = optionals.private === false ? false : true;
    this.deadline = optionals.deadline ? optionals.deadline : null;
}

function TaskList(){
    this.db = new sqlite.Database('./lab1/e2/tasks.db', (err) => { if (err) throw err; });
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

    this.loadAndPrintAllTasks = () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM tasks;';
            this.db.all(query, [], (err, rows) => {
                if(err){
                    reject(err);
                }else{
                    const tempList = [];
                    for(let el of rows){
                        let urg = el.urgent == 0 ? false : true;
                        let pri = el.private == 0 ? false : true;
                        let dea = dayjs(el.deadline);
                        let t = new Task(el.id, el.description, { urgent: urg, private: pri, deadline: dea });
                        tempList.push(t);
                    }
                    this.list = tempList;
                    this.printTaskList();
                    resolve(rows);
                }
            });
        });
    };

    this.loadAndPrintTasksAfter = (date) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM tasks WHERE DATE(deadline) > DATE(?);';
            this.db.all(query, [date], (err, rows) => {
                if(err){
                    reject(err);
                }else{
                    const tempList = [];
                    for(let el of rows){
                        let urg = el.urgent == 0 ? false : true;
                        let pri = el.private == 0 ? false : true;
                        let dea = dayjs(el.deadline);
                        let t = new Task(el.id, el.description, { urgent: urg, private: pri, deadline: dea });
                        tempList.push(t);
                    }
                    this.list = tempList;
                    this.printTaskList();
                    resolve(rows);
                }
            });
        });
    };
    
    this.loadAndPrintTasksWithText = (text) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM tasks WHERE description LIKE ?;';
            this.db.all(query, ['%' + text + '%'], (err, rows) => {
                if(err){
                    reject(err);
                }else{
                    const tempList = [];
                    for(let el of rows){
                        let urg = el.urgent == 0 ? false : true;
                        let pri = el.private == 0 ? false : true;
                        let dea = dayjs(el.deadline);
                        let t = new Task(el.id, el.description, { urgent: urg, private: pri, deadline: dea });
                        tempList.push(t);
                    }
                    this.list = tempList;
                    this.printTaskList();
                    resolve(rows);
                }
            });
        });
    };

    this.printTaskList = function(){

        console.log("****** Tasks loaded: ******");
        for(let el of this.list){
            console.log("Id: " + el.id +
                        ", Description: " + el.description +
                        ", Urgent: " + el.urgent +
                        ", Private: " + el.private +
                        ", Deadline: " + (el.deadline ? el.deadline.format('MMMM DD, YYYY h A') : "<not defined>"));
        }
        
    };
    
}


async function main(){

    const myTaskList = new TaskList();

    /*
    myTaskList.list.push( new Task("1", "laundry", {}) );
    myTaskList.list.push( new Task("2", "monday lab", { private: false, deadline: dayjs('2021-3-16T10:00') }) );
    myTaskList.list.push( new Task("3", "phone call", { urgent: true, private: false, deadline: dayjs('2021-3-8T16:20') }) );
    
    console.log("Task list:")
    console.log(myTaskList.list);

    myTaskList.sortAndPrint();
    myTaskList.filterAndPrint();
    */

    await myTaskList.loadAndPrintAllTasks();
    await myTaskList.loadAndPrintTasksAfter('2021-03-07');
    await myTaskList.loadAndPrintTasksWithText('lau');

}

main();

