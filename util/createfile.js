const fs = require('fs').promises;

const JsonPath = "jsonFolder/";

async function getJsonObjs(){
    let JsonList = {};
    let jsonefileName = [];
    let jsonFilePath = await getJsonFiles();
    let endpoints = [
        {
            url:"https://tarkov-market.com/api/v1/items/all",
            option: {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey
                  },
            }
        },
        {
            url:"https://tarkov-market.com/api/v1/bsg/items/all",
            option: {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey
                  },
            }
        }
    ]

    jsonFilePath.forEach((path) => {
        jsonefileName.push(path.replace(/\.[^/.]+$/, ""));
    });

    let JsonPromiseList = jsonFilePath.map(async (path) => {
        return JSON.parse(await fs.readFile('./' + JsonPath + path, 'utf8'));
    });

    await Promise.all(JsonPromiseList).then((data) =>{
        for(let i = 0; i < data.length; i++){
            JsonList[jsonefileName[i]] = data[i];
        }
    });

    let fetchPromisses = endpoints.map((endpoint) => {
        return fetch(endpoint["url"],endpoint["option"]);
    });

    await Promise.all(fetchPromisses).then(async (response) =>{
        if(response[0].status === 200){
            JsonList["itemsTarkovMarket"] = await response[0].json()
        }
        if(response[1].status === 200){
            JsonList["itemsBsg"] = await response[1].json()
        }
    });

    return JsonList;
}
async function getJsonFiles(){
    return await fs.readdir(__dirname +'/'+ JsonPath);
}
function writeInitFIle(filename,data){
    fs.writeFile("dbJsFolder/"+filename + ".js",data, function () {});
}
function sanitizeStr(oldStr){
    let newStr = '';
    let checkForLastCharBreakLine = false;
    let checkForNextSpace = false;
    let isFirstChar = true;
    [...oldStr].forEach((char) =>{
        if(isFirstChar && char === ' '){
            isFirstChar = false;
        }
        else{
            if(char !== '"'){
                isFirstChar = false;
            }
            if(checkForLastCharBreakLine){
                if(char !== '"'){
                    newStr += ' ';
                }
                checkForLastCharBreakLine = false;
            }
            if(checkForNextSpace && char == ' '){
                newStr = newStr.substring(0, newStr.length - 1);
            }
            checkForNextSpace = false;
            switch(char){
                case String.fromCharCode(1040): // A
                    newStr += 'A';
                    break;
                case String.fromCharCode(1042): // B
                    newStr += 'B';
                    break;
                case String.fromCharCode(1045): // E
                    newStr += 'E';
                    break;
                case String.fromCharCode(1050): // K
                    newStr += 'K';
                    break;
                case String.fromCharCode(1052): // M
                    newStr += 'M';
                    break;
                case String.fromCharCode(1053): // H
                    newStr += 'H';
                    break;
                case String.fromCharCode(1054): // O
                    newStr += 'O';
                    break;
                case String.fromCharCode(1056): // P
                    newStr += 'P';
                    break;
                case String.fromCharCode(1057): // C
                    newStr += 'C';
                    break;
                case String.fromCharCode(1058): // T
                    newStr += 'T';
                    break;
                case String.fromCharCode(1059): // Y
                    newStr += 'Y';
                    break;
                case String.fromCharCode(1061): // X
                    newStr += 'X';
                    break;
                case String.fromCharCode(1056): // P
                    newStr += 'P';
                    break;
                case String.fromCharCode(1057): // C
                    newStr += 'C';
                    break;
                case String.fromCharCode(1058): // T
                    newStr += 'T';
                    break;
                case String.fromCharCode(1059): // Y
                    newStr += 'Y';
                    break;
                case ' ':
                    newStr += char;
                    checkForNextSpace = true;
                break;
                case 'n':
                    if(newStr[newStr.length - 1] === '\\'){
                        newStr = newStr.substring(0, newStr.length - 1);
                        checkForLastCharBreakLine = true;
                    }
                    else{
                        newStr += char;
                    }
                    break;
                default:
                    newStr += char;
            }
        }
    });
    if(newStr.slice(-2,-1) === ' '){
        newStr = newStr.substring(0, newStr.length - 2) + '"';
    }
    return newStr;
}

let itemsFunc = (dbName,db,databaseBsg,databasePresets,databaseUid,databaseTags,databaseGearPresets,databaseVendors) =>{
    let str = '[';
    let idFound = false;
    databaseUid.forEach((uid) => {
        if(uid.bsgId === db.bsgId || uid.uidTarkovMarket === db.uid){
            str += '_id:ObjectId(' + JSON.stringify(uid._id) +')' 
            +',uidTarkovMarket:'+JSON.stringify(uid.uidTarkovMarket)
            +',bsgId:'+JSON.stringify(uid.bsgId);
            idFound = true;
        }
    });

    if(!idFound){
        str +='uidTarkovMarket:'+JSON.stringify(db.uid)
        +',bsgId:'+JSON.stringify(db.bsgId)
        + ',';
    }
    else{
        str += ','
    }
    if(databaseBsg[db.bsgId] !== undefined){
        +',name:' + sanitizeStr(JSON.stringify(String(databaseBsg[db.bsgId]._props.Name)))
        +',shortName:' + sanitizeStr(JSON.stringify(String(databaseBsg[db.bsgId]._props.ShortName)))
        +',description:' + sanitizeStr(JSON.stringify(String(databaseBsg[db.bsgId]._props.Description)))
        +',nameOriginal:' + JSON.stringify(String(databaseBsg[db.bsgId]._props.Name))
        +',shortNameOriginal:' + JSON.stringify(String(databaseBsg[db.bsgId]._props.ShortName))
        +',descriptionOriginal:' + JSON.stringify(String(databaseBsg[db.bsgId]._props.Description))
        +',ragFairCommissionModifier:'+JSON.stringify(databaseBsg[db.bsgId]._props.RagFairCommissionModifier)//misschien overbodig
        +',basePrice:'+JSON.stringify(db.basePrice);
    }
    str += '},';
    return str;
}
function initDb(dbName,initFileFunc,data){
    let initDbStr = initFileFunc(dbName,...data);
    writeInitFIle(dbName,initDbStr);
}

async function main() {
    const data = await getJsonObjs();
   
    initDb("item",itemfunc,[data["itemsTarkovMarket"],data["itemsBsg"],data["presets"],data["uid"],data["tags"],data["gearPreset"],data["vendors"],data["dubs"]]);
    /*
    initDb("itemBsg",bsgFunc,[data["itemsBsg"]]); // verwijderen
    initDb("hideoutModule",moduleFunc,[data["modules"]]);
    initDb("craft",craftFunc,[data["crafts"]]);
    initDb("vendor",vendorFunc,[data["vendors"]]);
    initDb("barter",barterFunc,[data["barter"]]);
    initDb("vendorItem",vendorItemFunc,[data["vendorItems"]]);
    initDb("currency",currencyFunc,[data["currency"]]);
    initDb("itemMarket",marketFunc,[data["itemsTarkovMarket"]]) // verwijderen
    */
}

main();