import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, EmbedField } from "discord.js";
import { Context, Paginator, PaginatorTypes } from "./basePaginator";
export declare class FieldPaginator implements Paginator {
    type: PaginatorTypes;
    baseEmbed: EmbedBuilder;
    response: Message<boolean>;
    context: Context;
    buttonRow: ActionRowBuilder<ButtonBuilder>;
    items: EmbedField[];
    pages: EmbedBuilder[];
    crntPageIndex: number;
    fieldsPerPage: number;
    constructor(context: Context, { baseEmbed, fieldsPerPage, fields }: {
        baseEmbed: EmbedBuilder;
        fieldsPerPage: number;
        fields: EmbedField[];
    });
    init(): Promise<void>;
    /**
     * @private
     */
    update(): void;
}
