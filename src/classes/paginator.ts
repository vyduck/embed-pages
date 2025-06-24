// @ts-nocheck
// TODO: Remove this comment when the code is stable and tested

import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, ComponentType, EmbedBuilder, InteractionCollector, Message, MessageComponentInteraction, ModalSubmitInteraction } from "discord.js";

export class CustomPaginator {
    context: CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | Message;
    items: object[];
    embed: EmbedBuilder;
    pagemaker: Function;
    customRow: ActionRowBuilder;
    customRowMaker: Function;

    crntPageIndex = 0;
    args = [];

    prevBtn: ButtonBuilder = new ButtonBuilder()
        .setLabel("Previous")
        .setCustomId("prev")
        .setStyle(ButtonStyle.Success);

    nextBtn: ButtonBuilder = new ButtonBuilder()
        .setLabel("Next")
        .setCustomId("next")
        .setStyle(ButtonStyle.Success);

    row = new ActionRowBuilder();

    constructor(context: CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | Message, {
        items = [], pagemaker = () => new EmbedBuilder(), args = [], customRowMaker = () => undefined
    }: { items: object[]; pagemaker: Function; customRowMaker: Function; args: any[]; }) {
        this.context = context;

        this.items = items;
        this.pagemaker = pagemaker;
        this.customRowMaker = customRowMaker;
        this.args = args;

        this.init();
    }

    async init() {
        await this.update();

        const message = await this.context[this.context.deferred ? "editReply" : "reply"]({
            embeds: [this.embed],
            components: this.customRow == undefined ? [this.row] : [this.row, this.customRow]
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
                default:
                    return;
            };

            await this.update();

            await interaction.update({
                embeds: [this.embed],
                components: this.customRow == undefined ? [this.row] : [this.row, this.customRow]
            });
        });
    }

    async update() {
        this.embed = await this.pagemaker(this.items[this.crntPageIndex], ...this.args);
        this.customRow = await this.customRowMaker(this.items[this.crntPageIndex], ...this.args);

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