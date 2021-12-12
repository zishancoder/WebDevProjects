#!/usr/bin/env node

let fs = require("fs");


//Input.....
let inputArr = process.argv.slice(2);
// console.log(inputArr);

//Options...
let optionsArr=[];
let filesArr=[];
for(let i=0;i<inputArr.length;i++)
{
    let firstChar = inputArr[i].charAt(0);
    if(firstChar=='-')
    {
        optionsArr.push(inputArr[i]);
    }
    else
    {
        filesArr.push(inputArr[i]);
    }
}

//existance .....
for(let i=0;i<filesArr.length;i++)
{
    let isPresent = fs.existsSync(filesArr[i]);
    if(isPresent == false)
    {
        console.log(`file ${filesArr[i]} is not present`);
        return;
    }
}

//option checking...
let isBothPresent=optionsArr.includes("-b")&&optionsArr.includes("-n");
if(isBothPresent)
{
    console.log("either enter -n or -b option");
    return;
}

//read
let content = "";
for(let i=0;i<filesArr.length;i++)
{
    let bufferContent = fs.readFileSync(filesArr[i]);
    content = content+bufferContent+"\r\n";
}
// console.log(content);

let contentArr = content.split("\r\n");
// console.log(contentArr);

//-s
let isPresent=optionsArr.includes("-s");

if(isPresent==true)
{
    for(let i=1;i<contentArr.length;i++)
    {
        if(contentArr[i]=="" && contentArr[i-1]=="")
        {
            contentArr[i]=null;
        }
        else if(contentArr[i]=="" && contentArr[i-1]==null)
        {
            contentArr[i]=null;
        }
    }
    let tempArr=[];
    for(let i=0;i<contentArr.length;i++)
    {
        if(contentArr[i]!=null)
        {
            tempArr.push(contentArr[i]);
        }
    }
    contentArr=tempArr;
}
// console.log(contentArr);


//-n
let isNPresent=optionsArr.includes("-n");
if(isNPresent==true)
{
    for(let i=0;i<contentArr.length;i++)
    {
        contentArr[i]=`${i+1} ${contentArr[i]}`;
    }
}
// console.log(contentArr.join("\n"));

//-b
let isBPresent=optionsArr.includes("-b");
if(isBPresent==true)
{
    let counter = 1;
    for(let i=0;i<contentArr.length;i++)
    {
        if(contentArr[i]!="")
        {
            // contentArr[i]=`${i+1} ${contentArr[i]}`;
            contentArr[i]=`${counter} ${contentArr[i]}`;
            counter++;
        }
    }
}
console.log(contentArr.join("\n"));



/*
Command lines----

1. node main.js f1.txt f2.txt -b -s  > f3.txt
2. node main.js f1.txt f2.txt -b -s  >> f3.txt

*/