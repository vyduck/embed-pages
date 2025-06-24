import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ComponentType, InteractionCollector, InteractionType, } from "discord.js";
import { PaginatorTypes } from "./basePaginator";
export class FieldPaginator {
    type = PaginatorTypes.FieldPaginator;
    baseEmbed;
    response;
    context;
    buttonRow = new ActionRowBuilder()
        .setComponents(new ButtonBuilder()
        .setEmoji(":track_previous:")
        .setCustomId("first")
        .setStyle(ButtonStyle.Secondary), new ButtonBuilder()
        .setEmoji(":arrow_backward:")
        .setCustomId("prev")
        .setStyle(ButtonStyle.Secondary), new ButtonBuilder()
        .setEmoji(":arrow_forward:")
        .setCustomId("next")
        .setStyle(ButtonStyle.Secondary), new ButtonBuilder()
        .setEmoji(":track_next:")
        .setCustomId("last")
        .setStyle(ButtonStyle.Secondary));
    items;
    pages;
    crntPageIndex = 0;
    fieldsPerPage;
    constructor(context, { baseEmbed, fieldsPerPage = 5, fields }) {
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
        if ((this.context.type === InteractionType.ApplicationCommand ||
            this.context.type === InteractionType.MessageComponent ||
            this.context.type === InteractionType.ModalSubmit) && this.context.deferred)
            this.response = await this.context.editReply({
                embeds: [this.baseEmbed],
                components: [this.buttonRow]
            });
        else
            this.response = await this.context.reply({
                embeds: [this.baseEmbed],
                components: [this.buttonRow]
            });
        const buttonCollector = new InteractionCollector(this.response.client, {
            message: this.response,
            componentType: ComponentType.Button,
        });
        buttonCollector.on("collect", async (interaction) => {
            switch (interaction.customId) {
                case "next":
                    this.crntPageIndex += 1;
                    break;
                case "prev":
                    this.crntPageIndex -= 1;
                    break;
            }
            ;
            this.update();
            interaction.update({
                embeds: [this.baseEmbed],
                components: [this.buttonRow]
            });
        });
    }
    /**
     * @private
     */
    update() {
        this.baseEmbed.setFields();
        for (let i = 0; i < this.fieldsPerPage; i++) {
            let field = this.items[this.crntPageIndex * this.fieldsPerPage + i];
            if (field == undefined)
                break;
            this.baseEmbed.addFields(field);
        }
        ;
        this.baseEmbed.setFooter({
            text: `${this.crntPageIndex + 1}/${this.pages.length}`
        });
        for (let i in this.buttonRow.components)
            this.buttonRow.components[i].setDisabled(false);
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
