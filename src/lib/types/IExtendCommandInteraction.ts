import { ExtractDoc } from "ts-mongoose";
import { userSchema, channelSchema } from "../DB/schemes";

interface IExtendCommandInteraction {
	state: {
		user: ExtractDoc<typeof userSchema>;
		channel: ExtractDoc<typeof channelSchema>;
	};
}

export default IExtendCommandInteraction;
