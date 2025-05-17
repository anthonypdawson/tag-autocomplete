# VS Code Tag Autocomplete for Markdown Front Matter

This extension provides intelligent tag autocomplete for the `tags:` array in YAML front matter of Markdown files, using a `tags.yaml` file from your workspace. Specifically this has been built to be used with Jekyll projects.

## Features

- Autocomplete suggestions for tags in Markdown front matter
- Reads tags from a user-selected `tags.yaml` file (array or mapping)
- Automatically reloads tag suggestions when `tags.yaml` changes
- Works in any Markdown file in your workspace

## Usage

1. **Install the extension** (locally or from VSIX).
2. Open your workspace in VS Code.
3. Press `Ctrl+Shift+P` and run the command:  
   **“Select tags.yaml for Tag Autocomplete”**
4. Choose your `tags.yaml` file (should be an array or mapping of tags).
5. In any Markdown file, go to the `tags: [ ... ]` line in the YAML front matter.
6. Type a comma or start typing a tag—autocomplete suggestions will appear from your tag list.

## Example `tags.yaml`

```yaml
- devops
- clean-code
- testing
- humor
```
or
```yaml
devops: 5
clean-code: 3
testing: 2
humor: 1
```

## Development

- Clone this repo and run `npm install`
- Build with `npm run compile`
- Launch the extension with `F5` (Extension Development Host)
- Package for distribution with `vsce package`

## Known Limitations

- Suggestions only appear on the `tags: [ ... ]` line in Markdown front matter.
- Only one `tags.yaml` file can be active at a time.
- Does not validate for duplicate tags in the array.

## License

MIT

---

*Happy tagging!*
