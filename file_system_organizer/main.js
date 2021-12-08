#!/usr/bin/env node

let fs = require("fs");
let path = require("path");

//For Taking input from console.

let inputArr = process.argv.slice(2);
let command = inputArr[0];
let dirpath = inputArr[1];
let destination_path;
//File Types object:
let types ={
    media:['mkv','mp4'],
    archives:['zip','7z','rar','tar','gz','ar','iso','xz'],
    documents:['pdf','txt','doc','docx','xlxs','xls','odt','ods','odp','odg','ps','tex'],
    app:['exe']
}

// console.log(inputArr);

switch(command)
{
    case "tree": treeFn();
        break;
    case "organize": organizeFn();
        break;
    case "help": helpFn();
        break;
    default:
        console.log("Please Enter Right Command 🙏");
        break;
}

//Code For Help Command.......
function helpFn()
{
    console.log(
    `
    List of All Commands:
    1. node main.js tree "directory path"
    2. node main.js organize "directory path"
    3. node main.js help
    `);
}

//Code for Organize command......
function organizeFn()
{
    if(dirpath==undefined)
    {
        dirpath = process.cwd();
        if(fs.existsSync(dirpath)==true)
        {
            destination_path=path.join(dirpath,"Organized_files");
            if(fs.existsSync(destination_path)==false)
            {
                fs.mkdirSync(destination_path);
            }
        }
    }
    else
    {
        if(fs.existsSync(dirpath)==true)
        {
            destination_path=path.join(dirpath,"Organized_files");
            if(fs.existsSync(destination_path)==false)
            {
                fs.mkdirSync(destination_path);
            }
        }
        else
        {
            console.log("Kindly Enter a Valid Path!");
            return;
        }
    }
    organizeHelper(dirpath,destination_path);
}

function organizeHelper(src,dest)
{
    childNames = fs.readdirSync(src);
    // console.log(childNames);
    for(let i=0;i<childNames.length;i++)
    {
        let ChildAddress=path.join(src,childNames[i]);
        let isFile = fs.lstatSync(ChildAddress).isFile(); // To Check is File or Folder.
        if(isFile==true)
        {
            let category = getCategory(childNames[i]);
            console.log(childNames[i]," belongs to this type--> ",category);
            sendFiles(ChildAddress,destination_path,category);
        }

    }
}


function sendFiles(src,dest,category)
{
   let categoryPath = path.join(dest,category);

   if(fs.existsSync(categoryPath)==false)
   {
      fs.mkdirSync(categoryPath);
   }  

   let fileName = path.basename(src);
   let destFilePath = path.join(categoryPath,fileName);
   fs.copyFileSync(src,destFilePath);
   console.log(fileName,"copied to",category);
//    fs.unlinkSync(src); To delete file at that directory.
}

function getCategory(name)
{
    let ext = path.extname(name);
    ext = ext.slice(1);
    // console.log(ext);
    for(let type in types)
    {
        let cTypeArray=types[type];
        for(let i =0;i<cTypeArray.length;i++)
        {
            if(ext==cTypeArray[i])
            {
                return type;
            }
        }
    }
    return "others";
}


//Code For tree command..

function treeFn() {
    if(dirpath==undefined)
    {
        treeHelper(process.cwd(),"");
        return;
    }
    else
    {
        if(fs.existsSync(dirpath)==true)
        {
           treeHelper(dirpath,"");
        }
        else
        {
            console.log("Kindly Enter a Valid Path!");
        }
    }
    organizeHelper(dirpath,destination_path);
}

function treeHelper(dirpath,indent)
{
    isFile = fs.lstatSync(dirpath).isFile();
    if(isFile==true)
    {
        let fileName = path.basename(dirpath);
        console.log(indent,"├──",fileName);
    }
    else
    {
        let dirName = path.basename(dirpath);
        console.log(indent,"└──",dirName);
        let childrens = fs.readdirSync(dirpath);
        for(let i=0;i<childrens.length;i++)
        {
            let childpath=path.join(dirpath,childrens[i]);
            treeHelper(childpath,indent+"\t");
        }
    }
}