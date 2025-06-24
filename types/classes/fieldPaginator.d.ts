import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, EmbedField } from "discord.js";
import { Context, Paginator, PaginatorTypes } from "./basePaginator.js";
export declare class FieldPaginator implements Paginator {
    type: PaginatorTypes;
    baseEmbed: EmbedBuilder;
    response: Message<boolean>;
    context: Context;
    buttonRow: ActionRowBuilder<ButtonBuilder>;
    pages: EmbedBuilder[];
    crntPageIndex: number;
    items: EmbedField[];
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
