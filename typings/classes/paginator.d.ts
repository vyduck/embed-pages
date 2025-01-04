export class CustomPaginator {
    /**
     *
     * @param { CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | Message } context
     * @param { Object } options
     * @param { Object[] } options.items
     * @param { Function } options.pagemaker
     * @param { any[] } options..args
     */
    constructor(context: CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | Message, { items, pagemaker, args }: {
        items: any[];
        pagemaker: Function;
    });
    /**
     * @private
     * @type { CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | Message }
     */
    private context;
    /**
     * @private
     * @type {EmbedBuilder}
     */
    private embed;
    /**
     * @private
     * @type {Object[]}
     */
    private items;
    /**
     * @private
     * @type {Function}
     */
    private pagemaker;
    /**
     * @private
     * @type {Number}
     */
    private crntPageIndex;
    /**
     * @private
     * @type {any[]}
     */
    private args;
    /**
     * @private
     * @type {ButtonBuilder}
     */
    private prevBtn;
    /**
     * @private
     * @type {ButtonBuilder}
     */
    private nextBtn;
    /**
     * @private
     * @type {ActionRowBuilder}
     */
    private row;
    /**
     * @private
     */
    private update;
}
import { CommandInteraction } from "discord.js";
import { MessageComponentInteraction } from "discord.js";
import { ModalSubmitInteraction } from "discord.js";
import { Message } from "discord.js";
