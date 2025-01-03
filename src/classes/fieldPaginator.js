import { 
    ActionRowBuilder, 
    ButtonBuilder, 
    EmbedBuilder, 
    ButtonStyle, 

    Message, 
    CommandInteraction, 
    MessageComponentInteraction, 
    ModalSubmitInteraction, 
    
    ComponentType, 
    InteractionCollector,
} from "discord.js";

export class FieldPaginator {
    /** 
     * @private
     * @type {{name: String, value: String, inline: Boolean}[]} 
     */
    fields;

    /**
     * @private
     * @type {EmbedBuilder}
     */
    embed;

    /**
     * @private 
     * @type {Number} 
     */
    fieldsPerPage;

    /**
     * @private 
     * @type { CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | Message } 
     */
    context;

    /**
     * @private 
     * @type { Number } 
     */
    crntPageIndex = 0;

    /**
     * @private 
     * @type { Number } 
     */
    maxPageIndex;

    /** 
     * @private
     * @type { ButtonBuilder }
     */
    prevBtn = new ButtonBuilder()
        .setLabel("Previous")
        .setCustomId("prev")
        .setStyle(ButtonStyle.Success);

    /**
     * @private 
     * @type { ButtonBuilder } 
     */
    nextBtn = new ButtonBuilder()
        .setLabel("Next")
        .setCustomId("next")
        .setStyle(ButtonStyle.Success);

    /** 
     * @private
     * @type { ActionRowBuilder }
     */
    row = new ActionRowBuilder();

    /**
     * 
     * @param { CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | Message } context 
     * @param { Object } options 
     * @param { EmbedBuilder } options.baseEmbed
     * @param { Number } options.fieldsPerPage
     * @param { { name: String, value: String, inline?: Boolean }[] } options.fields
     */
    constructor(context, {
        baseEmbed,
        fieldsPerPage = 5,
        fields
    }) {
        if (context == undefined) throw new Error("A context must be provided for making a field paginator.");
        if (fields == undefined) throw new Error("Fields must be provided for making a field paginator.")

        this.context = context;
        this.fields = fields;
        this.fieldsPerPage = fieldsPerPage == 0 ? 5 : fieldsPerPage;
        this.embed = baseEmbed ?? new EmbedBuilder();

        this.maxPageIndex = Math.ceil(this.fields.length / this.fieldsPerPage) - 1;

        this.update();

        this.context[this.context.deferred ? "editReply" : "reply"]({
            embeds: [this.embed],
            components: [this.row]
        }).then(async (message) => {
            const buttonCollector = new InteractionCollector(
                message.client,
                {
                    message,
                    componentType: ComponentType.Button
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
                };

                this.update();

                interaction.update({
                    embeds: [this.embed],
                    components: [this.row]
                })
            })
        });
    }

    /**
     * @private
     */
    update() {
        this.embed.setFields();
        for (let i = 0; i < this.fieldsPerPage; i++) {
            let field = this.fields[this.crntPageIndex * this.fieldsPerPage + i];
            if (field == undefined) break;
            this.embed.addFields(field);
        };
        this.embed.setFooter({
            text: `${this.crntPageIndex+1}/${this.maxPageIndex+1}`
        })

        this.prevBtn.setDisabled(false);
        this.nextBtn.setDisabled(false);
        if (this.crntPageIndex == 0) this.prevBtn.setDisabled(true);
        if (this.crntPageIndex == this.maxPageIndex) this.nextBtn.setDisabled(true);
        this.row.setComponents(this.prevBtn, this.nextBtn);
    }
}