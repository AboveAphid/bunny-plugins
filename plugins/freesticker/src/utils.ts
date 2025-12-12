import { logger } from "@vendetta";
import { findByStoreName } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";

const { getChannel } = findByStoreName("ChannelStore");

const baseStickerURL = "https://media.discordapp.net/stickers/{stickerId}.{format}?size={size}";

export function isStickerAvailable(sticker, channelId) {
	if (!sticker.guild_id) return true; // Not from a guild, default sticker. No Nitro needed.
	const channelGuildId = getChannel(channelId).guild_id;
	return sticker.guild_id == channelGuildId;
}

export function buildStickerURL(sticker) {
	const format = (sticker.format_type === 4) ? "gif" : "png";
	return baseStickerURL
		.replace("{stickerId}", sticker.id)
		.replace("{format}", format)
		.replace("{size}", storage.stickerSize.toString());
}

export async function convertToGIF(stickerUrl : string) {
	try {
		var gif_sticker_url = stickerUrl.replace(".png", ".gif")
		return gif_sticker_url
	} catch (e) {
		logger.error(`Failed to convert ${stickerUrl} to GIF: `, e);
		return null;
	}
}