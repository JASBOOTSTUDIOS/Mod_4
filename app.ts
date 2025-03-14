/*
	Problem statement: Client that uses this API to store values
	complains that saving values doesn't work.

	Apparently, API will say that it saved items, but return
	incorrect values when queried. Also, deleting items is erratic,
	causing items to "go back in time" or return nonsensical values.

*/

import express, { type Request, type Response } from "express";
import cors from "cors";

interface MemoryItem {
	id: unknown;
	value: unknown;
}

const savedItems: MemoryItem[] = [];

const app = express();
app.use(express.json());
app.use(express.text());
app.use(cors());

const isValidBody = (
	body: unknown,
):
	| { isValid: true; parsedValue: number | string | object | boolean }
	| { isValid: false; errorMessage: string } => {
	switch (typeof body) {
		case "object":
			return { isValid: true, parsedValue: body === null ? {} : body };
		case "boolean":
			return { isValid: true, parsedValue: body };
		case "string": {
			const asNumber = Number.parseInt(body);
			if (!Number.isNaN(asNumber)) {
				return { isValid: true, parsedValue: asNumber };
			}

			const isBoolean =
				body.toLowerCase().trim() === "true" ||
				body.toLowerCase().trim() === "false";

			if (isBoolean) {
				return {
					isValid: true,
					parsedValue: body.toLowerCase().trim() === "true",
				};
			}

			return { isValid: true, parsedValue: body };
		}
		case "number":
			return {
				isValid: true,
				parsedValue: typeof body === "number" ? body : Number.NaN,
			};
		default:
			return {
				isValid: false,
				errorMessage: `${typeof body} is not valid for item body.`,
			};
	}
};

const isValidId = (
	id: string,
): { isValid: true } | { isValid: false; errorMessage: string } => {
	if (id.length > 20) {
		return {
			isValid: false,
			errorMessage: "Length must be less than 20 characters.",
		};
	}

	const invalidElements = [" ", "_", "!", "?", ";", ".", '"', "'"];
	for (const invalid of invalidElements) {
		if (id.includes(invalid)) {
			return {
				isValid: false,
				errorMessage: `character '${invalid}' is not valid in id.`,
			};
		}
	}

	return { isValid: true };
};

app.get("/items/all", (req: Request, res: Response) => {
	res.json(savedItems);
});

app.get("/items/:id", (req: Request, res: Response) => {
	const validationResult = isValidId(req.params.id);
	if (!validationResult.isValid) {
		res.status(400).json(validationResult.errorMessage);
		return;
	}

	const item = savedItems.find((item) => item.id === req.params.id);

	if (!item) {
		res.status(404).json({ error: "Item not found" });
		return;
	}

	res.json(item);
});

app.patch("/items/:id", (req: Request, res: Response) => {
	const idValidationResult = isValidId(req.params.id);
	const existingElement = savedItems.find((item) => item.id === req.params.id);

	const bodyValidationResult = isValidBody(req.body);
	if (!bodyValidationResult.isValid) {
		res.status(400).json(bodyValidationResult.errorMessage);
		return;
	}

	if (!idValidationResult.isValid) {
		res.status(400).json(idValidationResult.errorMessage);
		return;
	}

	if (!existingElement) {
		res.status(400).json(`Element with id '${req.params.id}' does not exist.`);
	} else {
		existingElement.value = bodyValidationResult.parsedValue;
		res.status(200).json(existingElement);
	}
});

app.post("/items/:id", (req: Request, res: Response) => {
	const idValidationResult = isValidId(req.params.id);
	const bodyValidationResult = isValidBody(req.body);

	if (!bodyValidationResult.isValid) {
		res.status(400).json(bodyValidationResult.errorMessage);
		return;
	}

	if (!idValidationResult.isValid) {
		res.status(400).json(idValidationResult.errorMessage);
	} else {
		if (savedItems.find((item) => item.id === req.params.id)) {
			res
				.status(400)
				.json(`Element with id '${req.params.id}' already exists.`);
		} else {
			const newItem: MemoryItem = {
				id: req.params.id,
				value: bodyValidationResult.parsedValue,
			};
			savedItems.push(newItem);
			res.status(200).json(newItem);
		}
	}
});

app.delete("/items/:id", (req: Request, res: Response) => {
	const validationResult = isValidId(req.params.id);
	if (!validationResult.isValid) {
		res.status(400).json(validationResult.errorMessage);
		return;
	}
	const savedItem = savedItems.findIndex((item) => item.id === req.params.id);

	if (savedItem === -1) {
		res.status(404).json({ error: "Item not found" });
		return;
	}

	const deletedItem = savedItems.splice(savedItem, 1);
	res.json(deletedItem[0]);
});

app.listen(8099, () => {
	console.log("Running on port 8099");
});
