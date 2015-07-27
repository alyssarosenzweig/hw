# hw
A homework toolkit for hackers 

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
