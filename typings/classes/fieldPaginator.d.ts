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
    private fields;
    /**
     * @private
     * @type {EmbedBuilder}
     */
    private embed;
    /**
     * @private
     * @type {Number}
     */
    private fieldsPerPage;
    /**
     * @private
     * @type { CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | Message }
     */
    private context;
    /**
     * @private
     * @type { Number }
     */
    private crntPageIndex;
    /**
     * @private
     * @type { Number }
     */
    private maxPageIndex;
    /**
     * @private
     * @type { ButtonBuilder }
     */
    private prevBtn;
    /**
     * @private
     * @type { ButtonBuilder }
     */
    private nextBtn;
    /**
     * @private
     * @type { ActionRowBuilder }
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
import { EmbedBuilder } from "discord.js";
