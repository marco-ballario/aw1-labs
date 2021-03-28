'use strict';

const words = ['uno', 'due', 'tre', 'quattro', 'cinque'];

const f = function(w){
    for(let i = 0; i < w.length; i++){
        if(w[i].length < 2)
            w[i] = '';
        else
            w[i] = w[i][0]+ w[i][1] + w[i][w[i].length-2] + w[i][w[i].length-1];
    }
    return w;    
}

console.log(f(words));

debugger;