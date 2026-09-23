import { promises as fs } from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';


export async function readFileContent(fileName: string) {
    const filePath = path.join(process.cwd(), 'data', fileName);
    const fileContents = await fs.readFile(filePath, 'utf-8');
    return fileContents;
}

export async function returnDataContents() {
    const directoryPath = path.join(process.cwd(), 'pages');
    const directoryContents = await fs.readdir(directoryPath)
    return directoryContents;
}

const filterScripts = ($: cheerio.CheerioAPI): void => {
    $('script').remove();

    $('*').each((_, element: any) => {
        const attribs = element && element.attribs;
        if (!attribs) return;

        for (const attrName of Object.keys(attribs)) {
            const lowerAttr = attrName.toLowerCase();

            if (lowerAttr.startsWith('on')) {
                $(element).removeAttr(attrName);
                continue;
            }

            if (['href', 'src', 'action', 'formaction'].includes(lowerAttr)) {
                const rawVal = attribs[attrName];
                const attrValue = String(rawVal || '').trim().toLowerCase();
                if (attrValue.startsWith('javascript:') || attrValue.startsWith('vbscript:')) {
                    $(element).removeAttr(attrName);
                }
            }
        }
    });
};
