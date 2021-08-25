import mongoose from "mongoose";
import { typedModel } from "ts-mongoose";
import * as schemes from "./schemes";

import config from "../../DB/config.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Str = mongoose.Schema.Types.String as any;
Str.checkRequired((v: string) => v != null);

class DB {
	public connection: mongoose.Connection;

	constructor(database: string) {
		this.connection = mongoose.createConnection(
			`mongodb+srv://${config.mongo.login}:${config.mongo.password}@${config.mongo.address}/${database}`,
		);
	}
}

class API_DB extends DB {
	constructor() {
		super("API");
	}

	public models = {
		group: typedModel(
			"group",
			schemes.groupSchema,
			"groups",
			undefined,
			undefined,
			this.connection,
		),

		specialty: typedModel(
			"specialty",
			schemes.specialtySchema,
			"specialties",
			undefined,
			undefined,
			this.connection,
		),

		replacement: typedModel(
			"replacement",
			schemes.replacementSchema,
			"replacements",
			undefined,
			undefined,
			this.connection,
		),

		dump: typedModel(
			"dump",
			schemes.dumpSchema,
			"dumps",
			undefined,
			undefined,
			this.connection,
		),
	};
}

class Bot_DB extends DB {
	constructor() {
		super("discord");
	}

	public models = {
		user: typedModel(
			"user",
			schemes.userSchema,
			"users",
			undefined,
			undefined,
			this.connection,
		),

		channel: typedModel(
			"chat",
			schemes.channelSchema,
			"chats",
			undefined,
			undefined,
			this.connection,
		),
	};
}

class UtilsDB {
	public api = new API_DB();
	public bot = new Bot_DB();
	public config = config;
}

export default new UtilsDB();
