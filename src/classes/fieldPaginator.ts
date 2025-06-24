import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    ButtonStyle,

    ComponentType,
    InteractionCollector,
    Message,
    EmbedField,
    InteractionType,
    ButtonInteraction,
} from "discord.js";

import { Context, Paginator, PaginatorTypes } from "./basePaginator.js";

export class FieldPaginator implements Paginator {
    type = PaginatorTypes.FieldPaginator;
    baseEmbed: EmbedBuilder;

    response: Message<boolean>;
    context: Context;
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
                .setLabel("/")
                .setCustomId("currentPage")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setEmoji("▶️")
                .setCustomId("next")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setEmoji("⏭️")
                .setCustomId("last")
                .setStyle(ButtonStyle.Danger)
        );


    pages: EmbedBuilder[] = [];
    crntPageIndex = 0;

    items: EmbedField[];
    fieldsPerPage: number;

    constructor(context: Context, {
        baseEmbed,
        fieldsPerPage = 5,
        fields
    }: { baseEmbed: EmbedBuilder; fieldsPerPage: number; fields: EmbedField[]; }) {
        this.context = context;
        this.items = fields;
        this.fieldsPerPage = fieldsPerPage == 0 ? 5 : fieldsPerPage;
        this.baseEmbed = baseEmbed ?? new EmbedBuilder();

        let i = 0;
        while (fields.length > 0) {
            this.pages[i] = EmbedBuilder.from(this.baseEmbed).setFields(...fields.slice(0, this.fieldsPerPage));
            fields = fields.slice(this.fieldsPerPage);
            i++;
        }

        this.init();
    }

    async init() {
        this.update();

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

        const buttonCollector = new InteractionCollector<ButtonInteraction>(
            this.response.client,
            {
                message: this.response,
                componentType: ComponentType.Button,
            }
        );

        buttonCollector.on("collect", async (interaction) => {
            switch (interaction.customId) {
                case "next":
                    this.crntPageIndex += 1;
                    break;
                case "prev":
                    this.crntPageIndex -= 1;
                    break
                case "first":
                    this.crntPageIndex = 0;
                    break;
                case "last":
                    this.crntPageIndex = this.pages.length - 1;
                    break;
            };

            this.update();

            interaction.update({
                embeds: [this.pages[this.crntPageIndex]],
                components: [this.buttonRow]
            })
        })
    }

    /**
     * @private
     */
    update() {
        for (let i = 0; i < this.fieldsPerPage; i++) {
            let field = this.items[this.crntPageIndex * this.fieldsPerPage + i];
            if (field == undefined) break;
            this.baseEmbed.addFields(field);
        };
        this.baseEmbed.setFooter({
            text: `${this.crntPageIndex + 1}/${this.pages.length}`
        })

        for (let i in this.buttonRow.components) this.buttonRow.components[i].setDisabled(false);

        if (this.crntPageIndex == 0) {
            this.buttonRow.components[0].setDisabled(true);
            this.buttonRow.components[1].setDisabled(true);
        }
        if (this.crntPageIndex == this.pages.length - 1) {
            this.buttonRow.components[3].setDisabled(true);
            this.buttonRow.components[4].setDisabled(true);
        }
        this.buttonRow.components[2].setLabel(`${this.crntPageIndex + 1}/${this.pages.length}`);
        this.buttonRow.components[2].setDisabled(true);
    }
}