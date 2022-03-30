import logic from './tarkovLogic.js';

//const data =[{name:"abc"},{name:"aaa"},{name:"cde"},{name:"abb"}];

const getData = async () =>{
    return await fetch("data.json").then(res =>{
        if(!res.ok){
            throw new Error("HTTP error " + res.status);
        }
        return res.json();
    }).then(json =>{
        return json;
    });
}
const data = getData();

const ul = document.getElementById("itemUl");

const removeChilds = (parent) => {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};


const fuzzySearch = (text)=>{
    let foundData = [];
    for(let i = 0; i < data.length;i++){
        if(data[i].name.toLowerCase().includes(text.toLowerCase())){
            foundData.push(data[i]);
        }
    }
    return foundData;
}

const search = (e,text) =>{
    const resultData = fuzzySearch(text);
    removeChilds(document.getElementById("itemUl"));
    for(let i = 0; i < resultData.length;i++){
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(resultData[i].name));
        li.onclick = (e) => {itemSelect(e,resultData[i])};
        ul.appendChild(li);
    }
};

const itemSelect = (e,item) =>{
    console.log(item);
}


//console.log(logic.calFee(0,0,{BaseValue:1},1));

document.getElementById("itemInput").addEventListener("input",(e)=>{search(e,document.getElementById("itemInput").value)});