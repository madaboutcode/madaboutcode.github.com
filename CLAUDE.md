# madaboutcode.github.com

Jekyll blog for [madaboutcode.com](https://madaboutcode.com). Jekyll 4.4.1, kramdown, rouge.

## Commands

```bash
./startserver.sh     # Serves http://localhost:4000
bundle exec jekyll build  # Production build
```

## Ruby + Bundler

- System Ruby (2.6.10) is too old — use Homebrew Ruby 3.4.8
- Path: `/opt/homebrew/Cellar/ruby/3.4.8/bin`
- Always use `bundle exec jekyll` — bare `jekyll` won't work
- Gemfile needs `jekyll` and `webrick`

## Build Output

`_site/` is Jekyll build output. Gitignored. Rebuild with `bundle exec jekyll build`.

## Verification

`bundle exec jekyll build` must pass.