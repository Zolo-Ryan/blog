import path from 'path';
import * as cheerio from 'cheerio';
import { readFileSync, readdirSync } from 'node:fs';

export async function readFileContent(fileName: string) {
    const filePath = path.join(process.cwd(), 'data', fileName);
    const fileContents = readFileSync(filePath, 'utf-8');
    return fileContents;
}

export function returnPagesContents() {
    const directoryPath = path.join(process.cwd(), 'pages');
    const directoryContents = readdirSync(directoryPath);
    return directoryContents.filter((fileName) => fileName.endsWith('.mdx') || fileName.endsWith('.md'));
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
