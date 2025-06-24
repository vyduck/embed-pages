import { ActionRowBuilder, AutocompleteInteraction, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, Interaction, Message } from "discord.js";

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

export enum PaginatorTypes {
    FieldPaginator,
    CustomPaginator
}

export function makeButtonRow(crntPage: number, totalPages: number) {
    return new ActionRowBuilder<ButtonBuilder>()
        .setComponents(
            new ButtonBuilder()
                .setEmoji("⏮️")
                .setCustomId("first")
                .setDisabled(crntPage == 0)
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setEmoji("◀️")
                .setCustomId("prev")
                .setDisabled(crntPage == 0)
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setLabel(`${crntPage}/${totalPages}`)
                .setCustomId("currentPage")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setEmoji("▶️")
                .setCustomId("next")
                .setDisabled(crntPage == totalPages)
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setEmoji("⏭️")
                .setCustomId("last")
                .setDisabled(crntPage == totalPages)
                .setStyle(ButtonStyle.Primary)
        );
}