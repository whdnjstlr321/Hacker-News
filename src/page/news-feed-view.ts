import View from '../core/view';
import { NewsFeedApi } from '../core/api';
import { NewsStore, NewsFeed } from '../types'

const template = `
<div class="container-fulid bg-secondary">
    <div class="bg-white">
        <div class="mx-auto px-4">
            <div class="d-flex align-content-center">
                <div class="flex-grow-1 py-3">
                    <h4 class="font-extrabold">Hacker News</h4>
                </div>
                <div class="d-flex flex-wrap align-content-center">
                    <a href="#/page/{{__prev_page__}}" class="btn btn-outline-secondary mx-2">
                        Previous
                    </a>
                    <a href="#/page/{{__next_page__}}" class="btn btn-outline-secondary mx-2">
                        Next
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div class="p-4 text-2xl text-gray-700">
        {{__news_feed__}}
    </div>
</div>
`;

export default class NewsFeedView extends View {
    api: NewsFeedApi;
    store: NewsStore;

    constructor(containerId: string, store: NewsStore) {
        super(containerId, template);

        this.api = new NewsFeedApi();
        this.store = store;
    }

    async render(): Promise<void> {
        if(!this.store.hasFeeds) {
            this.store.setFeeds(await this.api.getDataWithPromise());
        }
        this.store.currentPage = Number(location.hash.substr(7) || 1);

        for (let i = (this.store.currentPage - 1) * 10; i < this.store.currentPage * 10; i++) {
            const { read, id, title, comments_count, user, points, time_ago } = this.store.getFeed(i);
            
            this.addHtml(`
            <div class="p-1 ${read ? 'bg-red-400' : 'bg-light'} rounded-3 my-4">
                <div class="d-flex align-content-center p-3">
                    <div class="flex-fill text-truncate">
                        <a class="fs-4 fw-bold text-decoration-none link-dark" href="#/show/${id}">${title}</a>
                    </div>
                    <div class="">
                        <div class="text-white bg-teal-300 rounded-3 p-2">${comments_count}</div>
                    </div>
                </div>
                <div class="d-flex align-content-center">
                    <div class="row px-4">
                        <div class="col-md-auto p-3"><i class="fas fa-user"></i>${user}</div>
                        <div class="col-md-auto p-3"><i class="fas fa-heart"></i>${points}</div>
                        <div class="col-md-auto p-3"><i class="far fa-clock"></i>${time_ago}</div>
                    </div>
                </div>
            </div>
            `);
        }
    
        this.setTemplateData('news_feed', this.getHtml());
        this.setTemplateData('prev_page', String(this.store.prevPage));
        this.setTemplateData('next_page', String(this.store.nextPage));
        
        this.updateView();
    }
}