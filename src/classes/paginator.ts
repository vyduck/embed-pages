import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, EmbedBuilder, InteractionCollector, InteractionType, Message, StringSelectMenuBuilder } from "discord.js";
import { Context, Paginator, PaginatorTypes } from "./basePaginator";

export class CustomPaginator implements Paginator {
    type = PaginatorTypes.CustomPaginator
    context: Context;
    items: object[];
    baseEmbed: EmbedBuilder;

    buttonRow = new ActionRowBuilder<ButtonBuilder>()
        .setComponents(
            new ButtonBuilder()
                .setEmoji("⏮️")
                .setCustomId("first")
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setEmoji("◀️")
                .setCustomId("prev")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setEmoji("▶️")
                .setCustomId("next")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setEmoji("⏭️")
                .setCustomId("last")
                .setStyle(ButtonStyle.Danger)
        );

    crntPageIndex = 0;

    pages: EmbedBuilder[] = [];

    response: Message;

    pagemaker: (data: object, ...args: any[]) => Promise<EmbedBuilder> | EmbedBuilder;
    customRow: ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder> | undefined;
    customRowMaker: Function;

    args = [];

    constructor(context: Context, {
        items = [], pagemaker = (data) => new EmbedBuilder(), args = [], customRowMaker = () => undefined
    }: { items: object[]; pagemaker: (data: object) => Promise<EmbedBuilder> | EmbedBuilder; customRowMaker: Function; args: any[]; }) {
        this.context = context;

        this.items = items;
        this.pagemaker = pagemaker;
        this.customRowMaker = customRowMaker;
        this.args = args;

        this.init();
    }

    async init() {
        await this.update();

        if ((
            this.context.type === InteractionType.ApplicationCommand ||
            this.context.type === InteractionType.MessageComponent ||
            this.context.type === InteractionType.ModalSubmit

        ) && this.context.deferred) this.response = await this.context.editReply({
            embeds: [this.baseEmbed],
            components: [this.buttonRow]
        })
        else this.response = await (this.context.reply as Function)({
            embeds: [this.baseEmbed],
            components: [this.buttonRow]
        });

        const btnCollector = new InteractionCollector<ButtonInteraction>(
            this.response.client,
            {
                message: this.response,
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
                case "first":
                    this.crntPageIndex = 0;
                    break;
                case "last":
                    this.crntPageIndex = this.items.length - 1;
                    break;
                default:
                    return;
            };

            await this.update();

            await interaction.update({
                embeds: [this.baseEmbed],
                components: [this.buttonRow, this.customRow]
            });
        });
    }

    async update() {
        this.baseEmbed = await this.pagemaker(this.items[this.crntPageIndex], ...this.args);
        this.customRow = await this.customRowMaker(this.items[this.crntPageIndex], ...this.args);

        this.baseEmbed.setFooter({
            text: `${this.crntPageIndex + 1}/${this.items.length}`
        });

        for (let i in this.buttonRow.components) this.buttonRow.components[i].setDisabled(false);

        if (this.crntPageIndex == 0) {
            this.buttonRow.components[0].setDisabled(true);
            this.buttonRow.components[1].setDisabled(true);
        }
        if (this.crntPageIndex == this.pages.length - 1) {
            this.buttonRow.components[2].setDisabled(true);
            this.buttonRow.components[3].setDisabled(true);
        }
    }
}