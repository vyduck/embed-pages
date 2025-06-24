import {
    EmbedBuilder,
    
    ComponentType,
    InteractionCollector,
    Message,
    EmbedField,
    InteractionType,
    ButtonInteraction,
} from "discord.js";

import { Context, makeButtonRow, Paginator, PaginatorTypes } from "./basePaginator.js";

export class FieldPaginator implements Paginator {
    type = PaginatorTypes.FieldPaginator;
    baseEmbed: EmbedBuilder;

    response: Message<boolean>;
    
    pages: EmbedBuilder[] = [];
    crntPageIndex = 0;

    items: EmbedField[];
    fieldsPerPage: number;

    constructor(context: Context, {
        baseEmbed,
        fieldsPerPage = 5,
        fields
    }: { baseEmbed: EmbedBuilder; fieldsPerPage: number; fields: EmbedField[]; }) {
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

    async init(context: Context) {
        let message: Message;

        if ((
            context.type === InteractionType.ApplicationCommand ||
            context.type === InteractionType.MessageComponent ||
            context.type === InteractionType.ModalSubmit
        ) && context.deferred) message = await context.editReply({
            embeds: [this.pages[this.crntPageIndex]],
            components: [makeButtonRow(this.crntPageIndex + 1, this.pages.length)]
        });
        else message = await (context.reply as Function)({
            embeds: [this.pages[this.crntPageIndex]],
            components: [makeButtonRow(this.crntPageIndex + 1, this.pages.length)]
        });

        const buttonCollector = new InteractionCollector<ButtonInteraction>(
            message.client,
            {
                message,
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

            interaction.update({
                embeds: [this.pages[this.crntPageIndex]],
                components: [makeButtonRow(this.crntPageIndex + 1, this.pages.length)]
            })
        })
    }
}