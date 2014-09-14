EXAMPLES := $(wildcard *.elm)
TARGETS := $(addprefix build/,$(EXAMPLES:.elm=.html))
RELEASE_TARGETS := $(addprefix release/,$(EXAMPLES:.elm=.html) elm-runtime.js WebAudio.js)

INCLUDE_DIR := ..
SCRIPTS := $(wildcard ../Native/*.js)

.PHONY: all
all: $(TARGETS)

.PHONY: release
release: $(RELEASE_TARGETS)

build/%.html: %.elm
	elm -m $(addprefix --scripts=../,$(SCRIPTS)) --src-dir=$(INCLUDE_DIR) $?
	@echo "** Open $@ in your browser"

release/%.html: %.elm
	elm -m --set-runtime=elm-runtime.js --scripts=WebAudio.js --src-dir=$(INCLUDE_DIR) --build-dir=release/ $?

release/elm-runtime.js:
	cp $(shell elm -g) release/

release/WebAudio.js: $(SCRIPTS)
	cat $(SCRIPTS) >> $@

