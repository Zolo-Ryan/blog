import matter from 'gray-matter';
import { promises as fs } from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import * as cheerio from 'cheerio';
import { Element } from 'domhandler';

export async function readFileContent(fileName: string) {
    const filePath = path.join(process.cwd(), 'data', fileName);
    const fileContents = await fs.readFile(filePath, 'utf-8');
    return fileContents;
}

export async function returnDataContents() {
    const directoryPath = path.join(process.cwd(), 'data');
    const directoryContents = await fs.readdir(directoryPath)
    return directoryContents;
}

async function markdownToHtml(content: string) {
    const matterContent = matter(content);
    const htmlContent = await remark().use(html).process(matterContent.content);
    return htmlContent.toString();
}

export async function mdToHtml(fileName: string) {
    const content = await readFileContent(fileName);
    const htmlString = await markdownToHtml(content);
    const $ = cheerio.load(htmlString, null, false);
    filterScripts($);

    const currentParentIds: Record<number, string> = { 0: '' };
    const counters: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

    let lastHeadingId = '';
    let pCounter = 0;

    $('h1, h2, h3, h4, h5, h6, p').each((index, element) => {
        const tagName = element.name;

        if (tagName === 'p') {
            pCounter++;

            const fullId = lastHeadingId ? `${lastHeadingId}.p-${pCounter}` : `p-${pCounter}`;
            $(element).attr('id', fullId);
        } else {
            lastHeadingId = handleHierarchyOfHeadings(currentParentIds, counters, $, element);
        }
    });

    console.log($.html())
    return $.html();
}

const handleHierarchyOfHeadings = (
    currentParentIds: Record<number, string>,
    counters: Record<number, number>,
    $: cheerio.CheerioAPI,
    element: Element
): string => {
    const tagName = element.tagName;
    const currentLevel = parseInt(tagName.replace('h', ''), 10); // e.g., 1, 2

    for (let i = currentLevel + 1; i <= 6; i++) {
        counters[i] = 0;
    }

    counters[currentLevel]++;

    const currentIdSuffix = `${tagName}-${counters[currentLevel]}`;
    const parentId = currentParentIds[currentLevel - 1];
    const fullId = parentId ? `${parentId}.${currentIdSuffix}` : currentIdSuffix;

    $(element).attr('id', fullId);

    currentParentIds[currentLevel] = fullId;
    return fullId;
}

const filterScripts = ($: cheerio.CheerioAPI): void => {
    $('script').remove();

    $('*').each((_, element) => {
        const attribs = element.attribs;
        if (!attribs) return;

        for (const attrName of Object.keys(attribs)) {
            const lowerAttr = attrName.toLowerCase();

            if (lowerAttr.startsWith('on')) {
                $(element).removeAttr(attrName);
                continue;
            }

            if (['href', 'src', 'action', 'formaction'].includes(lowerAttr)) {
                const attrValue = attribs[attrName].trim().toLowerCase();
                if (attrValue.startsWith('javascript:') || attrValue.startsWith('vbscript:')) {
                    $(element).removeAttr(attrName);
                }
            }
        }
    });
};
