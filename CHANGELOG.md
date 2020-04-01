# Change Log

## [v0.5.0] - 2020-04-01

## Added

- multiline cursor selection can be used now for formats (see #21)
- no formulas (eqn*.svg) are listed in file chooser for images (see #19)
- the command **matuc conf init** can be executed now (see #14)

## Changed

- remove leading and trailing whitespaces from title (alternative description) (see #22)

### Fixed

- Fixes some typos in language files
- Fixes some loading errors
- Quotes in alternative texts caused an exception (see #20)
- name to outsourced description file (see #17)
- numbered/unsorted lists format (see #16)
- backslashes in csv-files (see #10)


## [v0.4.0]

## [v0.3.0]

- add function for checking and setting user.name and  user.email (see #12)
   - add input in cloning gui
   - add value in extension setting
   - add function for checking whether values are set
   - values are set only for each repo
- track git remotes


## v0.2.0

- Added more information text during start of extension
- Fixed import issue with umlauts under Windows (see #5)
- Fixed issue with page numbering by matuc (see #6)
- Add more information to clone sucess (see #7)
- Add more settings for cloning the git repo
    - user name can be set (see #8)
    - selection between ssh or https
- Fixed issue with load the .lecture_meta_data.dcxml
- Rewrite insertation of footnotes in text


## v0.1
- Initial release