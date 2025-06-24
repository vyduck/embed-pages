import { ActionRowBuilder, AutocompleteInteraction, ButtonBuilder, EmbedBuilder, Interaction, Message } from "discord.js";
export interface Paginator {
    type: PaginatorTypes;
    pages: EmbedBuilder[];
    crntPageIndex: number;
}
export interface PaginatorOptions {
    items: object[];
    baseEmbed: EmbedBuilder;
    context: Context;
}
export type Context = Exclude<Interaction, AutocompleteInteraction> | Message;
export declare enum PaginatorTypes {
    FieldPaginator = 0,
    CustomPaginator = 1
}
export declare function makeButtonRow(crntPage: number, totalPages: number): ActionRowBuilder<ButtonBuilder>;
