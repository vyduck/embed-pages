export class CustomPaginator {
    /**
     *
     * @param { CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | Message } context
     * @param { Object } options
     * @param { Object[] } options.items
     * @param { Function } options.pagemaker
     * @param { any[] } options.args
     */
    constructor(context: CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | Message, { items, pagemaker, args }: {
        items: any[];
        pagemaker: Function;
        args: any[];
    });
    /**
     * @private
     * @type { CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | Message }
     */
    private context: CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | Message;
    /**
     * @private
     * @type {EmbedBuilder}
     */
    private embed: EmbedBuilder;
    /**
     * @private
     * @type {Object[]}
     */
    private items: object[];
    /**
     * @private
     * @type {Function}
     */
    private pagemaker: Function;
    /**
     * @private
     * @type {Number}
     */
    private crntPageIndex: number;
    /**
     * @private
     * @type {any[]}
     */
    private args: any[];
    /**
     * @private
     * @type {ButtonBuilder}
     */
    private prevBtn: ButtonBuilder;
    /**
     * @private
     * @type {ButtonBuilder}
     */
    private nextBtn: ButtonBuilder;
    /**
     * @private
     * @type {ActionRowBuilder}
     */
    private row: ActionRowBuilder;
    /**
     * @private
     */
    private init;
    /**
     * @private
     */
    private update;
}
import { ActionRowBuilder, ButtonBuilder, CommandInteraction, EmbedBuilder } from "discord.js";
import { MessageComponentInteraction } from "discord.js";
import { ModalSubmitInteraction } from "discord.js";
import { Message } from "discord.js";
