import View from '../core/view';
import { NewsDetailApi } from '../core/api';
import { NewsComment, NewsDetail, NewsStore } from '../types'
import Store from '../store';

const template = `
<div class="container-fulid bg-secondary">
    <div class="bg-white">
        <div class="mx-auto px-4">
            <div class="d-flex align-content-center">
                <div class="flex-grow-1 py-3">
                    <h4 class="font-extrabold">Hacker News</h4>
                </div>
                <div class="d-flex">
                    <a href="#/page/{{__currentPage__}}" class="align-self-center text-decoration-none link-dark">
                        <i class="fa fa-times fs-1 fw-bold"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>

    <div class="bg-white m-4 p-3 rounded-4">
        <h2>{{__title__}}</h2>
        <div class="bg-dark h-20">
            {{__content__}}
        </div>

        {{__comments__}}+

    </div>
</div>
`;

export default class NewsDetailView extends View {
    private store: NewsStore;

    constructor(containerId: string, store: Store) {
        super(containerId, template);
        this.store = store;
    }

    private makeComment(comments: NewsComment[]): string {
        for(let i = 0; i < comments.length; i++) {
            const comment: NewsComment = comments[i];
    
            this.addHtml(`
            <div style="padding-left: ${comment.level * 40}px;" class="mt-5">
                <div class="text-secondary">
                    <i class="fa fa-sort-up"></i>
                    <strong>${comment.user}</strong> ${comment.time_ago}
                </div>
                <p class="">${comment.content}</p>
            </div>
            `);
            if(comment.comments.length > 0) {
                this.addHtml(this.makeComment(comment.comments));
            }
        }
    
        return this.getHtml();
    }

    async render(): Promise<void> {
        const id = location.hash.substring(7);
        const api = new NewsDetailApi();
        const { comments, title, content } = await api.getDataWithPromise(id);

        this.store.makeRead(Number(id));
    
        this.setTemplateData('comments', this.makeComment(comments));
        this.setTemplateData('currentPage', String(this.store.currentPage));
        this.setTemplateData('title', title);
        this.setTemplateData('content', content);

        this.updateView();
    }
}