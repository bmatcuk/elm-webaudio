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

build/elm-runtime.js:
	cp $(shell elm -g) build/

release/elm-runtime.js:
	cp $(shell elm -g) release/

build/WebAudio.js: $(SCRIPTS)
	cat $(SCRIPTS) >> $@

release/WebAudio.js: $(SCRIPTS)
	cat $(SCRIPTS) >> $@

# The following rules are for the "Visual" example:
build/Visual.html: Visual.html build/Visual.js build/elm-runtime.js build/WebAudio.js
ifneq ("$(wildcard .soundcloudkey)","")
	sed 's/YOUR CLIENT ID HERE/$(shell cat .soundcloudkey)/' Visual.html > build/Visual.html
	@echo "** Open $@ in your browser"
else
	cp Visual.html build/Visual.html
	@echo "** Edit $@ to add your SoundCloud API key."
	@echo "** You can also put your key in a file called .soundcloudkey"
	@echo "** in the same directory as this Makefile and it will"
	@echo "** automatically get added when you 'make'"
endif

release/Visual.html: build/Visual.html release/Visual.js
	cp build/Visual.html release/Visual.html

build/Visual.js: Visual.elm
	elm -m -o --src-dir=$(INCLUDE_DIR) $?

release/Visual.js: build/Visual.js
	cp build/Visual.js release/Visual.js

