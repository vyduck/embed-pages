import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
export var PaginatorTypes;
(function (PaginatorTypes) {
    PaginatorTypes[PaginatorTypes["FieldPaginator"] = 0] = "FieldPaginator";
    PaginatorTypes[PaginatorTypes["CustomPaginator"] = 1] = "CustomPaginator";
})(PaginatorTypes || (PaginatorTypes = {}));
export function makeButtonRow(crntPage, totalPages) {
    return new ActionRowBuilder()
        .setComponents(new ButtonBuilder()
        .setEmoji("⏮️")
        .setCustomId("first")
        .setDisabled(crntPage == 1)
        .setStyle(ButtonStyle.Primary), new ButtonBuilder()
        .setEmoji("◀️")
        .setCustomId("prev")
        .setDisabled(crntPage == 1)
        .setStyle(ButtonStyle.Primary), new ButtonBuilder()
        .setLabel(`${crntPage}/${totalPages}`)
        .setCustomId("currentPage")
        .setStyle(ButtonStyle.Secondary), new ButtonBuilder()
        .setEmoji("▶️")
        .setCustomId("next")
        .setDisabled(crntPage == totalPages)
        .setStyle(ButtonStyle.Primary), new ButtonBuilder()
        .setEmoji("⏭️")
        .setCustomId("last")
        .setDisabled(crntPage == totalPages)
        .setStyle(ButtonStyle.Primary));
}
