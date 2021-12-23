const Discord = require("discord.js");
/**
 * @param {Discord.Client} client
 */
module.exports = (client, instance) => {
        const status = queue =>
            `درجة الصوت: \`${queue.volume}%\` | المصفى: \`${queue.filters.join(', ')
		|| 'Off'}\` | التكرار: \`${
		queue.repeatMode
			? queue.repeatMode === 2
				? 'القائمة بالكامل'
				: 'الأغنية'
			: 'Off'
	}\` | التشغيل التلقائي: \`${queue.autoplay ? 'On' : 'Off'}\``

        client.distube
            .on('playSong', (queue, song) =>
                queue.textChannel.send({
                    content: `يشغل \`${song.name}\` - \`${
                    song.formattedDuration
                }\`\nبواسطة: ${song.user}\n${status(queue)}`,
                }))
            .on('addSong', (queue, song) =>
                queue.textChannel.send({
                    content: `أضيف ${song.name} - \`${song.formattedDuration}\` لقائمة الإنتظار بواسطة ${song.user}`,
                }))
            .on('addList', (queue, playlist) =>
                queue.textChannel.send({
                    content: `أضيف \`${playlist.name}\` قائمة التشغيل (${
                    playlist.songs.length
                } أغنية) لقائمة الإنتظار\n${status(queue)}`,
                }))
            // DisTubeOptions.searchSongs = true
            .on('searchResult', (message, result) => {
                    let i = 0
                    message.channel.send({
                                content: `**أختر من التالى**\n${result
                .map(
                    song =>
                        `**${++i}**. ${song.name} - \`${
                            song.formattedDuration
                        }\``,
                )
                .join(
                    '\n',
                )}\n*أرسل أي شئ مختلف أو أنتظر 30 ثانية للإلغاء`,
        })
        })
        // DisTubeOptions.searchSongs = true
        .on('searchCancel', message => message.channel.send({content:`تم الألغاء`}))
        .on('searchInvalidAnswer', message => message.channel.send({content: `لا توجد إجابة!`}))
        .on('searchNoResult', message => message.channel.send({content: `لا توجد نتيجة!`}))
        .on('error', (textChannel, e) => { console.error(e); textChannel.send({content: `خطأ ×: ${e.slice(0, 2000)}`})})
        .on('finish', queue => queue.textChannel.send({content:'أنتهت قائمة الإنتظار!'}))
        .on('finishSong', queue => queue.textChannel.send({content:'أنتهت الأغنية!'}))
        .on('disconnect', queue => queue.textChannel.send({content:'خرج!'}))
        .on('empty', queue => queue.textChannel.send({content:'فارغ!'}));
}

module.exports.config = {
    displayName: 'Music Events',
    dbName: 'MUSIC EVENTS' // This should NEVER be changed once set, and users cannot see it.
}