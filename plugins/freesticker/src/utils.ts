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

export async function convertToGIF(stickerUrl) {
	try {
		// Upload APNG and get its ID
		let form = new FormData();
		form.append("new-image-url", stickerUrl);
		
		const upload_res = await fetch(`https://ezgif.com/apng-to-gif`, {
			method: "POST",
			body: form
		});

		const file_id = upload_res.url.split("/").pop().replace(/\.html$/, '');
		if (!file_id) {
			throw new Error("Failed to retrieve GIF url.")
		}

		// Convert uploaded APNG to GIF
		form = new FormData();
		form.append("file", file_id);
		form.append("size", storage.stickerSize.toString());

		const conversion_res = await fetch(`https://ezgif.com/apng-to-gif/${file_id}.html?ajax=true`, {
			method: "POST",
			body: form
		});
	
		const html_content = await conversion_res.text();

		const gif_url = html_content.split('<img src="')[1].split('" style=')[0]
		if (!gif_url) {
			throw new Error("Failed to retrieve GIF url.")
		}

		return `https:${gif_url}`;
	
	} catch (e) {
		logger.error(`Failed to convert ${stickerUrl} to GIF: `, e);
		return null;
	}
}