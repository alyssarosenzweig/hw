# hw
_A homework toolkit for hackers_

hw is a toolkit for managing your homework as a hacker, in the true sense of the word: someone who wants total control over every aspect of their life for whatever reason, and is willing to write plenty of code to do this. hw follows this philosophy. It's a teensy program that's designed to integrate well out of the box with open technologies like git, markdown, and LaTeX. And for when you need a new feature supported, the codebase is easy to hack on.

hw is how I'm slowly replacing monoliths like Google Drive and LibreOffice with lightweight hackable tools like git and vim. Join me on my journey :)

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
