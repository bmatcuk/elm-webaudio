EXAMPLES := $(wildcard *.elm)
TARGETS := $(addprefix build/,$(EXAMPLES:.elm=.html)) build/Visual.js

INCLUDE_FILES := $(wildcard ../*.elm) $(wildcard ../lib/elm-usermedia/src/*.elm)
SCRIPTS := $(wildcard ../Native/*.js) $(wildcard ../lib/elm-usermedia/src/Native/*.js)

.PHONY: all
all: $(TARGETS)

$(TARGETS): $(INCLUDE_FILES) $(SCRIPTS)

build/%.js: %.elm
	elm-make --yes $(CURDIR)/$< --output $(CURDIR)/$@

build/%.html: %.elm
	elm-make --yes $(CURDIR)/$< --output $(CURDIR)/$@
	@echo "** Open $@ in your browser"

# The following rules are for the "Visual" example:
build/Visual.html: Visual.html build/Visual.js
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

