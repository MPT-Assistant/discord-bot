import { ExtractDoc } from "ts-mongoose";
import { userSchema, channelSchema } from "../DB/schemes";

interface IExtendMessage {
	state: {
		args: RegExpMatchArray;
		user: ExtractDoc<typeof userSchema>;
		channel: ExtractDoc<typeof channelSchema>;
	};
}

interface IExtendButtonInteraction {
	state: {
		args: RegExpMatchArray;
		user: ExtractDoc<typeof userSchema>;
		channel: ExtractDoc<typeof channelSchema>;
	};
}

interface IExtendCommandInteraction {
	state: {
		user: ExtractDoc<typeof userSchema>;
		channel: ExtractDoc<typeof channelSchema>;
	};
}

export { IExtendMessage, IExtendCommandInteraction, IExtendButtonInteraction };
