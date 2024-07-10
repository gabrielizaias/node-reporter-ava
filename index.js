import { red, green, gray, dim } from "kleur/colors";

const suites = [];

export default async function* reporter(source) {
	for await (const event of source) {
		const { type, data } = event;

		switch (type) {
			case "test:dequeue":
				if (data.nesting === 0) {
					suites.push(data.name);
				}
				yield `${prefix(type)}${gray(`dequeued: name: ${data.name} | file: "${data.file}" | nesting: ${data.nesting}`)}\n`;
				break;

			case "test:enqueue":
				yield `${prefix(type)}${gray(`enqueued: name: ${data.name} | file: "${data.file}" | nesting: ${data.nesting}`)}\n`;
				break;

			case "test:watch:drained":
				yield `${prefix(type)}test watch queue drained\n`;
				break;

			case "test:start":
				yield `${prefix(type)}${gray(`started: name: ${data.name} | file: "${data.file}" | nesting: ${data.nesting}`)}\n`;
				break;

			case "test:pass":
				// if (data.details.type === "suite") { break; }
				yield `${prefix(type)}${data.nesting > 0 ? `${suites.at(-1)} ${dim(gray("›"))} ` : ""}${data.name} ${duration(data.details.duration_ms)}
${gray(`  finished: name: ${data.name} | nesting: ${data.nesting} | number: ${data.testNumber} | type: ${data.details.type}`)}\n\n`;
				break;

			case "test:fail":
				// if (data.details.type === "suite") { break; }
				yield `${prefix(type)}${data.nesting > 0 ? `${suites.at(-1)} ${dim(gray("›"))} ` : ""}${data.name} ${duration(data.details.duration_ms)}
${gray(`  finished: name: ${data.name} | nesting: ${data.nesting} | number: ${data.testNumber} | type: ${data.details.type}`)}\n\n`;
				break;

			case "test:plan":
				// end of all tests
				if (typeof data.file === "undefined") {
					yield `${prefix(type)}${gray("─")}\n\n`;
				} else {
					yield `${prefix(type)}${gray(`plan: nesting: ${data.nesting} | count: ${data.count}`)}\n`;
				}
				break;

			case "test:diagnostic":
				yield `${prefix(type)}${gray(`diagnostic:`)} ${data.message}\n`;
				break;

			case "test:stderr":
				yield `${prefix(type)}${gray(`stderr:`)}\n    ${data.message}\n`;
				break;

			case "test:stdout":
				yield `${prefix(type)}${gray(`stdout:`)}\n    ${data.message}\n`;
				break;

			case "test:coverage": {
				// TODO: implement coverage output
				// yield `${prefix(type)}${gray(`coverage: todo`)}\n`;
				break;
			}
		}
	}
}

/** Format test duration output */
function duration(ms) {
	// TODO: format duration to seconds/ms
	return `${dim(gray(`(${ms.toFixed(3)}ms)`))}`;
}

/** Format test prefix by event type */
function prefix(type) {
	switch (type) {
		case "test:pass":
			return `  ${green(`✔`)} `;
		case "test:fail":
			return `  ${red(`✘ [fail]`)} `;
		default:
			return `  `;
	}
}
