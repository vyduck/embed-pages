import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, StringSelectMenuBuilder } from "discord.js";
import { Context, Paginator, PaginatorTypes } from "./basePaginator";
export declare class CustomPaginator implements Paginator {
    type: PaginatorTypes;
    context: Context;
    items: object[];
    baseEmbed: EmbedBuilder;
    buttonRow: ActionRowBuilder<ButtonBuilder>;
    crntPageIndex: number;
    pages: EmbedBuilder[];
    response: Message;
    pagemaker: (data: object, ...args: any[]) => Promise<EmbedBuilder> | EmbedBuilder;
    customRow: ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder> | undefined;
    customRowMaker: Function;
    args: any[];
    constructor(context: Context, { items, pagemaker, args, customRowMaker }: {
        items: object[];
        pagemaker: (data: object) => Promise<EmbedBuilder> | EmbedBuilder;
        customRowMaker: Function;
        args: any[];
    });
    init(): Promise<void>;
    update(): Promise<void>;
}
