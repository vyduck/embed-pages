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

export class fieldPaginator {
    /** 
     * @private
     * @type {{name: String, value: String, inline: Boolean}[]} 
     * */
    fields;

    /**
     * @private
     * @type {EmbedBuilder}
     * */
    baseEmbed;

    /**
     * @private 
     * @type {Number} 
     * */
    fieldsPerPage;

    /**
     * @private 
     * @type { CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | Message} 
     * */
    context;

    /**
     * @private 
     * @type {Number} 
     * */
    currentPageNumber = 0;

    /**
     * @private 
     * @type {Number} 
     * */
    maxPageNumber;

    /** 
     * @private
     * @type {ButtonBuilder}
     * */
    prevBtn = new ButtonBuilder()
        .setLabel("Previous")
        .setCustomId("prev")
        .setStyle(ButtonStyle.Success);

    /**
     * @private 
     * @type {ButtonBuilder} 
     * */
    nextBtn = new ButtonBuilder()
        .setLabel("Next")
        .setCustomId("next")
        .setStyle(ButtonStyle.Success);

    /** 
     * @private
     * @type {ActionRowBuilder}
     * */
    row = new ActionRowBuilder();

    /**
     * 
     * @param { CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | Message } context 
     * @param { Object } options 
     * @param { EmbedBuilder } options.baseEmbed
     * @param { Number } options.fieldsPerPage
     * @param { { name: String, value: String, inline?: Boolean }[] }
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
        this.baseEmbed = baseEmbed ?? new EmbedBuilder();

        this.maxPageNumber = Math.ceil(this.fields.length / this.fieldsPerPage) - 1;

        this.update();

        this.context[this.context.deferred ? "editReply" : "reply"]({
            embeds: [this.baseEmbed],
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
                        this.currentPageNumber += 1;
                        break;
                    case "prev":
                        this.currentPageNumber -= 1;
                        break
                };

                this.update();

                interaction.update({
                    embeds: [this.baseEmbed],
                    components: [this.row]
                })
            })
        });
    }

    /**
     * @private
     */
    update() {
        this.baseEmbed.setFields();
        for (let i = 0; i < this.fieldsPerPage; i++) {
            let field = this.fields[this.currentPageNumber * this.fieldsPerPage + i];
            if (field == undefined) break;
            this.baseEmbed.addFields(field);
        };
        this.baseEmbed.setFooter({
            text: `${this.currentPageNumber+1}/${this.maxPageNumber+1}`
        })

        this.prevBtn.setDisabled(false);
        this.nextBtn.setDisabled(false);
        if (this.currentPageNumber == 0) this.prevBtn.setDisabled(true);
        if (this.currentPageNumber == this.maxPageNumber) this.nextBtn.setDisabled(true);
        this.row.setComponents(this.prevBtn, this.nextBtn);
    }
}