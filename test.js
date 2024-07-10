import { strict as assert } from "node:assert";
import { describe, test } from "node:test";

test("test, should pass");

describe("suite 1", () => {
	test("test 1.1, should pass");
	test("test 1.2, should pass");
});

test("test, should fail", () => {
	assert.fail("failure message");
});

describe("suite 2", () => {
	test("test 2.1, should fail", () => {
		assert.fail("nested failure message");
	});
});

test("write to stdout, should pass", () => {
	console.log("stdout entry");
});

test("write to stderr, should pass", () => {
	console.error("stderr entry");
});

describe("suite 3, empty (no assertions), should pass");

describe("suite 4", () => {
	describe("suite 4.1", () => {
		describe("suite 4.1.1", () => {
			test("test 4.1.1.1, should pass");
		});
	});
});

test("throws and fails", () => {
	throw new Error("Failure");
});
