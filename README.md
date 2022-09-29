# Lokinet Control GUI

This repository contains a cross-platform GUI for controlling and observing stats from a locally-running lokinet. See also [loki-network](https://github.com/oxen-io/loki-network).

## Build Instructions

Build deps:

- [nvm](https://github.com/nvm-sh/nvm) or [asdf](https://github.com/asdf-vm/asdf)
- git
- wine (for windows builds)

For node related deps:

- nodejs 17.x with npm and yarn

OR

- [nvm](https://github.com/nvm-sh/nvm) or [asdf](https://github.com/asdf-vm/asdf)

Clone the repo:

    $ git clone --recursive https://github.com/oxen-io/lokinet-gui
    $ cd lokinet-gui

If using asdf:

    $ asdf install

Build the project:

    $ yarn install --frozen-lockfile
    $ yarn dist

### CI Builds

builds from ci can be obtained from our [ci server](https://oxen.rocks)

### Development

It looks like everytime we fix CI builds, dev builds break, and the other side happens too.
So I've decided to remove the dev setup entirely.

To do change the code and see the result, the easiest is to now work on ubuntu, do your change, and run `yarn appImage`. This gets you an appImage in `./release`.

## Env variables

`OPEN_DEV_TOOLS=1` to open dev tools on start up
