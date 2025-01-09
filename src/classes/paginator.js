import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, ComponentType, EmbedBuilder, InteractionCollector, Message, MessageComponentInteraction, ModalSubmitInteraction } from "discord.js";

export class CustomPaginator {
    /**
     * @private 
     * @type { CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | Message } 
     */
    context;

    /**
     * @private
     * @type {Object[]}
     */
    items;
    
    /**
     * @private
     * @type {EmbedBuilder}
     */
    embed;

    /**
     * @private
     * @type {Function}
     */
    pagemaker;

    /**
     * @private
     * @type {ActionRowBuilder}
     */
    customRow;

    /**
     * @private
     * @type {Function}
     */
    customRowMaker;

    /**
     * @private 
     * @type {Number} 
     */
    crntPageIndex = 0;

    /**
     * @private
     * @type {any[]}
     */
    args = [];

    /** 
     * @private
     * @type {ButtonBuilder}
     */
    prevBtn = new ButtonBuilder()
        .setLabel("Previous")
        .setCustomId("prev")
        .setStyle(ButtonStyle.Success);

    /**
     * @private 
     * @type {ButtonBuilder} 
     */
    nextBtn = new ButtonBuilder()
        .setLabel("Next")
        .setCustomId("next")
        .setStyle(ButtonStyle.Success);

    /** 
     * @private
     * @type {ActionRowBuilder}
     */
    row = new ActionRowBuilder();

    /**
     * @param { CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | Message } context 
     * @param { Object } options
     * @param { Object[] } options.items
     * @param { Function } options.pagemaker
     * @param { Function } options.customRowMaker
     * @param { any[] } options.args
     */
    constructor(context, {
        items = [], pagemaker = () => new EmbedBuilder(), args = [], rowmaker = () => undefined
    }) {
        this.context = context;

        this.items = items;
        this.pagemaker = pagemaker;
        this.customRowMaker = rowmaker;
        this.args = args;

        this.init();
    }

    /**
     * @private
     */
    async init() {
        await this.update();

        const message = await this.context[this.context.deferred ? "editReply" : "reply"]({
            embeds: [this.embed],
            components: [
                customRow == undefined ? this.row : this.row, this.customRow
            ]
        });

        const btnCollector = new InteractionCollector(
            message.client,
            {
                message,
                componentType: ComponentType.Button
            }
        );

        btnCollector.on("collect", async (interaction) => {
            switch (interaction.customId) {
                case "next":
                    this.crntPageIndex += 1;
                    break;
                case "prev":
                    this.crntPageIndex -= 1;
                    break;
            };

            await this.update();

            await interaction.update({
                embeds: [this.embed],
                components: [this.row]
            });
        });
    }

    /**
     * @private
     */
    async update() {
        this.embed = await this.pagemaker(this.items[this.crntPageIndex], ...this.args);
        this.customRow = await this.customRowMaker();

        this.embed.setFooter({
            text: `${this.crntPageIndex + 1}/${this.items.length}`
        });

        this.prevBtn.setDisabled(false);
        this.nextBtn.setDisabled(false);
        if (this.crntPageIndex == 0) this.prevBtn.setDisabled(true);
        if (this.crntPageIndex == this.items.length - 1) this.nextBtn.setDisabled(true);
        this.row.setComponents(this.prevBtn, this.nextBtn);
    }
}