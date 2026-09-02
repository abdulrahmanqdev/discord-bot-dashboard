const kick = require("../../kick/kick")
const { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js")
const { db } = require("../../tools")

module.exports = (client, interaction) => {

    setInterval(async() => {
        var guildsData = await db.get("kick") || {}
        var guilds = Object.keys(guildsData)
        for(const guild of guilds) {
            const streamers = Object.keys(guildsData[guild])
            for(const streamer of streamers) {
                const data = guildsData?.[guild]?.[streamer]
                if (data?.status == "off") return
                const isInStream = await client.kickManager.getStream(streamer)
                if (isInStream && !data?.streamId) {
                    const streamerData = await client.kickManager.getStreamer(streamer)
                    const embed = new EmbedBuilder().setAuthor({
                        name: streamerData?.user?.username || streamer,
                        iconURL: streamerData?.user?.profile_pic
                    }).setTitle(isInStream?.session_title).setImage(isInStream?.thumbnail?.src).setFields({
                        name: "Stream Information",
                        value: "> Stream Start Date: <t:" + Math.floor(new Date(isInStream?.created_at).getTime()/1000) + ">\n> Number of Stream Viewers: **" + isInStream?.viewers + "**"
                    }).setColor("#00e701").setFooter({
                        text: "Stream Notification",
                        iconURL: client.user.avatarURL()
                    })
                    await client.channels.cache.get(data?.channel).send({
                        content: "Stream Started | @everyone",
                        embeds: [embed],
                        components: [
                            new ActionRowBuilder().addComponents(
                                new ButtonBuilder().setStyle(ButtonStyle.Link).setURL("https://kick.com/" + streamer).setLabel("Watch").setEmoji(`<:kick_logo_streaming:1266783353638621194>`),
                                new ButtonBuilder().setStyle(ButtonStyle.Link).setURL("https://github.com").setLabel("Support Server").setEmoji(`<:acordnew:1271858808238641233>`)
                            )
                        ]
                    }).catch(() => {})
                    await db.set("kick/" + guild + "/" + streamer + "/streamId", true)
                } else if (!isInStream && data?.streamId) {
                    await db.set(`kick/${guild}/${streamer}/streamId`, false)
                }

            }
        }
    }, 50000)

};

module.exports.conf = {
    name: "ready",
};  