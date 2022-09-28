import { Manifest } from "../interfaces";
import { langCodes, languageCodes } from "../locales";

const possibleManiKeys = [
  "background_color",
  "description",
  "dir",
  "display",
  "lang",
  "name",
  "orientation",
  "prefer_related_applications",
  "related_applications",
  "scope",
  "short_name",
  "start_url",
  "theme_color",
  "shortcuts",
  "categories",
  "screenshots",
  "iarc_rating_id",
  "icons",
  "share_target",
  "display_override"
];

export function isStandardOrientation(orientation: string): boolean {
  const standardOrientations = [
    "any",
    "natural",
    "landscape",
    "landscape-primary",
    "landscape-secondary",
    "portrait",
    "portrait-primary",
    "portrait-secondary",
  ];
  return standardOrientations.includes(orientation);
}

// is this valid JSON
export function isValidJSON(json: Manifest): boolean {
  try {
    JSON.parse(JSON.stringify(json));
    return true;
  } catch (e) {
    return false;
  }
}




export async function findMissingKeys(manifest: Manifest): Promise<Array<string>> {
  return new Promise((resolve) => {
    let data: string[] = [];
    const keys = Object.keys(manifest);

    // find missing possible keys in manifest
    possibleManiKeys.forEach((key) => {
      if (keys.includes(key) === false) {
        data.push(key);
      }
    })

    resolve(data);
  });
}

export function containsStandardCategory(categories: string[]): boolean {
  // https://github.com/w3c/manifest/wiki/Categories
  const standardCategories = [
    'books',
    'business',
    'education',
    'entertainment',
    'finance',
    'fitness',
    'food',
    'games',
    'government',
    'health',
    'kids',
    'lifestyle',
    'magazines',
    'medical',
    'music',
    'navigation',
    'news',
    'personalization',
    'photo',
    'politics',
    'productivity',
    'security',
    'shopping',
    'social',
    'sports',
    'travel',
    'utilities',
    'weather',
  ];
  
  return categories.some(c => standardCategories.includes(c));
}

export function isValidLanguageCode(code: string){
  // temporary fix that helps with codes like en-US that we don't cover.
  let langUsed = code.split("-")[0];
  let flag = false;

  languageCodes.forEach((lang: langCodes) => {
    if(lang.code === langUsed) {
      flag = true;
    }
  })
  return flag;
}

function getDimensions(sizes: string){
  return (sizes || '0x0')
    .split(' ')
    .map(size => {
      const dimensions = size.split('x');
      return {
        width: Number.parseInt(dimensions[0] || '0', 10),
        height: Number.parseInt(dimensions[1] || '0', 10),
      };
    });
}

export function isAtLeast(sizes: string, width: number, height: number): boolean {
  const dimensions = getDimensions(sizes);
  return dimensions.some(i => i.width >= width && i.height >= height);
}



export function validateSingleProtocol(proto: any){
  let validProtocol = validProtocols.includes(proto.protocol) || proto.protocol.startsWith("web+")
  if(!validProtocol){
    return "protocol";
  }

  // need to make sure its relative p0
  // need to check for %s p0
  // need to check base url + proto.url is a valid url p1

  // first check makes sure its relative , second check
  if(!proto.url.startsWith("/") || (proto.url.split("%s").length == 1)){
    return "url";
  }

  return "valid";
}




const validProtocols: Array<String> = ["bitcoin", "dat", "dweb", "ftp", "geo", "gopher", "im", "ipfs", "ipns", "irc", "ircs", "magnet", "mailto", "matrix", "mms", "news", "nntp", "sip", "sms", "smsto", "ssb", "ssh", "tel", "urn", "webcal", "wtai", "xmpp"];
export const required_fields = ["icons", "name", "short_name", "start_url"];
export const reccommended_fields = ["display", "background_color", "theme_color", "orientation", "screenshots", "shortcuts"];
export const optional_fields = ["iarc_rating_id", "related_applications", "prefer_related_applications", "lang", "dir", "description", "protocol_handlers", "display_override", "share_target", "scope", "categories"];