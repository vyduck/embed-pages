import { ComponentType, InteractionCollector, InteractionType } from "discord.js";
import { makeButtonRow, PaginatorTypes } from "./basePaginator.js";
export class CustomPaginator {
    type = PaginatorTypes.CustomPaginator;
    crntPageIndex = 0;
    pages = [];
    constructor(context, options) {
        for (let item of options.items) {
            (async () => {
                const page = await options.pagemaker(item, ...options.args);
                this.pages.push(page);
            })();
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
        const btnCollector = new InteractionCollector(message.client, {
            message,
            componentType: ComponentType.Button
        });
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
                    this.crntPageIndex = this.pages.length - 1;
                    break;
                default:
                    return;
            }
            ;
            await interaction.update({
                embeds: [this.pages[this.crntPageIndex]],
                components: [makeButtonRow(this.crntPageIndex + 1, this.pages.length)]
            });
        });
    }
}
