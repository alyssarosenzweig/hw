# hw
_A homework toolkit for hackers_

hw is a toolkit for managing your homework as a hacker, in the true sense of the word: someone who wants total control over every aspect of their life for whatever reason, and is willing to write plenty of code to do this. hw follows this philosophy. It's a teensy program that's designed to integrate well out of the box with open technologies like git, markdown, and LaTeX. And for when you need a new feature supported, the codebase is easy to hack on.

hw is how I'm slowly replacing monoliths like Google Drive and LibreOffice with lightweight hackable tools like git and vim. Join me on my journey :)

# Usage
Below is a listing of a few common tasks you might use hw for.

## Install

    $ git clone https://github.com/bobbybee/hw
    $ cd hw
    $ sudo npm install -g

## New Repo

    $ mkdir hw_repo
    $ cd hw_repo
    $ hw init

## New Assignment

    $ hw add Title
    $ hw add "--class=Math class" --format=latex "Assignment Title"

## Print an Assignment

    $ hw print --latest
    $ hw print --pdf Assignment_Title.tex

## Push to remote server

    $ git push origin master

# config.js
When you `init` a new hw repo, a file called `config.js` is created by default containing your personal preferences. In the nature of a true hacker configuration file, this is executable code and is dynamically `require`d by `hw` itself. Here's a quick reference of its options:

## `name`
Your full name, used in the headers of new documents.

## `getDate`
A JavaScript function that returns the current date as a string. Year-Month-Day? Month/Day/Year? Day/Month/Year? Banana/Orange/Strawberry? This is used for document headers.

## `browser`
Your preferred browser, used for printing HTML. This should be the 'command-line accessable name'. That is, you should be able to type `BROWSER http://duckduckgo.com` at the command line, where BROWSER is this option, and DuckDuck Go's homepage should open.

## `useGit`
A simple boolean value of whether hw should use git. The answer is true, by the way ;)

## `defaultFormat`
The default format for new documents, if the `--format` option isn't specified. Setting this appropriately should save some typing..

## `noteFormat`
The default format for notes. Similar to `defaultFormat`, but only used when the `note` command is invoked. I like Markdown for this kind of thing, but to each their own.

# Document formats
Documents in `hw` have a format; some common values might be "markdown", "latex", or "uPresent". Each format specifies the default boilerplate code created with `hw add`, as well as code to print the document and rasterize it to a PDF. While `hw` tries to have some reasonable formats predefined, it's easy to modify the existing formats as well as define new formats.

## Structure of formats
Each format is a node module in the `formats/` directory of the source tree. This module contains some metadata about the format, as well as a variety of functions to perform various operations. Additionally, in order for the format file to be used with `hw`, an entry needs to be made in `formats/index.js` mapping the file extension to the format name. The format name also needs to be identical to the filename of the format module (minus the `.js` extension).

See the source code of `formats/markdown.js` to get a sense of how to write your own module. The API is fairly straightforward and well commented :)
