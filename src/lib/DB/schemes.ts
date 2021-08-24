import { createSchema, Type } from "ts-mongoose";

const lessonSchema = {
	num: Type.number({ required: true }),
	name: Type.array({ required: true }).of(Type.string({ required: true })),
	teacher: Type.array({ required: true }).of(Type.string({ required: true })),
};

const daySchema = {
	num: Type.number({ required: true }),
	place: Type.string({ required: true }),
	name: Type.string({ required: true }),
	lessons: Type.array({ required: true }).of(lessonSchema),
};

const groupSchema = createSchema({
	name: Type.string({ required: true }),
	specialty: Type.string({ required: true }),
	schedule: Type.array({ required: true }).of(daySchema),
});

const specialtySchema = createSchema({
	name: Type.string({ required: true }),
	groups: Type.array({ required: true }).of(Type.string({ required: true })),
});

const replacementSchema = createSchema({
	date: Type.date({ required: true }),
	group: Type.string({ required: true }),
	detected: Type.date({ required: true }),
	addToSite: Type.date({ required: true }),
	lessonNum: Type.number({ required: true }),
	oldLessonName: Type.string({ required: true }),
	oldLessonTeacher: Type.string({ required: true }),
	newLessonName: Type.string({ required: true }),
	newLessonTeacher: Type.string({ required: true }),
	hash: Type.string({ required: true }),
});

const dumpSchema = createSchema({
	date: Type.date({ required: true }),
	data: Type.mixed({ required: true }),
});

const userSchema = createSchema({
	id: Type.number({ required: true, unique: true }),
	ban: Type.boolean({ required: true }),
	group: Type.string({ required: true }),
	inform: Type.boolean({ required: true }),
	reported_replacements: Type.array({ required: true }).of(
		Type.string({ required: true }),
	),
	reg_date: Type.date({ required: true }),
});

const channelSchema = createSchema({
	id: Type.number({ required: true, unique: true }),
	group: Type.string({ required: true }),
	inform: Type.boolean({ required: true }),
	reported_replacements: Type.array({ required: true }).of(
		Type.string({ required: true }),
	),
});

export {
	daySchema,
	groupSchema,
	specialtySchema,
	replacementSchema,
	dumpSchema,
	userSchema,
	channelSchema,
};
