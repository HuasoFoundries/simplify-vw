VERSION = $(shell cat package.json | sed -n 's/.*"version": "\([^"]*\)",/\1/p')

SHELL = /usr/bin/env bash

SMASH = $(shell npm bin)/smash



default: build
.PHONY: test  default    ig_reportfactory run  check_version from_dist


build:  docs   handlebars ig_reportfactory 

YELLOW=\033[0;33m
RED=\033[0;31m
WHITE=\033[0m
GREEN=\u001B[32m

version:
	@echo -e "Current version is $(GREEN) ${VERSION} $(WHITE) "


install: 
	npm install 
	npm install jspm@beta --save
	$$(npm bin)/jspm dl-loader
	$$(npm bin)/jspm install

test:
	$$(npm bin)/karma start

docs:
	$$(npm bin)/grunt docs

run:
	$$(npm bin)/serve .

