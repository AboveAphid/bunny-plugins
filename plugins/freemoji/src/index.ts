import { storage } from "@vendetta/plugin";
import { findByStoreName } from "@vendetta/metro";
import nitroChecks from "./patches/nitroChecks";
import sendMessage from "./patches/sendMessage";

// Default settings
storage.emojiSize ??= 48;
storage.hyperlink ??= true;
storage.old_hyperlink ??= !storage.hyperlink; // Cannot be active/disabled while hyperlink is enabled
storage.haveNitro ??= findByStoreName("UserStore").getCurrentUser()?.premiumType !== null;
storage.forceMoji ??= false;

// Migration code, used to be string containing a number but is now just a number
if (typeof storage.emojiSize === "string") storage.emojiSize = parseInt(storage.emojiSize);

const patches = [
    ...nitroChecks,
    ...sendMessage,
];

export const onUnload = () => patches.forEach(p => p());
export { default as settings } from "./Settings";