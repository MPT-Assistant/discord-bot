import { ExtractDoc } from "ts-mongoose";
import { userSchema, channelSchema } from "../DB/schemes";

interface IExtendMessage {
	state: {
		args: RegExpMatchArray;
		user: ExtractDoc<typeof userSchema>;
		channel: ExtractDoc<typeof channelSchema>;
	};
}

export default IExtendMessage;
