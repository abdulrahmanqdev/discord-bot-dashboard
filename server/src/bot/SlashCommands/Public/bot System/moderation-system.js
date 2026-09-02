const { SlashCommandBuilder } = require("@discordjs/builders");
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ComponentType,
    ButtonStyle,
    ChannelType,
    StringSelectMenuBuilder,
    ChannelSelectMenuBuilder,
    PermissionsBitField,
    ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType,
    RoleSelectMenuBuilder,
    Embed
} = require("discord.js");
const kick = require("../../../kick/kick.js");
const CreateDataPack = require("../../../Handlers/createData.js")
const { db } = require("../../../tools.js");
const client = require("../../../../base/bot.js").client

client.kickManager = new kick()
module.exports = {
    data: new SlashCommandBuilder()
        .setName("moderation-system")
        .setDescription("Performs the installation of moderation systems"),

    usage: "/moderation-system",
    description: "Performs the installation of moderation systems",
    category: "system",

    async execute(i, bot) {
        const { guild } = i;

        if (!i.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return i.reply({ content: "> You need `Administrator` permission to use this command", ephemeral: true }).catch(() => { });
        } 

        const datas = {
            kick: new CreateDataPack({
                channel: null,
                kick: null
            })
        }
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("🔒 | Caps lock")
                .setCustomId("caps")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setLabel("🔎 | Kick notification")
                .setCustomId("kick")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setLabel("📤 | Welcome System")
                .setCustomId("welcome")
                .setStyle(ButtonStyle.Secondary),
        );

        const embed = new EmbedBuilder()
            .setDescription("# Welcome to the moderation menu\n> You can set the necessary **moderation systems** from the button below.\n\n**NOTE: ** Use the /moderation-restart command to reset the systems")
            .setColor("#69caf0")
            .setThumbnail(bot.user.avatarURL({ dynamic: true }))
            .setFooter({ text: `Using the command ${i.user.username}`, iconURL: i.user.avatarURL({ dynamic: true }) });

        const message = await i.reply({
            embeds: [embed],
            components: [row],
            fetchReply: true,
        }).catch(() => { })

        const collector = message.createMessageComponentCollector({
            time: 60_000,
            componentType: ComponentType.Button,
        })
        const endingDate = Date.now() + 900000
        collector.on("collect", async (i) => {
            if (i.user.id !== i.user.id) {
                return i.reply({ content: "Only the command user can use this.", ephemeral: true }).catch(() => { })
            }
            if (i.customId === "kick") {
                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel("Add").setCustomId("kick-add"),
                    new ButtonBuilder().setStyle(ButtonStyle.Secondary).setLabel("Listed").setCustomId("kick-list"),
                    new ButtonBuilder().setStyle(ButtonStyle.Secondary).setLabel("Return").setCustomId("return")
                )

                const Bot = new EmbedBuilder()
                    .setDescription("# Welcome to  the Kick setup menu\n- You can make adjustments from the Add button below.\n- You can also make listings by pressing the List button.\n\n**Note:** For publisher deletion operations, you can press the listing and delete with the buttons that appear.")
                    .setFooter({ text: i.user.username + "Requested By", iconURL: i.user.avatarURL() })
                    .setThumbnail(bot.user.avatarURL({ dynamic: true }))
                    .setColor("#3498DB");

             await i.update({ embeds: [Bot], components: [row] }).catch(() => { })
            }

            if (i.customId === "kick-add") {
                datas.kick.clear()
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ChannelSelectMenuBuilder()
                            .setCustomId('kick_msgchannel')
                            .setPlaceholder("Select channel for kick notification system")
                            .setChannelTypes([ChannelType.GuildText, ChannelType.GuildAnnouncement])
                    );

                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('geri-kick')
                            .setLabel("Return")
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel("Streamer").setCustomId("kick_streamerselection"),
                        new ButtonBuilder().setStyle(ButtonStyle.Primary).setDisabled(true).setLabel("Confirm").setCustomId("kick_send"),
                        new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Support Server").setEmoji('<:acordnew:1271858808238641233>').setURL("https://github.com"),
                    )

                await i.update({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: "Kick streamer control panel",
                                iconURL: i.guild.iconURL({ dynamic: true } || "https://cdn.discordapp.com/avatars/1244210949452468316/e1051b6c8f38776a598a70d3f1b8b821.webp")
                            })
                            .setDescription(`# Welcome to the kick streamer panel\n- You can set up the kick system using the buttons and menu below.\n\n**NOTE:** You can only enter 1 streamer, you need to buy premium for more`)
                            .setColor("#3498DB")
                    ],
                    components: [row, row2]
                }).catch(() => { })
                if (i.sendedAndAdded) {

                    await i.followUp({
                        embeds: [
                            new EmbedBuilder().setColor("Green").setAuthor({
                                name: "Acord Bot | " + "Kick Notification System", iconURL: i.guild.iconURL({ dynamic: true || "https://cdn.discordapp.com/avatars/1244210949452468316/e1051b6c8f38776a598a70d3f1b8b821.webp" }),
                                iconURL: i.user.displayAvatarURL()
                            })
                                .setDescription("> Kick notification system has been successfully installed. The installed system data is given below")
                                .addFields([
                                    { name: "Set Channel ID ↷", value: "\`\`\`" + i.sendedAndAdded[1] + ` (${client.channels.cache.get(i.sendedAndAdded[1]).name})` + "\`\`\`" },
                                    { name: "Set Streamer Name ↷", value: "\`\`\`" + i.sendedAndAdded[0] + "\`\`\`" }
                                ])
                        ], ephemeral: true, components: [
                            new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel("Visit")
                                        .setStyle(ButtonStyle.Link)
                                        .setURL("https://kick.com/" + i.sendedAndAdded[0])
                                )
                        ]
                    }).catch(() => { })
                }
            }

            if (i.customId === "kick-list") {
                await i.deferReply({
                    ephemeral: true
                })
                var data = await db.get("kick/" + i.guild.id) || {}
                const obj = Object.keys(data)
                const kickProfiles = await Promise.all(obj.map(async (s) => {
                    const streamerProfile = await client.kickManager.getStreamer(s)
                    return streamerProfile
                }))
                if (obj.length == 0) return i.editReply({
                    embeds: [
                        new EmbedBuilder().setColor("Red").setAuthor({
                            name: "You haven't added any streamer.",
                            iconURL: i.user.displayAvatarURL()
                        }).setDescription("I can't list the streamer because you haven't uploaded any streamer.").setFooter({
                            text: "Kick Notification System (0)",
                            iconURL: client.user.avatarURL()
                        }).setTimestamp()
                    ]
                }).catch(() => { })
                var page = 1;
                var streamerData = kickProfiles[page - 1]
                const embed = new EmbedBuilder().setColor("Green").setAuthor({
                    name: data[obj[page - 1]].streamer,
                    iconURL: streamerData?.user?.profile_pic
                }).setTitle(streamerData?.user?.username).setDescription("> Biography: **" + streamerData?.user?.bio || "Not Found." + "**\n\n> User name: **" + streamerData?.user?.username || "Not Found." + "**\n> Account Creation: <t:" + Math.floor(new Date(streamerData?.user?.email_verified_at).getTime() / 1000) + ">\n\n> :warning: Notification channel: <#" + `#${data[obj[page - 1]].channel}` + ">\nYou can change your activity status below.").setFooter({
                    text: "Kick Notification System (1/" + obj.length + ")",
                    iconURL: client.user.avatarURL()
                }).setTimestamp()

                let btns = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setStyle(ButtonStyle.Primary).setEmoji("⬅").setCustomId("prev-k").setDisabled((page == 1) ? true : false),
                    new ButtonBuilder().setStyle(ButtonStyle.Primary).setEmoji("➡").setCustomId("next-k").setDisabled((obj.length > 1) ? false : true),
                    new ButtonBuilder().setStyle((data[obj[page - 1]]?.status == "off") ? ButtonStyle.Danger : ButtonStyle.Success).setLabel((data[obj[page - 1]]?.status == "off") ? "Activate" : "Close").setCustomId((data[obj[page - 1]]?.status == "off") ? ("on-" + obj[page - 1]) : ("off-" + obj[page - 1])),
                    new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel("Delete").setCustomId("sil-" + obj[page - 1])
                )
                const x = await i.editReply({
                    embeds: [embed],
                    components: [
                        btns
                    ]
                }).catch(() => { })
                const filter = () => {
                    return true
                };
                const newCollector = x.createMessageComponentCollector({ filter, time: (endingDate - Date.now()) });

                newCollector.on("collect", async (newI) => {
                    if (newI.isButton()) {
                        if (newI.customId == "prev-k" || newI.customId == "next-k") {
                            if (newI.customId == "prev-k") {
                                page--
                            } else {
                                page++
                            }
                            var streamerData = kickProfiles[page - 1]
                            if (!data[obj[page - 1]]) {

                                return newI.update({
                                    embeds: [
                                        new EmbedBuilder().setColor("Red").setAuthor({
                                            name: "You haven't added any streamer.",
                                            iconURL: i.user.displayAvatarURL()
                                        }).setDescription("I can't list the streamer because you haven't uploaded any streamer.").setTimestamp()
                                    ],
                                    components: [],
                                    files: []
                                }).catch(() => { })
                            }
                            const embed = new EmbedBuilder().setColor("Green").setAuthor({
                                name: data[obj[page - 1]].streamer,
                                iconURL: streamerData?.user?.profile_pic
                            }).setTitle(streamerData?.user?.username).setDescription("> Biography: **" + streamerData?.user?.bio || "Not Found." + "**\n\n> User name: **" + streamerData?.user?.username || "Not Found." + "**\n> Account Creation: <t:" + Math.floor(new Date(streamerData?.user?.email_verified_at).getTime() / 1000) + ">\n\n> :warning: Notification channel: <#" + `#${data[obj[page - 1]].channel}` + ">\nYou can change your activity status below.").setFooter({
                                text: "Kick Notification System (1/" + obj.length + ")",
                                iconURL: client.user.avatarURL()
                            }).setTimestamp()
                            let btns = new ActionRowBuilder().addComponents(
                                new ButtonBuilder().setStyle(ButtonStyle.Primary).setEmoji("⬅").setCustomId("prev-k").setDisabled((page == 1) ? true : false),
                                new ButtonBuilder().setStyle(ButtonStyle.Primary).setEmoji("➡").setCustomId("next-k").setDisabled((obj.length == page) ? true : false),
                                new ButtonBuilder().setStyle((data[obj[page - 1]]?.status == "off") ? ButtonStyle.Danger : ButtonStyle.Success).setLabel((data[obj[page - 1]]?.status == "off") ? "Active" : "Close").setCustomId((data[obj[page - 1]]?.status == "off") ? ("on-" + obj[page - 1]) : ("off-" + obj[page - 1])),
                                new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel("Delete").setCustomId("sil-" + obj[page - 1])
                            )

                            try {
                                newI.update({
                                    embeds: [embed],
                                    components: [btns]
                                })
                            } catch (err) { }

                        } else {
                            if (newI.customId.startsWith("on") || newI.customId.startsWith("off")) {
                                const processes = newI.customId.split("-")
                                const proc = processes[0]
                                const streamer = processes[1]
                                if (proc == "on") {
                                    await db.set("kick/" + i.guild.id + "/" + streamer + "/enabled", "on")
                                } else if (proc == "off") {
                                    await db.set("kick/" + i.guild.id + "/" + streamer + "/enabled", "off")
                                }
                                try {
                                    newI.message.components[0].components[2].data.style = ((proc == "on") ? 3 : 4)
                                    newI.message.components[0].components[2].data.label = ((proc == "on") ? "Close" : "Activate")
                                    newI.message.components[0].components[2].data.custom_id = ((proc == "on") ? ("off-" + streamer) : ("on-" + streamer))
                                    await newI.update({
                                        components: newI.message.components
                                    })
                                    data = await db.get("kick/" + i.guild.id)
                                } catch (err) { }
                            } else if (newI.customId.startsWith("sil")) {

                                const streamer = newI.customId.split("-")[1]
                                await db.delete("kick/" + i.guild.id + "/" + streamer)

                                var i = newI
                                page = 2
                                i.isButton = () => {
                                    return true
                                }
                                i.customId = "prev-k"
                                delete data[streamer]

                                newCollector.emit("collect", (i))

                            }
                        }
                    }
                })
            }

            if (i.customId === "kick_streamerselection") {
                const modal = new ModalBuilder()
                    .setCustomId("kick-streamer-selection-modal")
                    .setTitle("Streamer Name");

                const channel = new TextInputBuilder()
                    .setCustomId("kick-streamer-info")
                    .setLabel("Streamer Nickname")
                    .setStyle(TextInputStyle.Short);

                const row = new ActionRowBuilder().addComponents(channel);
                modal.addComponents(row);

                await i.showModal(modal).catch(err => { });

                const response = await i.awaitModalSubmit({ time: 60000 }).catch(() => { });
                if (!response) return i.followUp({ content: "Yanıt alınamadı. Lütfen tekrar deneyin.", ephemeral: true }).catch(() => { })
                if (response) {
                    const streamerName = response.fields.getTextInputValue("kick-streamer-info");
                    const streamer = await client.kickManager.getStreamer(streamerName);
                    await response.deferReply({ ephemeral: true }).catch(() => { });
                    if (streamer) {
                        datas.kick.set("kick", streamerName);
                        datas.kick.channel = i.channelId;
                        let buttons = response.message.components[1].components.map(button => {
                            return ButtonBuilder.from(button);
                        });
                        buttons[1] = new ButtonBuilder()
                            .setCustomId("kick_streamerselection")
                            .setLabel("Streamer")
                            .setStyle(ButtonStyle.Success);
                        if (datas.kick.channel) {
                            buttons[2] = new ButtonBuilder()
                                .setCustomId("kick_send")
                                .setLabel("Confirm")
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(false);
                        }
                        await response.message.edit({
                            components: [
                                new ActionRowBuilder().addComponents(buttons)
                            ]
                        }).catch(() => { })
                        response.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Green")
                                    .setAuthor({
                                        name: streamer?.user?.username,
                                        iconURL: streamer?.user?.profile_pic
                                    })
                                    .setTitle("Successful")
                                    .setDescription(`**${streamer?.user?.username}** The transaction was completed successfully`)
                                    .setThumbnail(streamer?.user?.profile_pic)
                            ],
                            ephemeral: true
                        }).catch(err => console.error("Edit Reply Error:", err));
                    } else {
                        response.editReply({ content: ":x: No such streamer found.", ephemeral: true }).catch(err => { });
                    }
                }
            }

            if (i.customId === "geri-kick") {
                var i = i;
                i.isStringSelectMenu = () => {
                    return true
                }
                i.values = ["e"]
                i.customId = "select"
                collector.emit("collect", (i))
            }

            if (i.customId === "kick_send") {
                var allKicks = await db.get("kick/" + i.guild.id) || {}
                allKicks = Object.keys(allKicks).length

                if (allKicks >= 1) {
                    return i.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Unsuccessful")
                                .setDescription(":x: | You need premium to add more than 1 streamer.")
                                .setColor("Red")
                                .setFooter({
                                    text: "The person using the command",
                                    iconURL: i.user.avatarURL({ dynamic: true } || client.user.avatarURL({ dynamic: true }))
                                })
                        ],
                        ephemeral: true,
                        components: [
                            new ActionRowBuilder()
                                .setComponents(
                                    new ButtonBuilder()
                                        .setStyle(ButtonStyle.Link)
                                        .setLabel("Support Server")
                                        .setURL("https://github.com")
                                )
                        ]
                    }).catch(() => { })
                }

                i.reply({
                    content: "> System **successfully** approved",
                    ephemeral: true
                }).catch(() => { })

                await db.set("kick/" + i.guild.id + "/" + datas.kick.kick, {
                    addedAt: Date.now(),
                    addedBy: i.user.id,
                    streamer: datas.kick.kick,
                    streamId: null,
                    channel: datas.kick.channel
                })

                var i = i;
                i.isStringSelectMenu = () => {
                    return false
                }
                i.isButton = () => {
                    return true
                }
                i.customId = "kick-add"
                i.sendedAndAdded = [
                    datas.kick.kick,
                    datas.kick.channel
                ]
                collector.emit("collect", (i))

            }

            if (i.customId === "welcome") {
                const row1 = new ActionRowBuilder()
                    .addComponents(
                        new ChannelSelectMenuBuilder()
                            .setCustomId('welcome_channel')
                            .setPlaceholder("Select channel for Welcome log channel")
                            .setChannelTypes(ChannelType.GuildText)
                            .setDisabled(
                                (await db.fetch(`welcomeSetup/` + guild.id + `/enabled`) === "on") ||
                                (await db.fetch(`welcomeSetup/` + guild.id + `/channel`) !== null)
                            )
                    );

                const row3 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('aktifs')
                            .setLabel("🟢 | Active")
                            .setStyle(ButtonStyle.Success)
                            .setDisabled(await db.fetch(`welcomeSetup/` + guild.id + `/enabled`) === "on"),
                        new ButtonBuilder()
                            .setCustomId('de-aktifs')
                            .setLabel("🔴 | Deactive")
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(await db.fetch(`welcomeSetup/` + guild.id + `/enabled`) !== "on"),
                        new ButtonBuilder()
                            .setLabel("🔎 | Reset System")
                            .setCustomId("welcome_reset")
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(await db.fetch(`welcomeSetup/` + guild.id + `/enabled`) !== "on"),
                        new ButtonBuilder()
                            .setCustomId('return')
                            .setLabel("Return")
                            .setStyle(ButtonStyle.Secondary)
                    );

                const Bot = new EmbedBuilder()
                    .setDescription("# Welcome to the system\n> To install the system, first select the welcome channel\n> Then activate it by pressing the `Active` system.\n\n**NOTE**: Use the command again to reset the system")
                    .setFooter({ text: i.user.username + " Requested By", iconURL: i.user.avatarURL() })
                    .setThumbnail(i.user.avatarURL({ dynamic: true } || client.user.avatarURL({})))
                    .setColor("#3498DB");

                await i.update({ embeds: [Bot], components: [row1, row3] }).catch(() => { });
            }

            if (i.customId === "caps") {
                const capsData = await db.get(`moderation-system/capsSystem/${guild.id}`);
                const isSystemActive = capsData?.enabled === "on";
                if (!capsData || !("enabled" in capsData)) {
                    const firstSetupEmbed = new EmbedBuilder()
                        .setTitle("⚙️ Caps Lock System Setup")
                        .setDescription(`> ❗ **Caps Lock System has not been configured yet.**\n> Please set a log channel and configure the threshold.`)
                        .setColor("Yellow")
                        .setThumbnail(bot.user.avatarURL({ dynamic: true }))
                        .setFooter({ text: `Using the command ${i.user.username}`, iconURL: i.user.avatarURL({ dynamic: true }) });
                    const channelSelectRow = new ActionRowBuilder().addComponents(
                        new ChannelSelectMenuBuilder()
                            .setCustomId('caps_channel')
                            .setPlaceholder("Select a channel for the system")
                            .setChannelTypes(ChannelType.GuildText)
                    );
                    const thresholdRow = new ActionRowBuilder().addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('caps_threshold')
                            .setPlaceholder('Select a caps lock threshold')
                            .addOptions(
                                { label: '10%', value: '10' },
                                { label: '20%', value: '20' },
                                { label: '30%', value: '30' },
                                { label: '50%', value: '50' },
                                { label: '70%', value: '70' }
                            )
                    );
                    const setupRow = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setLabel("🟢 | Active")
                            .setCustomId("caps_active")
                            .setStyle(ButtonStyle.Success)
                            .setDisabled(isSystemActive),
                        new ButtonBuilder()
                            .setLabel("🔴 | Deactivate")
                            .setCustomId("caps_deactive")
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(!isSystemActive),
                        new ButtonBuilder()
                            .setLabel("🔎 | Reset System")
                            .setCustomId("caps_reset")
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setLabel("⬅️")
                            .setCustomId("return")
                            .setStyle(ButtonStyle.Secondary)
                    );
                    return await i.update({
                        embeds: [firstSetupEmbed],
                        components: [channelSelectRow, thresholdRow, setupRow]
                    }).catch(() => { });
                }
                const capsSetupRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel("🟢 | Active")
                        .setCustomId("caps_active")
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(isSystemActive),
                    new ButtonBuilder()
                        .setLabel("🔴 | Deactivate")
                        .setCustomId("caps_deactive")
                        .setStyle(ButtonStyle.Danger)
                        .setDisabled(!isSystemActive),
                    new ButtonBuilder()
                        .setLabel("🔎 | Reset System")
                        .setCustomId("caps_reset")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setLabel("⬅️")
                        .setCustomId("return")
                        .setStyle(ButtonStyle.Secondary)
                );
                const thresholdRow = new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('caps_thresholds')
                        .setPlaceholder('Select a caps lock threshold')
                        .addOptions(
                            { label: '10%', value: '10' },
                            { label: '20%', value: '20' },
                            { label: '30%', value: '30' },
                            { label: '50%', value: '50' },
                            { label: '70%', value: '70' }
                        )
                );
                const threshold = capsData?.threshold || "Not Set";
                const logChannel = capsData?.channel ? `<#${capsData.channel}>` : "Not Set";
                const statusText = isSystemActive ? "🟢 Active" : "🔴 Deactivate";
                const capsEmbed = new EmbedBuilder()
                    .setTitle("⚙️ Caps Lock System Setup")
                    .setDescription(`> Log Channel: ${logChannel}\n> Threshold: **${threshold}%**\n> Status: **${statusText}**`)
                    .setColor(isSystemActive ? "Green" : "Red")
                    .setThumbnail(bot.user.avatarURL({ dynamic: true }))
                    .setFooter({ text: `Using the command ${i.user.username}`, iconURL: i.user.avatarURL({ dynamic: true }) });
                await i.update({
                    embeds: [capsEmbed],
                    components: [thresholdRow, capsSetupRow]
                }).catch(() => { });
            }

            if (i.customId === "return") {
                await i.update({ embeds: [embed], components: [row] }).catch(() => { })
            }
        });

        const channelCollector = message.createMessageComponentCollector({
            time: 60_000,
            componentType: ComponentType.ChannelSelect,
        });

        channelCollector.on("collect", async (i) => {
            if (i.user.id !== i.user.id) {
                return i.reply({ content: "Only the command user can use this.", ephemeral: true }).catch(() => { })
            }

            if (i.customId === "caps_channel") {
                const selectedChannel = i.values[0];

                await db.set(`moderation-system/capsSystem/${guild.id}`, {
                    channel: selectedChannel,
                    enabled: "off",
                    user: i.user.id,
                });

                await i.reply({ content: "✅ Channel successfully set! You can now activate the system.", ephemeral: true }).catch(() => { })
            }

            if (i.customId === "welcome_channel") {
                const channel = i.values[0]
                i.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Successful")
                            .setDescription(`> Kanal başarılı bir şekilde <#${channel}> olarak ayarlandı.`)
                            .setColor("Green")
                            .setFooter({
                                text: i.user.username + " Requested By",
                                iconURL: i.user.avatarURL({ dynamic: true } || client.user.avatarURL({ dynamic: true }))
                            })
                    ],
                    ephemeral: true
                }).catch(() => { })

                await db.set(`welcomeSetup/` + guild.id, {
                    user: i.user.id,
                    channel: i.values[0]
                })
            }

            if (i.customId === "kick_msgchannel") {
                datas.kick.set("channel", i.values[0])
                if (datas?.kick?.kick) {
                    i.message.components[1].components[2].data.disabled = false
                }
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ChannelSelectMenuBuilder()
                            .setCustomId('kick_msgchannel')
                            .setPlaceholder("Select the channel where the kick broadcast notification will be sent.")
                            .setChannelTypes(ChannelType.GuildText)
                            .setDefaultChannels(i.values[0])
                    );
                await i.update({ components: [row, i.message.components[1]] }).catch(() => { })
                i.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Green")
                            .setTitle("Successful")
                            .setDescription(":white_check_mark: | The channel has been set successfully. When the broadcaster is selected, you can add the broadcaster by pressing the confirm button.")
                            .addFields([
                                { name: "> It was determined as. When the streamer is selected, you can add the streamer by pressing the send button.", value: "\`\`\`" + i.values[0] + ` | (${client.channels.cache.get(i.values[0]).name})` + "\`\`\`" }
                            ])
                    ],
                    ephemeral: true
                }).catch(() => { })
            }
        });

        const buttonCollector = message.createMessageComponentCollector({
            time: 60_000,
            componentType: ComponentType.Button,
        });

        buttonCollector.on("collect", async (i) => {
            if (i.user.id !== i.user.id) {
                return i.reply({ content: "Only the command user can use this.", ephemeral: true }).catch(() => { })
            }

            if (i.customId === "caps_active") {
                const capsData = await db.get(`moderation-system/capsSystem/${guild.id}`);

                if (capsData?.enabled === "on") {
                    return i.reply({ content: "❌ This system is already active.", ephemeral: true }).catch(() => { })
                }

                if (!capsData?.channel) {
                    return i.reply({ content: "❌ Please select a channel first!", ephemeral: true }).catch(() => { })
                }

                await db.set(`moderation-system/capsSystem/${guild.id}/status`, "on");

                await i.reply({
                    content: "✅ Caps Lock System is now active.",
                    ephemeral: true
                }).catch(() => { })

                const isSystemActive = capsData?.enabled === "on";
                const threshold = capsData?.threshold;
                const updatedRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel("🟢 | Active")
                        .setCustomId("caps_active")
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(true),

                    new ButtonBuilder()
                        .setLabel("🔴 | Deactivate")
                        .setCustomId("caps_deactive")
                        .setStyle(ButtonStyle.Danger),

                    new ButtonBuilder()
                        .setLabel("🔎 | Reset System")
                        .setCustomId("caps_reset")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setLabel("⬅️")
                        .setCustomId("return")
                        .setStyle(ButtonStyle.Secondary)
                );

                const thresholdRow = new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('caps_thresholds')
                        .setPlaceholder('Select a caps lock threshold')
                        .addOptions(
                            { label: '10%', value: '10' },
                            { label: '20%', value: '20' },
                            { label: '30%', value: '30' },
                            { label: '50%', value: '50' },
                            { label: '70%', value: '70' }
                        )
                );

                const statusMessage = isSystemActive
                    ? `🔴 Deactivate`
                    : `🟢 Active`;

                const activeEmbed = new EmbedBuilder()
                    .setDescription(`# Caps Lock System Setup\n> Log Channel: <#${capsData.channel}>\n> Threshold: **${threshold}%**\n> System status: **${statusMessage}**`)
                    .setColor(isSystemActive ? "Green" : "#74d56a")
                    .setThumbnail(bot.user.avatarURL({ dynamic: true }))
                    .setFooter({ text: `Using the command ${i.user.username}`, iconURL: i.user.avatarURL({ dynamic: true }) });

                const active = await message.edit({ embeds: [activeEmbed], components: [thresholdRow, updatedRow] }).catch(() => { })
            }

            if (i.customId === "aktifs") {
                const d = await db.get(`welcomeSetup/` + guild.id);
                await db.set(`welcomeSetup/` + guild.id, {
                    ...d,
                    enabled: 'on'
                })

                const channel2 = await db.get(`welcomeSetup/` + guild.id);
                if (!channel2) {
                    await i.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setTitle("Unsuccessful")
                                .setDescription("# System Setup Failed.\n- Please set the channels to activate the system.")
                        ],
                        ephemeral: true
                    }).catch(() => { });
                    return;
                }

                const row1 = new ActionRowBuilder()
                    .addComponents(
                        new ChannelSelectMenuBuilder()
                            .setCustomId('welcome_channel')
                            .setPlaceholder("Select channel for Welcome log channel")
                            .setChannelTypes(ChannelType.GuildText)
                            .setDisabled(
                                (await db.fetch(`welcomeSetup/` + guild.id + `/enabled`) === "on") ||
                                (await db.fetch(`welcomeSetup/` + guild.id + `/channel`) !== null)
                            )
                    );

                const row3 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('aktifs')
                            .setLabel("🟢 | Active")
                            .setStyle(ButtonStyle.Success)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId('de-aktifs')
                            .setLabel("🔴 | Deactive")
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setLabel("🔎 | Reset System")
                            .setCustomId("welcome_reset")
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('return')
                            .setLabel("Return")
                            .setStyle(ButtonStyle.Secondary)
                    );

                const Bot = new EmbedBuilder()
                    .setDescription("# Welcome to the system\n> To install the system, first select the welcome channel\n> Then activate it by pressing the `Active` system.\n\n**NOTE**: Use the command again to reset the system")
                    .setFooter({ text: i.user.username + " Requested By", iconURL: i.user.avatarURL() })
                    .setThumbnail(i.user.avatarURL({ dynamic: true } || client.user.avatarURL({})))
                    .setColor("#3498DB");

                await i.update({ embeds: [Bot], components: [row1, row3] }).catch(() => { });
            }

            if (i.customId === "de-aktifs") {
                const d = await db.get(`welcomeSetup/` + guild.id);
                await db.set(`welcomeSetup/` + guild.id, {
                    ...d,
                    enabled: 'off'
                })

                const channel2 = await db.get(`welcomeSetup/` + guild.id);
                if (!channel2) {
                    await i.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setTitle("Unsuccessful")
                                .setDescription("# System Setup Failed.\n- Please set the channels to activate the system.")
                        ],
                        ephemeral: true
                    }).catch(() => { });
                    return;
                }
                const row1 = new ActionRowBuilder()
                    .addComponents(
                        new ChannelSelectMenuBuilder()
                            .setCustomId('welcome_channel')
                            .setPlaceholder("Select channel for Welcome log channel")
                            .setChannelTypes(ChannelType.GuildText)
                            .setDisabled(
                                (await db.fetch(`welcomeSetup/` + guild.id + `/enabled`) === "on") ||
                                (await db.fetch(`welcomeSetup/` + guild.id + `/channel`) !== null)
                            )
                    );

                const row3 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('aktifs')
                            .setLabel("🟢 | Active")
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('de-aktifs')
                            .setLabel("🔴 | Deactive")
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setLabel("🔎 | Reset System")
                            .setCustomId("welcome_reset")
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('return')
                            .setLabel("Return")
                            .setStyle(ButtonStyle.Secondary)
                    );

                const Bot = new EmbedBuilder()
                    .setDescription("# Welcome to the system\n> To install the system, first select the welcome channel\n> Then activate it by pressing the `Active` system.\n\n**NOTE**: Use the command again to reset the system")
                    .setFooter({ text: i.user.username + " Requested By", iconURL: i.user.avatarURL() })
                    .setThumbnail(i.user.avatarURL({ dynamic: true } || client.user.avatarURL({})))
                    .setColor("#3498DB");

                await i.update({ embeds: [Bot], content: "🟢 | System de-activated", components: [row1, row3] }).catch(() => { });
            }

            if (i.customId === "welcome_reset") {
                await db.delete(`welcomeSetup/` + guild.id)

                const channelId = await db.fetch(`welcomeSetup/` + guild.id + `/channel`);
                const channel = guild.channels.cache.get(channelId);
                const row1 = new ActionRowBuilder()
                .addComponents(
                    new ChannelSelectMenuBuilder()
                        .setCustomId('welcome_channel')
                        .setPlaceholder("Select channel for Welcome log channel")
                        .setChannelTypes(ChannelType.GuildText)
                        .setDisabled(
                            (await db.fetch(`welcomeSetup/` + guild.id + `/enabled`) === "on") ||
                            (await db.fetch(`welcomeSetup/` + guild.id + `/channel`) !== null)
                        )
                        .setDefaultChannels([])
                );

            const row3 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('aktifs')
                        .setLabel("🟢 | Active")
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('de-aktifs')
                        .setLabel("🔴 | Deactive")
                        .setStyle(ButtonStyle.Danger)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setLabel("🔎 | Reset System")
                        .setCustomId("welcome_reset")
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('return')
                        .setLabel("Return")
                        .setStyle(ButtonStyle.Secondary)
                );

            const Bot = new EmbedBuilder()
                .setDescription("# Welcome to the system\n> To install the system, first select the welcome channel\n> Then activate it by pressing the `Active` system.\n\n**NOTE**: Use the command again to reset the system")
                .setFooter({ text: i.user.username + " Requested By", iconURL: i.user.avatarURL() })
                .setThumbnail(i.user.avatarURL({ dynamic: true } || client.user.avatarURL({})))
                .setColor("#3498DB");

            await i.update({ embeds: [Bot], content: "🟢 | System reset" , components: [row1, row3] }).catch(() => { });
            }

            if (i.customId === "caps_deactive") {
                const capsData = await db.get(`moderation-system/capsSystem/${guild.id}`);
                await db.set(`moderation-system/capsSystem/${guild.id}/enabled`, "off");

                await i.reply({
                    content: "✅ System deactivated.",
                    ephemeral: true
                }).catch(() => { })

                const isSystemActive = capsData?.enabled === "on";
                const threshold = capsData?.threshold
                const updatedRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel("🟢 | Active")
                        .setCustomId("caps_active")
                        .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                        .setLabel("🔴 | Deactivate")
                        .setCustomId("caps_deactive")
                        .setStyle(ButtonStyle.Danger)
                        .setDisabled(true),

                    new ButtonBuilder()
                        .setLabel("🔎 | Reset System")
                        .setCustomId("caps_reset")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setLabel("⬅️")
                        .setCustomId("return")
                        .setStyle(ButtonStyle.Secondary)
                );

                const thresholdRow = new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('caps_thresholds')
                        .setPlaceholder('Select a caps lock threshold')
                        .addOptions(
                            { label: '10%', value: '10' },
                            { label: '20%', value: '20' },
                            { label: '30%', value: '30' },
                            { label: '50%', value: '50' },
                            { label: '70%', value: '70' }
                        )
                );

                const statusMessage = isSystemActive
                    ? `**🔴 Deactivate**`
                    : `**🟢 Active**`;

                const activeEmbed = new EmbedBuilder()
                    .setDescription(`# Caps Lock System Setup\n> Log Channel: <#${capsData.channel}>\n> Threshold: **${threshold}%**\n> System status: **${statusMessage}**`)
                    .setColor(isSystemActive ? "Red" : "#ce2603")
                    .setThumbnail(bot.user.avatarURL({ dynamic: true }))
                    .setFooter({ text: `Using the command ${i.user.username}`, iconURL: i.user.avatarURL({ dynamic: true }) });

                await message.edit({ embeds: [activeEmbed], components: [thresholdRow, updatedRow] }).catch(() => { })
            }

            if (i.customId === "caps_reset") {
                await db.delete(`moderation-system/capsSystem/${guild.id}`);

                await i.reply({
                    content: "✅ System reset. Set up the system again.",
                    ephemeral: true
                }).catch(() => { })

                await message.edit({ embeds: [embed], components: [row] }).catch(() => { })
            }
        });

        const StringCollector = message.createMessageComponentCollector({
            time: 60_000,
            componentType: ComponentType.StringSelect,
        })

        StringCollector.on("collect", async (i) => {
            if (i.user.id !== i.user.id) {
                return i.reply({ content: "Only the command user can use this.", ephemeral: true }).catch(() => { })
            }

            if (i.customId === "caps_threshold") {
                const selectedThreshold = i.values[0];
                await db.set(`moderation-system/capsSystem/${guild.id}/threshold`, selectedThreshold);

                await i.reply({
                    content: `✅ Threshold has been set to ${selectedThreshold}%.`,
                    ephemeral: true
                }).catch(() => { })

            }
            if (i.customId === "caps_thresholds") {
                const guildId = i.guild.id;
                const selectedThreshold = parseInt(i.values[0]);
                if (isNaN(selectedThreshold)) {
                    return i.reply({ content: "You have chosen an invalid value!", ephemeral: true });
                }
                let currentThreshold = await db.get(`moderation-system/capsSystem/${guildId}/threshold`);
                if (!currentThreshold) currentThreshold = 0;
                const newThreshold = selectedThreshold;
                if (currentThreshold == selectedThreshold) {
                    i.reply({
                        content: `Previous value is already set to **${currentThreshold}%**`,
                        ephemeral: true
                    }).catch(() => { })
                } else {
                    await db.set(`moderation-system/capsSystem/${guildId}/threshold`, newThreshold);
                    i.reply({ content: `✅ The new rate is set to ${selectedThreshold}%\n> Previous rate ${currentThreshold}%`, ephemeral: true }).catch(() => { })
                }
            }

        })

        StringCollector.on("end", () => {
            message.edit({ components: [], content: "**Message Timed Out**" }).catch(() => { });
        })

        collector.on("end", () => {
            message.edit({ components: [], content: "**Message Timed Out**" }).catch(() => { });
        });

        channelCollector.on("end", () => {
            message.edit({ components: [], content: "**Message Timed Out**" }).catch(() => { });
        })

        buttonCollector.on("end", () => {
            message.edit({ components: [], content: "**Message Timed Out**" }).catch(() => { });
        })
    }
};
