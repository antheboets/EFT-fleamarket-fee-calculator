import React from "react";
import Chart from "./Charta";
import ItemPicker from "./ItemPicker";
import calFee from "../logic/tarkovLogic";

const defaultChartData = {labels:["Fee"],datasets:[{label:"test",data:[1,2]}]};

export const MainContent = ({}) =>{
    const [chartData, setChartData] = React.useState(defaultChartData);
    const [selectedItem, setSelectedItem] = React.useState({});

    const newChartItem = (item) =>{
      setSelectedItem(item);
      const data = {defaultChartData};
      setChartData(data);
    }

    return(<div>
        <ItemPicker pickItem={newChartItem} />
        <Chart chartData={chartData} selectedItem={selectedItem}/>
    </div>);
}

export default MainContent;