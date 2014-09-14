EXAMPLES := $(wildcard *.elm)
TARGETS := $(addprefix build/,$(EXAMPLES:.elm=.html))

INCLUDE_DIR := ..
SCRIPTS := ../../Native/WebAudio.js

.PHONY: all

all: $(TARGETS)

build/%.html: %.elm
	elm -m --scripts=$(SCRIPTS) --src-dir=$(INCLUDE_DIR) $?

