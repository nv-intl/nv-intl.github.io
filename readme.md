# nv-intl.com

## Simple Contributing

* Read the [Editing Guidelines](#editing-guidelines).
* Navigate to the page you wish to edit.
* Click the button **Edit this Page**.
* A new browser tab will open, leading you to the GitHub online editor.
* There, make your desired changes.
* Provide a title and an optional description of the changes you made.
* Give a name to the branch that will contain your changes. If you don't know what to put there, just leave the default value.
* Finally, when you're happy with everything, click **Propose Changes**.
* GitHub will forward you to a new *pull request* containing your changes.
* The moderators of the wiki will review your changes.
* The moderators might comment suggestions, which you in turn can respond to, and edit your changes accordingly.
* If all suggestions have been resolved, the moderators will approve your changes, transfering your changes directly to the wiki.

## Edit and test locally (Advanced Contributing)

### Prerequisites
* Ruby 2.7
  * Newer or older versions are not compatible.
* `bundle`
  * Install with `gem install bundle`

Run `bundle install` to download all dependencies.

Run `bundle exec jekyll serve` to start the local server.

## Editing Guidelines

### Pages

Wiki pages should be located in the `_wiki` folder and named adequately.

A page `page.md` in the `_wiki` folder will have the link URL
`/wiki/page.html`.

### Links

Link to another page by using `[text](/wiki/page.html)`.
Try to link to other related wiki pages wherever adequate,
so the wiki can become a tight network of pages.

### Images

Images should only be placed in `/assets/images`.

Do not use
```
![description](./assets/images/image.png)
```
for images, as these lack advanced formatting.

Instead, use:
```
{% include image.html image="image.png" description="description" %}
```

**Note:** `description` is completely optional.

**Note:** `image` only requires the file name and assumes it is located in `./assets/images/`.

### References

Create references by simply adding `{description}(<link>)` to the text.
It will be converted client-side to a reference like this [<sup>[42]</sup>](#) and
a respective entry will be added to a reference section at the end of the page.

### Documents & Media

If you have documents or media to contribute to the project,
ask one of the maintainers to upload it to the dedicated Google Drive folder,
so you can reference it in the wiki.

Documents or media that are already available online should not be uploaded
and articles should reference the original source.