export class FieldPaginator {
    /**
     *
     * @param { CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | Message } context
     * @param { Object } options
     * @param { EmbedBuilder } options.baseEmbed
     * @param { Number } options.fieldsPerPage
     * @param { { name: String, value: String, inline?: Boolean }[] } options.fields
     */
    constructor(context: CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | Message, { baseEmbed, fieldsPerPage, fields }: {
        baseEmbed: EmbedBuilder;
        fieldsPerPage: number;
        fields: {
            name: string;
            value: string;
            inline?: boolean;
        }[];
    });
    /**
     * @private
     * @type {{name: String, value: String, inline: Boolean}[]}
     */
    private fields: { name: string; value: string; inline: boolean; }[];
    /**
     * @private
     * @type {EmbedBuilder}
     */
    private embed: EmbedBuilder;
    /**
     * @private
     * @type {Number}
     */
    private fieldsPerPage: number;
    /**
     * @private
     * @type { CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | Message }
     */
    private context: CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | Message;
    /**
     * @private
     * @type { Number }
     */
    private crntPageIndex: number;
    /**
     * @private
     * @type { Number }
     */
    private maxPageIndex: number;
    /**
     * @private
     * @type { ButtonBuilder }
     */
    private prevBtn: ButtonBuilder;
    /**
     * @private
     * @type { ButtonBuilder }
     */
    private nextBtn: ButtonBuilder;
    /**
     * @private
     * @type { ActionRowBuilder }
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
import { ActionRowBuilder, ButtonBuilder, CommandInteraction } from "discord.js";
import { MessageComponentInteraction } from "discord.js";
import { ModalSubmitInteraction } from "discord.js";
import { Message } from "discord.js";
import { EmbedBuilder } from "discord.js";
