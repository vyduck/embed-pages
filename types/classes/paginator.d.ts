import { ActionRowBuilder, ButtonBuilder, CommandInteraction, EmbedBuilder, Message, MessageComponentInteraction, ModalSubmitInteraction } from "discord.js";
export declare class CustomPaginator {
    context: CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | Message;
    items: object[];
    embed: EmbedBuilder;
    pagemaker: Function;
    customRow: ActionRowBuilder;
    customRowMaker: Function;
    crntPageIndex: number;
    args: any[];
    prevBtn: ButtonBuilder;
    nextBtn: ButtonBuilder;
    row: ActionRowBuilder<import("discord.js").AnyComponentBuilder>;
    constructor(context: CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | Message, { items, pagemaker, args, customRowMaker }: {
        items: object[];
        pagemaker: Function;
        customRowMaker: Function;
        args: any[];
    });
    init(): Promise<void>;
    update(): Promise<void>;
}
