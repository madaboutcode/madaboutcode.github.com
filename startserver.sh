#!/bin/sh
echo Visit http://localhost:4000 in your browser to see the blog
export PATH="/opt/homebrew/Cellar/ruby/3.4.8/bin:$PATH"
bundle exec jekyll serve --livereload --incremental --future "$@"
