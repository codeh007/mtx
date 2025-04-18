export class RequiresProPlanError extends Error {
	constructor(message = "This action requires a pro plan") {
		super(message);
	}
}

export const MakeErrorString = (e: Error) => {
	return `error:${e.message}, stack:${e.stack}`;
};
