install:
	npm ci

develop:
	npm run dev

test:
	npm test

lint:
	npx eslint . --ignore-pattern '**/assets/**'

build:
	NODE_ENV=production npm run build

.PHONY: test
