const { SlashCommandBuilder } = require("@discordjs/builders");
const {
    EmbedBuilder,
    ActionRowBuilder,
    PermissionsBitField,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows the bot's help menu"),

    usage: "/help",
    description: "Shows the bot's help menu",
    category: "bot",

    async execute(interaction, bot) {
        const client = interaction.client;
        

        const { guild, user } = interaction;
        let query = interaction.options.get("filtre");

        if (!query) {
            interaction
                .reply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: client.user.username + " Help menu of the bot",
                                iconURL: bot.user.displayAvatarURL(),
                            })
                            .setDescription("> Please click on the **buttons** appropriate for the menu you want to get information about.\n\n> **Menus ↷**\n **Moderation →** You can get information about Moderation Commands.\n**Systems →** You can get information about Systems.\n\n> You can use the `/invite` command to add the bot or come to our support server.")
                            .setImage("https://cdn.discordapp.com/attachments/1259798141230776340/1271852274146218115/fff.png?ex=66b8d83c&is=66b786bc&hm=ae4023e14e3cae8df983924339677283243992774b67022b9d1ed0dfb35d3667&")
                            .setTimestamp()
                            .setThumbnail(
                                interaction.user.displayAvatarURL({ dynamic: true })
                            )
                            .setFooter({
                                text: "Best, Acord | 2024",
                                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                            })
                            .setColor("#8E2DE2")
                    ],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId("modsasa")
                                .setLabel(`\u200B`)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setCustomId("mod")
                                .setLabel(`Moderation`)
                                .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                                .setCustomId("sistem")
                                .setLabel(`Systems`)
                                .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                                .setCustomId("modsasaasdasd")
                                .setLabel(`\u200B`)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true),
                        ),
                    ],
                }).catch(() => { })
                .then(async (int) => {
                    const collector = int.createMessageComponentCollector({
                        time: 60_000,
                        componentType: ComponentType.Button,
                    });

                    collector.on("collect", async (i) => {
                        if (interaction.user.id !== i.user.id) {
                            await i.reply({
                                content: "Only the person who used the command can use this button.",
                                ephemeral: true,
                            });
                            return;
                        } else {
                            if (i.customId === "mod") {
                                i.update({
                                    embeds: [new EmbedBuilder()
                                        .setAuthor({ name: "Acord Bot | Moderation Menu", iconURL: client.user.avatarURL({ dynamic: true }) })
                                        .setDescription("# Welcome to the Moderation Menu\n> I am here to help and inform you about moderation commands.")
                                        .setThumbnail(
                                            interaction.user.displayAvatarURL({ dynamic: true })
                                        )
                                        .setTimestamp()
                                        .setFooter({ text: " Best, Acord | 2024", iconURL: interaction.user.displayAvatarURL({ dynamic: true }), })
                                        .setImage("https://cdn.discordapp.com/attachments/1259798141230776340/1271852274146218115/fff.png?ex=66b8d83c&is=66b786bc&hm=ae4023e14e3cae8df983924339677283243992774b67022b9d1ed0dfb35d3667&")
                                        .setColor("#3498DB")
                                        .addFields([
                                            {
                                                name: "**/ban**",
                                                value: "`user: reason:`",
                                                inline: true,
                                            },
                                            {
                                                name: "**/ban**",
                                                value: "`user: reason:`",
                                                inline: true,
                                            },
                                            {
                                                name: "**/ban**",
                                                value: "`user: reason:`",
                                                inline: true,
                                            },
                                            {
                                                name: "**/ban**",
                                                value: "`user: reason:`",
                                                inline: true,
                                            },
                                            {
                                                name: "**/ban**",
                                                value: "`user: reason:`",
                                                inline: true,
                                            },
                                            {
                                                name: "**/ban**",
                                                value: "`user: reason:`",
                                                inline: true,
                                            },
                                        ])
                                    ],
                                    components: [
                                        new ActionRowBuilder()
                                            .addComponents(
                                                new ButtonBuilder()
                                                    .setCustomId("as")
                                                    .setLabel(`\u200B`)
                                                    .setStyle(ButtonStyle.Secondary)
                                                    .setDisabled(true),
                                                new ButtonBuilder()
                                                    .setCustomId('geris')
                                                    .setLabel("Return")
                                                    .setStyle(ButtonStyle.Primary),
                                                new ButtonBuilder()
                                                    .setLabel("Support Server")
                                                    .setEmoji('<:acordnew:1271858808238641233>')
                                                    .setStyle(ButtonStyle.Link)
                                                    .setURL("https://discord.gg/8DH9xgzcmM"),
                                                new ButtonBuilder()
                                                    .setCustomId("xd")
                                                    .setLabel(`\u200B`)
                                                    .setStyle(ButtonStyle.Secondary)
                                                    .setDisabled(true),
                                            )
                                    ],
                                }).catch(() => { })
                            } else {
                                if (i.customId === "sistem") {

                                    i.update({
                                        embeds: [new EmbedBuilder()
                                            .setAuthor({ name: "Acord Bot | Moderation Menu", iconURL: client.user.avatarURL({ dynamic: true }) })
                                            .setDescription("# Welcome to the Systems menu\n> I am here to provide information and help you about systems.\n\n> You can justify the installation of the system you want using the **/systems** command.\n\n**Note:** If you want to reset the system after installing it, use the command again or use the `De-activate` button.")
                                            .setThumbnail(
                                                interaction.user.displayAvatarURL({ dynamic: true })
                                            )
                                            .setImage("https://cdn.discordapp.com/attachments/1259798141230776340/1271852274146218115/fff.png?ex=66b8d83c&is=66b786bc&hm=ae4023e14e3cae8df983924339677283243992774b67022b9d1ed0dfb35d3667&")
                                            .setTimestamp()
                                            .setFooter({
                                                text: "Best, Acord | 2024",
                                                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                                            })
                                            .setColor("#3498DB")
                                        ],
                                        components: [
                                            new ActionRowBuilder()
                                                .addComponents(
                                                    new ButtonBuilder()
                                                        .setCustomId("xdxd")
                                                        .setLabel(`\u200B`)
                                                        .setStyle(ButtonStyle.Secondary)
                                                        .setDisabled(true),
                                                    new ButtonBuilder()
                                                        .setCustomId('geris')
                                                        .setLabel("Return")
                                                        .setStyle(ButtonStyle.Primary),
                                                    new ButtonBuilder()
                                                        .setLabel("Support Server")
                                                        .setEmoji('<:acordnew:1271858808238641233>')
                                                        .setStyle(ButtonStyle.Link)
                                                        .setURL("https://discord.gg/8DH9xgzcmM"),
                                                    new ButtonBuilder()
                                                        .setCustomId("asasd")
                                                        .setLabel(`\u200B`)
                                                        .setStyle(ButtonStyle.Secondary)
                                                        .setDisabled(true),
                                                )
                                        ],
                                    }).catch(() => { })
                                } else {
                                    if (i.customId === "geris") {
                                        i.update({
                                            embeds: [
                                                new EmbedBuilder()
                                                    .setAuthor({
                                                        name: "Acord Help Menu",
                                                        iconURL: bot.user.displayAvatarURL(),
                                                    })
                                                    .setDescription("> Please click on the **buttons** appropriate for the menu you want to get information about.\n\n> **Menus ↷**\n **Moderation →** You can get information about Moderation Commands.\n**Systems →** You can get information about Systems.\n\n> You can use the `/invite` command to add the bot or come to our support server.")
                                                    .setImage("https://cdn.discordapp.com/attachments/1259798141230776340/1271852274146218115/fff.png?ex=66b8d83c&is=66b786bc&hm=ae4023e14e3cae8df983924339677283243992774b67022b9d1ed0dfb35d3667&")
                                                    .setTimestamp()
                                                    .setFooter({
                                                        text: "Best, Acord | 2024",
                                                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                                                    })
                                                    .setColor("#3498DB")
                                            ],
                                            components: [
                                                new ActionRowBuilder().addComponents(
                                                    new ButtonBuilder()
                                                        .setCustomId("xdxdxd")
                                                        .setLabel(`\u200B`)
                                                        .setStyle(ButtonStyle.Secondary)
                                                        .setDisabled(true),
                                                    new ButtonBuilder()
                                                        .setCustomId("mod")
                                                        .setLabel(`Moderation`)
                                                        .setStyle(ButtonStyle.Primary),
                                                    new ButtonBuilder()
                                                        .setCustomId("sistem")
                                                        .setLabel(`Systems`)
                                                        .setStyle(ButtonStyle.Primary),
                                                    new ButtonBuilder()
                                                        .setCustomId("aswesad")
                                                        .setLabel(`\u200B`)
                                                        .setStyle(ButtonStyle.Secondary)
                                                        .setDisabled(true),
                                                ),

                                            ],
                                        }).catch(() => { })
                                    }
                                }

                            }

                        }
                    });
                    collector.on("end", () => {
                        try {
                            int.edit({
                                content: interaction.language.süre,
                                components: []
                            }).catch(() => { })
                        } catch (err) { }
                    })
                });
        }
    }
};