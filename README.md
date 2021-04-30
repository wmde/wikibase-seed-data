# wikibase-seed-data

## Usage

Run `npm run seed` and pass it the `MW_SERVER` and `MW_SCRIPT_PATH` environment variables and a seed data script via the `--script` or `-s` flag, e.g.
```bash
MW_SERVER=http://default.web.mw.localhost:8080/ MW_SCRIPT_PATH=/mediawiki docker-compose run node npm run seed -- -s './all-property-datatypes.js'
```

## Seed data scripts

* `all-property-datatypes.js` - creates a Property for every datatype supported by the Wikibase
* `item-with-all-statements.js` - creates an Item with statements for ~~every supported datatype~~ datatypes string and time (but in the future it'll hopefully support all of them)
