//POC, use only defaluts, numbers must have commas
//v1
interface DirObject {
    name:string;
    size:number;
    children?:FileObject[]
} 

interface FileObject{
    name:string;
    size:number;
    children?:FileObject[]
    
}


const fsPromises = require('fs/promises')

const filesize = require('filesize')
const glob = require('glob')

//utility base comparators
const noSort = (a:FileObject, b:FileObject) => 0
const compareNumbers = (a:number, b:number) => a - b 
const compareStrings = (a:string, b:string) => a.localeCompare(b)

//filesize utility base comparators
const compareFileNames = (a:FileObject, b:FileObject) => compareStrings(a.name, b.name)
const compareFileSizes = (a:FileObject, b:FileObject) => -compareNumbers(a.size, b.size) // minius sign makes it descending
function compareFileExtensions(a:DirObject, b:DirObject) {
    let extA = a.name.includes('.') ? a.name.split('.').pop() || "" : ''
    let extB = b.name.includes('.') ? b.name.split('.').pop() || "" : ''
    return compareStrings(extA, extB)
}



//global control flags set to defaults
let path = '.'
let blocksize = false
let threshold = 0
let sortOrder = noSort
let metric = false 
let locale = "US"
let lang = "en"
let help = false

// read file 
async function usage() {
    //print the help doc
    const text = await fsPromises.readFile(fileOutput('help','txt'), 'utf8')//help.en-US.txt, help.es-MX.txt
    console.log(text)
    process.exit() 
}
//create function that grabs the file()
//return the file
function fileOutput(filename:string, ext:string){
    let completeFileName = glob.sync(`${filename}.${lang}-${locale}.${ext}`)
    return `${completeFileName}`
}
  
function setFlags() {
    const args = process.argv.slice(2)
    for (let i=0; i<args.length; i++) {
        switch(args[i]) {
            case '-h':
            case '--help':
                help = true
                break 
            case '-t':
            case '--threshold':
                threshold = Number(args[++i]) * 1_000_000_000
                break
            case '-p':
            case '--path':
                path = args[++i]
                break
            case '-loc':
            case '--locale':
                if(args[++i]){
                    locale = args[i]
                }
                console.log(locale)             
                break
            case '-lang':
            case '--lanuage':
                if(args[++i]){
                    lang= args[i]
                    
                }
                console.log(lang)
                break
            case '-c':
            case '--config':
              
                                 
                
                break
            case '-f':
            case '--filter':
               
               
                break 
            case '-m':
            case '-metric':
                metric = true
                break  
            case '-s':
            case '--sort':
                console.log('sort stub')
                let sortType = args[++i]
                if (sortType === 'alpha') {
                sortOrder = compareFileNames
                }
                else if (sortType === 'exten') {
                sortOrder = compareFileExtensions
                }
                else if (sortType === 'size') {
                sortOrder = compareFileSizes
                }
                break
            default: console.log('bad input')
        }
    }
}

const getBlkSize = (num:number):number => Math.ceil(num/4096)*  4096

async function readTree(dirPath: string):Promise<DirObject> {
   
    const dir:DirObject = {
        name: dirPath,
        size: 0,
        children:[]
    }
    const names = await fsPromises.readdir(dirPath)
    for (let name of names){ //works for one level down from the current directory
        const childName = `${dirPath}/${name}` 
        console.log(childName,"here")
        const stats = await fsPromises.stat(childName)
        
        if (stats.isFile()) {
            const file:FileObject = {
                name: childName,
                size: blocksize? getBlkSize(stats.size) : stats.size 
            }
            dir.size += file.size
            
            if(dir && dir.children){
                dir.children.push(file)
            }
            
        }
        else if (stats.isDirectory()) {
            const subDir:DirObject = await readTree(childName)
            dir.size += subDir.size
            if (dir && dir.children){
                dir.children.push(subDir)
            }
        }
    }
    
    if (dir && dir.children){
        dir.children.sort(sortOrder)
    }
    
   return dir 
}


function displayTree(dirEntry:DirObject | FileObject){
    if(dirEntry.size < threshold) return
    
    if (metric) {
        console.log(`${dirEntry.name} ${filesize(dirEntry.size)}`)
    }
    else 
    console.log(`${dirEntry.name} ${dirEntry.size.toLocaleString('en-US')} bytes`)
    
   if (!dirEntry.children) return //file
   console.group()
   for (let child of dirEntry.children){
    displayTree(child)
   }
   console.groupEnd()
}
async function main() {
    setFlags()
    if (help===false){
        
        let tree = await readTree(path)
        displayTree(tree)
    }
    else {
        usage()
    }
   
}
main()
