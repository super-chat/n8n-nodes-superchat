VERSION := $(shell node -p "require('./package.json').version")

.PHONY: tag
tag:
	git tag "v$(VERSION)"
