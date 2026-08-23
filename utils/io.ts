import matter from 'gray-matter';
import { promises as fs } from 'fs'
import path from 'path'
import { remark } from 'remark';
import html from 'remark-html'

export async function readFileContent(fileName: string) {
    const filePath = path.join(process.cwd(), 'data', fileName);
    const fileContents = await fs.readFile(filePath, 'utf-8');
    return fileContents;
}

export async function returnDataContents(){
    const directoryPath = path.join(process.cwd(),'data');
    const directoryContents = await fs.readdir(directoryPath)
    return directoryContents;
}

async function markdownToHtml(content: string){
    const matterContent = matter(content);
    const htmlContent = await remark().use(html).process(matterContent.content);
    return htmlContent.toString();
}


// TODO: have each html tag a unique id -> h1 to h6
// TODO: make the links to use Link tag
// TODO: make the images to use Image tag
export async function mdToHtml(fileName: string){
    const content = await readFileContent(fileName);
    return markdownToHtml(content);
}
