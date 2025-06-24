import { ActionRowBuilder, AutocompleteInteraction, ButtonBuilder, EmbedBuilder, Interaction, Message } from "discord.js";
export interface Paginator {
    type: PaginatorTypes;
    pages: EmbedBuilder[];
    crntPageIndex: number;
    items: object[];
    context: Interaction | Message;
    baseEmbed: EmbedBuilder;
    buttonRow: ActionRowBuilder<ButtonBuilder>;
    response: Message;
}
export interface PaginatorOptions {
    items: object[];
    baseEmbed: EmbedBuilder;
    context: Context;
}
export type Context = Exclude<Interaction, AutocompleteInteraction> | Message;
export declare enum PaginatorTypes {
    FieldPaginator = 0
}
