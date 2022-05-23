import React from "react";
import data from '../data/data.json'

export const ItemPicker = ({pickItem}) =>{

    const [foundList, setFoundList] = React.useState([{shortName:"a",uid:"1"}]);

    const fuzzySearch = (text)=>{
        const foundData = [];
        for(let i = 0; i < data.length;i++){
            if(data[i].shortName.toLowerCase().includes(text.toLowerCase())){
                foundData.push(data[i]);
            }
        }
        setFoundList(foundData);
    }

    const itemSelect = (selectedItem) =>{
        pickItem(selectedItem);
    }

    return(<div>
        <input type="text" onInput={(e)=>{fuzzySearch(e.target.value)}}/>
        <ul>{foundList.map((item)=>{return <li key={item.uid} onClick={()=>{itemSelect(item)}}>{item.shortName}</li>})}</ul>
    </div>);
}

export default ItemPicker;