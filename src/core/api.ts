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

    getRequestWithPromise<AjaxResponse>(url: string, callback: (data: AjaxResponse) => void): void {
        fetch(url)
        .then(response => response.json())
        .then(callback)
        .catch(err => {
            console.error('데이터를 불러오지 못했습니다.');
            console.error(err);
        })
    }
}

export class NewsFeedApi {
    getData(callback: (data: NewsFeed[]) => void): void {
        return this.getRequest<NewsFeed[]>(NEWS_URL, callback);
    }

    getDataWithPromise(callback: (data: NewsFeed[]) => void): void {
        return this.getRequestWithPromise<NewsFeed[]>(NEWS_URL, callback);
    }
}

export class NewsDetailApi {
    getData(id: string, callback: (data: NewsDetail) => void): void {
        return this.getRequest<NewsDetail>(CONTENT_URL.replace('@id', id), callback);
    }

    getDataWithPromise(id: string, callback: (data: NewsDetail) => void): void {
        return this.getRequestWithPromise<NewsDetail>(CONTENT_URL.replace('@id', id), callback);
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