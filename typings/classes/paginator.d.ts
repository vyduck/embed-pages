export class CustomPaginator {
    /**
     *
     * @param { CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | Message } context
     * @param { Object } options
     * @param { Object[] } options.items
     * @param { Function } options.pagemaker
     */
    constructor(context: CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | Message, { items, pagemaker }: {
        items: any[];
        pagemaker: Function;
    });
    /**
     * @private
     * @type { CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | Message }
     */
    private context;
    /**
     * @private
     * @type {EmbedBuilder}
     */
    private embed;
    items: any[];
    pagemaker: Function;
    /**
     * @private
     * @type {Number}
     */
    private crntPageIndex;
    /**
     * @private
     * @type {ButtonBuilder}
     */
    private prevBtn;
    /**
     * @private
     * @type {ButtonBuilder}
     */
    private nextBtn;
    /**
     * @private
     * @type {ActionRowBuilder}
     */
    private row;
    /**
     * @private
     */
    private update;
}
