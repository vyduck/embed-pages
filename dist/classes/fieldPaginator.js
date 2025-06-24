import { EmbedBuilder, ComponentType, InteractionCollector, InteractionType, } from "discord.js";
import { makeButtonRow, PaginatorTypes } from "./basePaginator.js";
export class FieldPaginator {
    type = PaginatorTypes.FieldPaginator;
    baseEmbed;
    response;
    pages = [];
    crntPageIndex = 0;
    items;
    fieldsPerPage;
    constructor(context, { baseEmbed, fieldsPerPage = 5, fields }) {
        this.items = fields;
        this.fieldsPerPage = fieldsPerPage == 0 ? 5 : fieldsPerPage;
        this.baseEmbed = baseEmbed ?? new EmbedBuilder();
        let i = 0;
        while (fields.length > 0) {
            this.pages[i] = EmbedBuilder.from(this.baseEmbed).setFields(...fields.slice(0, this.fieldsPerPage));
            fields = fields.slice(this.fieldsPerPage);
            i++;
        }
        this.init(context);
    }
    async init(context) {
        let message;
        if ((context.type === InteractionType.ApplicationCommand ||
            context.type === InteractionType.MessageComponent ||
            context.type === InteractionType.ModalSubmit) && context.deferred)
            message = await context.editReply({
                embeds: [this.pages[this.crntPageIndex]],
                components: [makeButtonRow(this.crntPageIndex + 1, this.pages.length)]
            });
        else
            message = await context.reply({
                embeds: [this.pages[this.crntPageIndex]],
                components: [makeButtonRow(this.crntPageIndex + 1, this.pages.length)]
            });
        const buttonCollector = new InteractionCollector(message.client, {
            message,
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
                case "first":
                    this.crntPageIndex = 0;
                    break;
                case "last":
                    this.crntPageIndex = this.pages.length - 1;
                    break;
            }
            ;
            interaction.update({
                embeds: [this.pages[this.crntPageIndex]],
                components: [makeButtonRow(this.crntPageIndex + 1, this.pages.length)]
            });
        });
    }
}
