import { EmbedBuilder } from "discord.js";
import { Context, Paginator, PaginatorTypes } from "./basePaginator.js";
export interface CustomPaginatorOptions {
    items: object[];
    pagemaker: (data: object, ...args: any) => Promise<EmbedBuilder> | EmbedBuilder;
    args?: any[];
}
export declare class CustomPaginator implements Paginator {
    type: PaginatorTypes;
    crntPageIndex: number;
    pages: EmbedBuilder[];
    constructor(context: Context, options: CustomPaginatorOptions);
    init(context: Context): Promise<void>;
}
