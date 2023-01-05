import { NewsFeed, NewsDetail } from '../types'
import { NEWS_URL, CONTENT_URL } from '../config'

export class Api {
    getRequest<AjaxResponse>(url: string, callback: (data: AjaxResponse) => void): void {
        const ajax = new XMLHttpRequest();
        ajax.open('GET', url, false);
        ajax.addEventListener('load', () => {
            callback(JSON.parse(ajax.response) as AjaxResponse);
        })

        ajax.send();
    }

    async getRequestWithPromise<AjaxResponse>(url: string): Promise<AjaxResponse> {
        const response = await fetch(url);
        return await response.json() as AjaxResponse;
    }
}

export class NewsFeedApi {
    getData(callback: (data: NewsFeed[]) => void): void {
        return this.getRequest<NewsFeed[]>(NEWS_URL, callback);
    }

    async getDataWithPromise(): Promise<NewsFeed[]> {
        return this.getRequestWithPromise<NewsFeed[]>(NEWS_URL);
    }
}

export class NewsDetailApi {
    getData(id: string, callback: (data: NewsDetail) => void): void {
        return this.getRequest<NewsDetail>(CONTENT_URL.replace('@id', id), callback);
    }

    async getDataWithPromise(id: string): Promise<NewsDetail> {
        return this.getRequestWithPromise<NewsDetail>(CONTENT_URL.replace('@id', id));
    }
}

export interface NewsFeedApi extends Api {};
export interface NewsDetailApi extends Api {};

applyApiMixins(NewsFeedApi, [Api]);
applyApiMixins(NewsDetailApi, [Api]);

function applyApiMixins(targetClass: any, baseClasses: any[]): void {
    baseClasses.forEach(baseClass => {
        Object.getOwnPropertyNames(baseClass.prototype).forEach(name => {
            const descriptor = Object.getOwnPropertyDescriptor(baseClass.prototype, name);

            if (descriptor) {
                Object.defineProperty(targetClass.prototype, name, descriptor);
            }
        });
    });
}